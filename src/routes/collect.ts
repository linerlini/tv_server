import { createRes } from "utils/common";
import Router from "@koa/router";
import {
  addCollection,
  deleteCollection,
  getCollections,
} from "model/collection";
import { ResponseCode } from "utils/constants";

const router = new Router({
  prefix: "/collect",
});
router.post("addCollect", "/add", async (ctx) => {
  const data = ctx.request.body;
  await addCollection(data.account, data.movieInfo, data.type);
  ctx.body = createRes(ResponseCode.SUCCESS);
});
router.get("deleteCollect", "/delete", async (ctx) => {
  const { id, account } = ctx.query;
  await deleteCollection(account as string, id as string);
  ctx.body = createRes(ResponseCode.SUCCESS);
});
router.get("getCollections", "/get", async (ctx) => {
  const { account } = ctx.query;
  const data = await getCollections(account as string);
  ctx.body = createRes(ResponseCode.SUCCESS, data);
});
export default router;
