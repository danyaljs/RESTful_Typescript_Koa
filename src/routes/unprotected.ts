import { SwaggerRouter } from "koa-swagger-decorator";
import { auth, user } from '../controllers'

const unprotectedRouter = new SwaggerRouter()


// Auth
unprotectedRouter.post('/login')
unprotectedRouter.get('refresh')


// User
unprotectedRouter.post('/users')



export { unprotectedRouter }