import { body, Context, path, request, responses, summary } from "koa-swagger-decorator";
import { response } from "../libraries/utils";
import { createUserSchema, requestValidationSchema } from "../db/schemas/user";
import * as UserService from '../services/user'
import * as ValidationService from '../services/validate'
import { ObjectId } from 'mongodb'
export default class UserController {

    @request('post', '/users')
    @summary('Create a user')
    @body(createUserSchema)
    @responses({
        201: { description: 'user created successfully' },
        400: { description: 'missing parameters, invalid password, validation errors' },
        409: { description: 'user already exists' },
    })
    public static async createUser(context: Context): Promise<void> {
        const userToBeCreated = UserService.createNewUserModel(context)

        await ValidationService.validateRequest(context, userToBeCreated, requestValidationSchema, [
            'name',
            'email',
            'dob',
            'password',
        ])
        await UserService.checkIfUserExists(context, { email: userToBeCreated.email })
        await UserService.saveNewUser(context, userToBeCreated)
        response(context, 201, 'UserCreated')


    }


    @request('get', '/users')
    @summary('Find all users')
    @responses({
        200: { description: 'Success' },
        400: { description: 'Error' },
        401: { description: 'Token authorization error' },
        404: { description: 'Users not found' },
    })
    public static async getUsers(context: Context): Promise<void> {
        response(context, 200, await UserService.findAllUsers(context, {}))
    }

    @request('get', '/users/{id}')
    @summary('Find user by id')
    @path({ id: { type: 'string', required: true, description: 'id of user to fetch' } })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, user not found' },
        401: { description: 'token authorization error' },
    })
    public static async getUser(context: Context): Promise<void> {
        await ValidationService.validateRequest(context, { _id: context.params.id }, requestValidationSchema, [
            '_id',
        ])
        
        response(context, 200, await UserService.findUser(context, { _id: new ObjectId(context.params.id) }))
    }
}