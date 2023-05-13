import { body, Context, request, responses, summary, tagsAll } from "koa-swagger-decorator";
import * as ValidationService from "../services/validate"
import * as UserService from '../services/user'
import * as AuthService from '../services/auth'
import { User } from "../db/entities/user";
import { IUser } from "../interfaces/user.interface";
import { pick, response } from "../libraries/utils";
import { createUserSchema } from "../db/schemas/user";


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

    
}