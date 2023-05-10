export interface IJwtSecret {
    accessTokenSecret: string;
    accessTokenLife: string;
    refreshTokenSecret: string;
    refreshTokenLife: string;
}

export interface IRedisConnDetails {
    port: number;
    host: string;
    password?: string;
    blackListKeyName?: string;
    blackListEnabled?: boolean;
}


export interface IConfig {
    dbPort: number;
    dbHost: string;
    dbName: string;
    nodeEnv: string;
    apiPort: number;
    debugLoggin: boolean;
    jwt: IJwtSecret;
    redis: IRedisConnDetails;
    dbEntitiesPath: string[]
}

export interface IEnvVariables {
    API_PORT: IEnvType
    NODE_ENV: IEnvType
    JWT_SECRET: IEnvType
    JWT_ACCESS_TOKEN_SECRET: IEnvType
    JWT_ACCESS_TOKEN_LIFE: IEnvType
    JWT_REFRESH_TOKEN_LIFE: IEnvType
    JWT_REFRESH_TOKEN_SECRET: IEnvType
    DB_NAME: IEnvType
    DB_PORT: IEnvType
    DB_HOST: IEnvType
    REDIS_HOST: IEnvType
    REDIS_PORT: IEnvType
    REDIS_BLACKLIST_ENABLED: IEnvType
    REDIS_PREFIX: IEnvType
}

interface IEnvType {
    default?: any
    required?: boolean
}