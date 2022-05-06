import { ResponseCode } from 'utils/constants'
import { createRes } from 'utils/common'
import { Middleware } from 'koa'
import { verify } from 'utils/jwt'
import { withoutVerifyRoute } from '../config/index'

const verifyMiddleware: Middleware = async (ctx, next) => {
  const { url } = ctx
  if (withoutVerifyRoute.includes(url)) {
    await next()
  } else {
    const key = ctx.cookies.get('token')
    const result = await verify(key)
    if (result === 'success') {
      await next()
    } else if (result === 'timeout') {
      ctx.body = createRes(ResponseCode.TOKEN_OUT, null, 'token过期')
    } else {
      ctx.body = createRes(ResponseCode.TOKEN_WRONG, null, 'token无效')
    }
  }
}
export default verifyMiddleware
