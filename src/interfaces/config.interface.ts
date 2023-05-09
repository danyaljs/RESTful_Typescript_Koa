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
    nodeEnv: string;
    port: number;
    debugLoggin: boolean;
    dbsslConn?: boolean;
    jwt: IJwtSecret;
    redis: IRedisConnDetails;
    databaseUrl: string;
    dbEntitiesPath: string[]
}