import { BaseContext } from 'koa'

export function omit(obj: any, props: string[]) {
    const result = { ...obj };

    props.forEach((prop: string) => {
        delete result[`${prop}`]
    })

    return result;
}

/**
 * Applies the status code and message on ctx body and returns
 * 
 * @param  {BaseContext} context Koa context object for error handling
 * @param  {number} status the statusCode to respond with
 * @param  {any} body the body of the response
 */
export const response = (
    context: BaseContext,
    status: number,
    body?: Record<string, any> | string | Array<Record<string, any>>,
): void => {
    context.status = status
    context.body = body
}