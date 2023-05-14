import { SwaggerRouter } from "koa-swagger-decorator";
import { auth, user } from '../controllers'

const protectedRouter = new SwaggerRouter();

protectedRouter.get('/logout', auth.logoutUser)



export { protectedRouter }