import { Server } from 'http'
import koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createServer } from 'http'
import { staticRouter } from './routes/static'


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

    console.log(`Server running on port 3000`)

    return createServer(app.callback()).listen(3000)
}

server()