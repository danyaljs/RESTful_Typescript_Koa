import path from 'path'
import { IEnvVariables } from 'src/interfaces/config.interface';

const envPath = process.env.SERVER_ENV || path.join(path.dirname(require.main.filename), '../', '.env');

const variables: IEnvVariables = {
    // *** required ***
    JWT_SECRET: { required: true },
    JWT_ACCESS_TOKEN_SECRET: { required: true },
    JWT_REFRESH_TOKEN_SECRET: { required: true },
    NODE_ENV: { required: true },
    // *** required ***

    API_PORT: { default: 3000 },
    JWT_ACCESS_TOKEN_LIFE: { default: '15m' },
    JWT_REFRESH_TOKEN_LIFE: { default: '7d' },
    DB_NAME: { default: 'apidb' },
    DB_HOST: { default: 'localhost' },
    DB_PORT: {default: 27017},
    REDIS_HOST: {default: 'localhost'},
    REDIS_PORT: {default: '6379'},
    REDIS_BLACKLIST_ENABLED: {default: true},
    REDIS_PREFIX: {default: 'restTypescript:'}   
}


export async function validateEnv() {
    try {
        checkRequiredVariable()
        setDefaultValue()
    } catch (e: any) {
        if (e?.code === 'ENOENT')
            throw new Error(`Error in reading '.env' file with path=${envPath}. Make sure it exists.`)
        else throw e
    }
}


function checkRequiredVariable() {
    let requiredNotDefined = []

    for (const k in variables) {
        if (variables[k as keyof IEnvVariables].required) {
            if (process.env[k] === undefined) {
                requiredNotDefined.push(k)
            }
        }
    }

    if (requiredNotDefined.length) {
        let errMsg = 'These env variables should be defined:';
        for (const variableName of requiredNotDefined) errMsg += '\n' + `    - '${variableName}'`;
        throw new Error(errMsg)
    }

}


function setDefaultValue() {
    for (const k in variables) {
        if (!process.env[k] && !variables[k as keyof IEnvVariables].required) {
            process.env[k] = variables[k as keyof IEnvVariables].default
        }
    }
}