import { SwaggerRouter } from "koa-swagger-decorator";
import { auth, user } from '../controllers'

const protectedRouter = new SwaggerRouter();

// AUTH ROUTES
protectedRouter.get('/logout', auth.logoutUser)

// USER ROUTES
protectedRouter.get('/users',user.getUsers)


export { protectedRouter }