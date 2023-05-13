import jwt from 'jsonwebtoken'
import { DecodedJwtToken } from 'src/interfaces/auth.interface'
import { config } from '../config/config'


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
