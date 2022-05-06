import Router from "@koa/router";
import videoRoute from "./video";
import userRoute from "./user";
import movieRoute from "./movie";
import collectRoute from "./collect";

const mainRoute = new Router({
  prefix: "/api",
});
mainRoute
  .use(videoRoute.routes())
  .use(userRoute.routes())
  .use(movieRoute.routes())
  .use(collectRoute.routes());

export default mainRoute;
