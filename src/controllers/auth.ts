import { body, Context, description, request, responses, summary, tagsAll } from "koa-swagger-decorator";
import * as ValidationService from "../services/validate"
import * as UserService from '../services/user'
import * as AuthService from '../services/auth'
import { User } from "../db/entities/user";
import { IUser } from "../interfaces/user.interface";
import { pick, response } from "../libraries/utils";
import { createUserSchema } from "../db/schemas/user";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";

@tagsAll(['Auth'])
export default class AuthController {


    @request('post', '/login')
    @summary('Log a user in')
    @body(pick(createUserSchema, 'email', 'password'))
    @responses({
        200: { description: 'successfully logged in' },
        400: { description: 'missing fields' },
        401: { description: 'unauthorized, missing/invalid jwt token, wrong password' },
        404: { description: 'user not found' },
    })
    public static async loginUser(context: Context): Promise<void> {

        ValidationService.validateRequiredProperties(context, context.request.body, ['email', 'password'])
        const body = <IUser>context.request.body;

        const user = <User>await UserService.findUser(context, { where: { email: body.email } }, false)

        await UserService.checkIfUserPasswordCorrect(context, user, body.password)

        user.refreshToken = AuthService.signRefreshToken(user.email)

        await UserService.updateUser(context, user);

        const accessToken = AuthService.signAccessToken({ id: user._id, email: user.email })

        response(context, 200, { token: accessToken })
    }



    @request('get', '/refresh')
    @summary('Get the refresh token')
    @description('The user must already be authorized to used this route to get the refresh token')
    @responses({
        200: { description: 'still valid access token, successfully refreshed token' },
        400: { description: 'missing fields' },
        403: { description: 'unauthorized, missing/invalid jwt token' },
        404: { description: 'user not found' },
    })
    public static async refreshToken(context: Context): Promise<void> {
        const token = (context.header?.authorization && context.header.authorization.split(' ')[1]) || ''
        const decoded = AuthService.verifyToken(context, token, 'access')

        
        if (!ValidationService.isExpired(decoded.exp))
            return response(context, 200, {
                token: jwt.sign(decoded, config.jwt.accessTokenSecret)
            })

        const user = <User>await UserService.findUser(context, { where: { email: decoded.email } }, false)
        AuthService.verifyToken(context, user.refreshToken || 'aaaaa', 'refresh')
        response(context, 200, {
            token: AuthService.signAccessToken({
                id: user._id,
                email: user.email,
                expiresIn: config.jwt.accessTokenLife,
            })
        })
    }


    @request('get', '/logout')
    @summary('Log a user out')
    @responses({
        200: { description: 'user successfully logged out' },
        400: { description: 'missing fields' },
        401: { description: 'invalid access token, user not logged in' },
        404: { description: 'user not found' },
    })
    public static async logoutUser(context:Context): Promise<void> {
        AuthService.verifyUserLoggedIn(context)

        const user = <User> await UserService.findUser(context, { where: { email: context.state.user.email } }, false)

        user.refreshToken = 'removed'

        await UserService.updateUser(context, user)

        response(context, 200)
    }
}