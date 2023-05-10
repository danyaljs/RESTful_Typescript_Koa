import { config } from "../config/config";
import { DataSource } from "typeorm";

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


export {appDataSource}