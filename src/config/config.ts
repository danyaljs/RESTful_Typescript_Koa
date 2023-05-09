import dotenv from 'dotenv'
import { IConfig, IJwtSecret, IRedisConnDetails } from '../interfaces/config.interface'
import { REDIS_BLACKLIST_KEYNAME } from './redis.constant';


dotenv.config({ path: '.env' })

// mongo
const isTestMode = process.env.NODE_ENV === 'test',
    isDevelopmentMode = process.env.NODE_ENV === 'development',
    databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/apidb';

// redis defaults
const redis: IRedisConnDetails = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +process.env.REDIS_PORT || 6379,
    blackListEnabled: !!process.env.REDIS_BLACKLIST_ENABLED || isTestMode,
    blackListKeyName: REDIS_BLACKLIST_KEYNAME
}

const config: IConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: + (process.env.PORT || 3000),
    debugLoggin: isDevelopmentMode,
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'sec-code-123!.',
        accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE || '15m',
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'sec-code-123!.',
        refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE || '24h'
    },
    redis,
    databaseUrl,
    dbEntitiesPath: [...(isDevelopmentMode || isTestMode ? ['src/entities/**/*.ts'] : ['dist/entities/**/*.js'])],
}

export { config }