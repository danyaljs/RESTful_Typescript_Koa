import { body, Context, request, responses, summary } from "koa-swagger-decorator";
import { response } from "../libraries/utils";
import { createUserSchema, requestValidationSchema } from "../db/schemas/user";
import * as UserService from '../services/user'
import * as ValidationService from '../services/validate'
import { user } from ".";
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


    public static async getUsers(context:Context): Promise<void> {
        response(context,200,await UserService.findAllUsers(context,{}))
    }
}