import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { Context } from "koa-swagger-decorator"
import { ObjectId } from 'mongodb'
import * as errors from '../libraries/errors'

/**
 * Validates an object against an ajv schema
 * 
 * @param {Context} context Koa context object for error handling
 * @param {Record<string, any>}reqObject The object to be validated
 * @param {Record<string, any>} entitySchema The ajv schema to be used
 * @param {Array<string>} required An array of required object key props e.g. ['id', 'name']
 * @returns {Promise<void>} array of errors if any. undefined otherwise
 */
export const validateRequest = async (
    context: Context,
    reqObject: Record<string, any>,
    entitySchema: Record<string, any>,
    required: Array<string>,
): Promise<void> => {
    if (required.length > 0) validateRequiredProperties(context, reqObject, required)

    if (required.includes('password')) validatePassword(context, reqObject.password)

    if (required.includes('_id')) validateMongoId(context)

    const ajv = new Ajv()

    addFormats(ajv)

    const validate = ajv.compile({ ...entitySchema, required })
    const valid = await validate(reqObject)


    if (!valid && validate.errors && validate.errors.length > 0) {
        context.throw(new errors.RequestValidationErrors('RequestValidationErrors'))
    }

    return
}

/**
 * returns properties missing from an object if any
 * 
 * @param {Context} context Koa context object for error handling
 * @param {Record<string, any>} objectToValidate the object to validate
 * @param {Array<string>} required an array of required property names
 * @returns {Array<string>} an array of strings of the keys of the missing properties
 */
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

/**
 * Validates a mongo id. Throws an error if invalid
 * 
 * @param {Context} context Koa context Object for error handling
 */
export const validateMongoId = (context: Context): void => {

    if (!ObjectId.isValid(context.params.id))
        context.throw(new errors.InvalidUserID())
}

/**
 * Validates a user's passwords against common recommendations. Throws an error if invalid
 * 
 * @param  {Context} context Koa context object for error handling
 * @param  {string} string the password to be validated
 */
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