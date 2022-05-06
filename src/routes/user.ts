import { getCollections } from 'model/collection'
import HttpError from 'utils/http_error'
import { createRes } from 'utils/common'
import Router from '@koa/router'
import User from 'model/user'
import { ResponseCode } from 'utils/constants'
import { sign, verify, decodeToken } from 'utils/jwt'

const route = new Router({
  prefix: '/user',
})

function checkValue(data: object, target: number) {
  const values = Object.values(data)
  return (
    values.reduce((count, cur) => {
      return count + !!cur
    }, 0) === target
  )
}
// 用户注册
route.post('/register', async (ctx) => {
  const { account, password, userName } = ctx.request.body
  if (!checkValue(ctx.request.body, 3)) {
    throw new HttpError(ResponseCode.EMPTY_VALUE, '缺少参数', 200)
  }
  const result = await User.createNewUser(account, password, userName)
  const token = await sign(account)
  ctx.cookies.set('key', token, {
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: true,
  })
  ctx.body = createRes(ResponseCode.SUCCESS, (result as any).dataValues, '注册成功')
})
// 用户登录
route.post('/login', async (ctx) => {
  const { account, password } = ctx.request.body
  const user = await User.getUserByAccount(account)
  if (user) {
    const truePassword = user?.getDataValue('password')
    if (truePassword === password) {
      const collections = await getCollections(account)
      const resData = {
        userInfo: (user as any).dataValues,
        collections,
      }
      const token = await sign(account)
      ctx.cookies.set('key', token, {
        maxAge: 2 * 60 * 60 * 1000,
        overwrite: true,
      })
      ctx.body = createRes(ResponseCode.SUCCESS, resData, '登录成功')
    } else {
      ctx.body = createRes(ResponseCode.VALUE_WRONG, null, '账户与密码不符')
    }
  } else {
    ctx.body = createRes(ResponseCode.EMPTY_VALUE, null, '该账号不存在')
  }
})
// 自动登录
route.get('/auto', async (ctx) => {
  const key = ctx.cookies.get('key')
  const result = await verify(key)
  if (result === 'success') {
    const { account } = await decodeToken(key!)
    const userInfo = await User.getUserByAccount(account)
    if (userInfo) {
      ctx.body = createRes(ResponseCode.SUCCESS, userInfo, '')
    } else {
      ctx.body = createRes(ResponseCode.VALUE_WRONG, null, '请重新登录')
    }
  } else if (result === 'timeout') {
    ctx.body = createRes(ResponseCode.TOKEN_OUT, null, '登录过期，请重新登录')
  } else {
    ctx.body = createRes(ResponseCode.TOKEN_WRONG, null, '令牌无效，请重新登录')
  }
})
route.get('/refresh', async (ctx) => {
  const key = ctx.cookies.get('key')
  const { account } = await decodeToken(key!)
  const token = await sign(account)
  ctx.cookies.set('key', token, {
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: true,
  })
  ctx.body = createRes(ResponseCode.SUCCESS, null, '刷新成功')
})
route.get('/logout', async (ctx) => {
  ctx.cookies.set('key', '', {
    overwrite: true,
  })
  ctx.body = createRes(ResponseCode.SUCCESS, null, '退出成功')
})
export default route
