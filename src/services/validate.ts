import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { Context } from "koa-swagger-decorator"

import * as errors from '../libraries/errors'

export const validateRequest = async (
    context: Context,
    reqObject: Record<string, any>,
    entitySchema: Record<string, any>,
    required: Array<string>,
): Promise<void> => {
    if (required.length > 0) validateRequiredProperties(context, reqObject, required)

    if (required.includes('password')) validatePassword(context, reqObject.password)


    const ajv = new Ajv()

    addFormats(ajv)

    const validate = ajv.compile({ ...entitySchema, required })
    const valid = await validate(reqObject)


    if (!valid && validate.errors && validate.errors.length > 0) {
        context.throw(new errors.RequestValidationErrors('RequestValidationErrors'))
    }

    return
}


export const validateRequiredProperties = (
    context: Context,
    objectToValidate: Record<string, any>,
    required: Array<string>,
): Array<string> => {
    const missing = []

    for (const property of required)
        if (!objectToValidate.hasOwnProperty(property) || objectToValidate[property] == undefined) missing.push(property)

    if (missing.length > 0) context.throw(new errors.MissingRequestParameters(missing.join(', ')))

    return missing
}


export const validatePassword = (context: Context, string: string): void => {
    if (string.length < 6)
        context.throw(new errors.InvalidUserPassword('PasswordShorterThan6Characters'))

    if (string.length > 50)
        context.throw(new errors.InvalidUserPassword('PasswordLongerThan50Characters'))

    if (!string.match(/(?=.*\d)/))
        context.throw(new errors.InvalidUserPassword('MissingNumericCharacter'))

    if (!string.match(/(?=.*[A-Z])/))
        context.throw(new errors.InvalidUserPassword('MissingUppercaseCharacter'))

    if (!string.match(/(?=.*[a-z])/))
        context.throw(new errors.InvalidUserPassword('MissingLowercaseCharacter'))

    if (!string.match(/(?=.*[^\dA-Za-z])/))
        context.throw(new errors.InvalidUserPassword('MissingSpecialCharacter'))
}

/**
 * Checks if a unix timestamp is in the past
 * 
 * @param  {number} exp a unix timestamp to check
 * @returns {boolean} true if unix timestamp is in the past. false otherwise
 */
export const isExpired = (exp: number): boolean => Date.now() >= exp * 1000