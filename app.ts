import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import staticServe from 'koa-static'
import historyFallback from 'koa2-connect-history-api-fallback'
import path from 'path'
// todo 解决别名问题
import errorHandle from './src/middleware/handleError'
import routes from './src/routes/index'

const server = new Koa()
server.use(bodyParser({}))
server.use(errorHandle)
server.use(
  historyFallback({
    whiteList: ['/api'],
  }),
)
server.use(staticServe(path.resolve(__dirname, 'dist')))
server.use(routes.routes())
server.use(routes.allowedMethods())

server.listen(3000)
