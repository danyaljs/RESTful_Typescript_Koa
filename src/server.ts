import { Server } from 'http'
import koa from 'koa'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { createServer } from 'http'
import { staticRouter } from './routes/static'
import { config } from './config/config'
import { unprotectedRouter } from './routes/unprotected'
import { setupConnection } from './db/connections'
import { protectedRouter } from './routes/protected'
import jwt from 'koa-jwt'

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

    // these routes are NOT protected by the JWT middleware
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

    // JWT middleware -> below this line routes are only reached if JWT token is valid
    app.use(jwt({ secret: config.jwt.accessTokenSecret }).unless({ path: [/^\/assets|swagger-/] }))

    // These routes are protected by the JWT middleware
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())


    console.log(`Server running on port ${config.apiPort}`)

    return createServer(app.callback()).listen(config.apiPort)
}

setupConnection().then(() => {
    server()
}).catch(e => {
    console.log(e)
    process.exit(1)
})
