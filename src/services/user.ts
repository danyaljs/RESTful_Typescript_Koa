
import { Context } from "koa-swagger-decorator"
import { Repository } from "typeorm"
import { appDataSource } from "../db/connections"
import { User } from "../db/entities/user"
import { IUser, IUserPublic } from "../interfaces/user.interface"
import * as errors from "../libraries/errors"


/**
 * Returns a new User model for saving a new user
 * 
 * @param  {Context} context Koa context object
 * @returns {User} the created user model
 */
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

/**
 * saves a new user in the User collection
 * 
 * @param {Context} context koa context object
 * @param {User} user the user to be saved
 * @returns {Promise<User>} a promisee with the saved user
 */
export const saveNewUser = async function (context: Context, user: User): Promise<User> {

    if (typeof user.dob === 'string') user.dob = new Date(user.dob)
    try {
        await user.hashPassword()

        const userRepository = appDataSource.getRepository(User)
        return userRepository.save(user)
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }
}

/**
 * Checks if the user already exists in the collection
 * 
 * @param {Context} context koa context object
 * @param {Record<string, any>} qryObj a database query object
 * @returns {Promise<void>} a void promise if user doesn't exists. throws error if user already exists 
 */
export const checkIfUserExists = async function (context: Context, qryObj: Record<string, any>) {

    try {
        const userRepository = appDataSource.getRepository(User)
        if (!await userRepository.findOne(qryObj)) return
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }

    context.throw(new errors.UserAlreadyExists())
}

/**
 * Fetches a single user from the user collection
 * 
 * @param  {Context} context Koa context object
 * @param  {Record<string, any>} qryObj a database query object
 * @param  {boolean} isPublic whether the returned user object should hide sensitive fields. true by default
 * @returns {Promise<User|IUserPublic>} a promise with the fetched user
 */
export const findUser = async function (context: Context, qryObj: Record<string, any>, isPublick: boolean = true): Promise<User | IUserPublic> {

    const userRepository = appDataSource.getRepository(User);
    let user;

    try {
        user = await userRepository.findOne(qryObj);
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }

    if (!user) context.throw(new errors.UserNotFound())

    return isPublick ? user.public() : user


}

/**
 * Checks if the users password matches the saved hash
 * 
 * @param  {Context} context Koa context object
 * @param  {User} user the user whose password is to be checked
 * @param  {string} password
 * @returns {Promise<void>} a void promise if correct. throws otherwise
 */
export const checkIfUserPasswordCorrect = async function (context: Context, user: User, password: string): Promise<void> {

    if (!(await user.checkIfUnencryptedPasswordIsValid(password)))
        context.throw(new errors.InvalidUserPassword('WrongPassword'))

    return
}

/**
 * saves an updated user in th user collection
 * 
 * @param {Context} context koa context object
 * @param {User} user the user to be saved
 * @returns {Promise<User>} a promise with the saved updated user
 */
export const updateUser = async function (context: Context, user: User): Promise<User> {
    const userRepository: Repository<User> = appDataSource.getRepository(User);

    if (typeof user.dob === 'string') user.dob = new Date(user.dob)

    try {
        delete user.password;
        delete user.createdAt;

        return userRepository.save(user);
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }
}

/**
 * Fetches all users in the user collection
 * 
 * @param  {Context} context Koa context object
 * @param  {Record<string, any>} qryObj a database query object
 * @returns {Promise<Array<UserPublic>>} a promise with array of fetched users
 */
export const findAllUsers = async function (context: Context, qryObj: Record<string, any>): Promise<Array<IUserPublic>> {
    const userRepository = appDataSource.getRepository(User)

    let users = []

    try {
        users = await userRepository.find(qryObj)
    } catch (e) {
        context.throw(new errors.InternalServerError())
    }

    return users.map((user: User): IUserPublic => user.public())
}