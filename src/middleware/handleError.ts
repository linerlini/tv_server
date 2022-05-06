import { Middleware } from "koa";
import HttpError from "utils/http_error";
import { createRes } from "utils/common";

const handle: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // todo err类型检测失败？
    if (err instanceof HttpError) {
      ctx.status = err.statusCode;
      ctx.body = createRes(err.code, null, err.message);
    } else {
      console.error(err);
      ctx.throw(500, "服务器异常");
    }
  }
};
export default handle;
