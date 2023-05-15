import jwt from 'jsonwebtoken'
import { Context } from 'koa-swagger-decorator'
import { DecodedJwtToken } from '../interfaces/auth.interface'
import { config } from '../config/config'
import * as errors from '../libraries/errors'
import { BlackList } from 'jwt-blacklist'
import { blacklistConnection } from '../db/connections'
import { User } from '../db/entities/user'

/**
 * signs a new jwt refresh token
 * 
 * @param {string} email 
 * @returns {string} the signed(encoded) jwt refresh token
 */
export const signRefreshToken = (email: string): string => jwt.sign({ email }, config.jwt.refreshTokenSecret, { expiresIn: config.jwt.refreshTokenLife })


/**
 * 
 * @param {DecodedJwtToken} param0 -  an object with params to sign the jwt token
 * @returns {string} the signed(encoded) jwt access token
 */
export const signAccessToken = ({ id, email, expiresIn }: DecodedJwtToken): string => jwt.sign({ id, email, expiresIn }, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })


/**
 * Verifies the signature of a token
 * 
 * @param {Context} context koa context object for error handling
 * @param {string} token the token to be verified
 * @param {string} type the type of token. either 'access' or 'refresh'
 * @returns {DecodedJwtToken} the object that is the decoded jwt token
 */
export const verifyToken = function (context: Context, token: string, type: 'access' | 'refresh'): DecodedJwtToken {
    try {
        const secret = type === 'access' ? config.jwt.accessTokenSecret : config.jwt.refreshTokenSecret
        const result = jwt.verify(token, secret, { ignoreExpiration: type === 'access' })

        if (typeof result === 'string' || (result.constructor === Object && !result.hasOwnProperty('email')))
            context.throw(new errors.InvalidToken())

        return <DecodedJwtToken>result
    } catch (e) {
        context.throw(new errors.RevokedToken())
    }
}

/**
 * Verifies if a user's token is valid
 *
 * @param  {Context} context Koa Context object for error handling
 */
export const verifyUserLoggedIn = function (context: Context) {
    if (!context.state.user)
        context.throw(new errors.UserNotLoggedIn())
}

/**
 *  Adds a token to the redis token blacklist
 * 
 * @param  {Context} context Koa Context object
 * @returns {Promise<void>} a void promise
 */
export const revokeToken = async function (context: Context): Promise<void> {
    const tokenToRevoke = (context.header?.authorization && context.header.authorization.split('')[1]) || ''

    try {
        const tokenBlacklist: BlackList = await blacklistConnection();

        await tokenBlacklist.add(tokenToRevoke)
    } catch (e) {
        console.log(e)
    }
}

export const verifyTokenEmail = async function (context: Context,user:User): Promise<void> {
    if (context.state?.user?.email !== user.email) context.throw(new errors.UserPermissionDenied())
}