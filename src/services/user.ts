
import { Context } from "koa-swagger-decorator"
import { appDataSource } from "../db/connections"
import { User } from "../db/entities/user"
import { IUser } from "../interfaces/user.interface"
import * as errors from "../libraries/errors"


export const createNewUserModel = function (context: Context): User {
    const user: User = new User()

    const body = <IUser>context.request.body
    user.name = body.name
    user.email = body.email
    user.password = body.password
    user.dob = body.dob
    user.address = body.address || ''
    user.description = body.description || ''

    return user
}


export const saveNewUser = async function (context: Context, user: User) {

    if (typeof user.dob === 'string') user.dob = new Date(user.dob)
    try {
        await user.hashPassword()

        const userRepository = appDataSource.getRepository(User)
        await userRepository.save(user)
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }
}

export const checkIfUserExists = async function (context: Context, qryObj: Record<string, any>) {

    try {
        const userRepository = appDataSource.getRepository(User)
        if (!await userRepository.findOne(qryObj)) return
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }

    context.throw(new errors.UserAlreadyExists())
}