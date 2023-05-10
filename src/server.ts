import { Server } from 'http'
import koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createServer } from 'http'
import { staticRouter } from './routes/static'
import { config } from './config/config'
import { unprotectedRouter } from './routes/unprotected'
import { setupConnection } from './providers/connections'

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
    console.log(`Server running on port ${config.apiPort}`)

    return createServer(app.callback()).listen(config.apiPort)
}

setupConnection().then(() => {
    server()
}).catch(e => {
    console.log(e)
    process.exit(1)
})
