import { BaseContext } from 'koa'
import { Context } from 'koa-swagger-decorator';

/**
 * 
 * @param {object} obj The source object.
 * @param {...(string|string[])} keys The property paths to omit.
 * @returns {object} Returns the new object.
 */
export function omit<T extends object, k extends keyof T>(obj: T, ...keys: k[]): object {
    keys.forEach(key => {
        delete obj[key]
    })
    return obj
}

/**
 * 
 * @param {object} obj  The source object
 * @param {...(string|string[])} keys The property paths to pick.
 * 
 * @returns {object} Returns the new object.
 */
export function pick<T extends object, k extends keyof T>(obj: T, ...keys: k[]): object {
    const ret: any = {}
    keys.forEach(key => {
        ret[key] = obj[key]
    })

    return ret
}

/**
 * Applies the status code and message on ctx body and returns
 * 
 * @param  {Context} context Koa context object for error handling
 * @param  {number} status the statusCode to respond with
 * @param  {any} body the body of the response
 */
export const response = (
    context: Context,
    status: number,
    body?: Record<string, any> | string | Array<Record<string, any>>,
): void => {
    context.status = status
    context.body = body
}