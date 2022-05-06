import HttpError from "utils/http_error";
import { createRes } from "utils/common";
import Router from "@koa/router";
import Video from "model/video";
import { ResponseCode, MovieType, MovieTypeArr } from "utils/constants";

const router = new Router({
  prefix: "/movie",
});

router.get("/movies", async (ctx) => {
  const { type } = ctx.query;
  if (type === "全部") {
    try {
      const findP = Object.values(MovieType).map((typeItem) => {
        const p = Video.findAll({
          where: {
            type: typeItem,
          },
          limit: 12,
          order: [["createdAt", "DESC"]],
        });
        return p;
      });
      findP.push(
        Video.findAll({
          where: {
            isHot: true,
          },
          limit: 12,
          order: [["createdAt", "DESC"]],
        })
      );
      findP.push(
        Video.findAll({
          limit: 12,
          order: [["createdAt", "DESC"]],
        })
      );
      const result = await Promise.all(findP);
      const res = result.reduce((obj, item, index) => {
        // eslint-disable-next-line no-param-reassign
        obj[MovieTypeArr[index]] = item;
        return obj;
      }, {} as Record<string, any>);
      ctx.body = createRes(ResponseCode.SUCCESS, res);
    } catch (err) {
      throw new HttpError(ResponseCode.DATABASE_ERROR, "数据库查询异常", 200);
    }
  } else {
    const result = await Video.findAll({
      where: {
        type,
      },
    });
    ctx.body = createRes(ResponseCode.SUCCESS, result);
  }
});

router.get("/hoe", async (ctx) => {
  try {
    const result = await Video.findAll({
      // where: {
      //   isHot: 1
      // },
      limit: 12,
      order: [["createdAt", "DESC"]],
    });
    ctx.body = createRes(200, result, "");
  } catch (err) {
    throw new HttpError(ResponseCode.DATABASE_ERROR, "数据库查询失败", 200);
  }
});

export default router;
