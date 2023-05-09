import { Server } from 'http'
import koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createServer } from 'http'
import { staticRouter } from './routes/static'
import { config } from './config/config'
import { unprotectedRouter } from './routes/unprotected'


export const server = function (): Server {

    const app = new koa();

    /* 
    Provides important security headers to make app more secure
    Enable cors 
    Enable bodyParser
    */
    app.use(helmet())
        .use(cors())
        .use(bodyParser())

    app.use(staticRouter.routes()).use(staticRouter.allowedMethods())

    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())
    console.log(`Server running on port ${config.port}`)

    return createServer(app.callback()).listen(config.port)
}

server()