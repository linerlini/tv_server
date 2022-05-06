import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
// todo 解决别名问题
import errorHandle from './src/middleware/handleError'
import routes from './src/routes/index'

const server = new Koa()
server.use(bodyParser({
}))
server.use(errorHandle)
server.use(routes.routes())
server.use(routes.allowedMethods())

server.listen(3000)
