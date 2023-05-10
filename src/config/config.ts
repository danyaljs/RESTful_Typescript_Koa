import { validateEnv } from './dotenv';
import { IConfig, IRedisConnDetails } from '../interfaces/config.interface'
import { REDIS_BLACKLIST_KEYNAME } from './redis.constant';

validateEnv()

// mongo
const isTestMode = process.env.NODE_ENV === 'test',
    isDevelopmentMode = process.env.NODE_ENV === 'development'

// redis defaults
const redis: IRedisConnDetails = {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    blackListEnabled: !!process.env.REDIS_BLACKLIST_ENABLED || isTestMode,
    blackListKeyName: REDIS_BLACKLIST_KEYNAME
}

const config: IConfig = {
    nodeEnv: process.env.NODE_ENV,
    dbPort: +process.env.DB_PORT,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    apiPort: + process.env.API_PORT,
    debugLoggin: isDevelopmentMode,
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'sec-code-123!.',
        accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE || '15m',
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'sec-code-123!.',
        refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE || '24h'
    },
    redis,
    dbEntitiesPath: [...(isDevelopmentMode || isTestMode ? ['src/db/entities/**/*.ts'] : ['dist/db/entities/**/*.js'])],
}


export { config }