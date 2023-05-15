import { config } from "../config/config";
import { DataSource } from "typeorm";
import { BlackList, createBlackList, STORE_TYPE } from "jwt-blacklist";

let appDataSource: DataSource;
export async function setupConnection(drop: boolean = false): Promise<DataSource> {

    appDataSource = new DataSource({
        type: 'mongodb',
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        useNewUrlParser: true,
        synchronize: true,
        useUnifiedTopology: true,
        entities: config.dbEntitiesPath
    })

    return appDataSource.initialize()
}

export async function blacklistConnection(): Promise<BlackList> {
    return createBlackList({
        daySize: 10000,
        errorRate: 0.001,
        storeType: STORE_TYPE.REDIS,
        redisOptions: {
            host: config.redis.host,
            port: config.redis.port,
            key: config.redis.blackListKeyName,
        },
    })
}
export { appDataSource }