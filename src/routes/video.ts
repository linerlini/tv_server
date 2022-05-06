import Video from 'model/video';
import { createRes } from 'utils/common';
import Router from '@koa/router'
import { Middleware } from 'koa'
import { wyMusic } from 'utils/wyMusic'
import { ResponseCode, VideoURLType } from 'utils/constants';
import { MVURL } from 'types/wyapi';
import { addCollection, deleteCollection } from 'model/collection';
const router = new Router({
  prefix: '/video'
})

router.get('searchVideo', '/searchVideo', async (ctx) => {
  const { keywords, limit = 50 } = ctx.query
  const result = await wyMusic.searchVideo(keywords as string, limit as number)
  const movieResult = await Video.searchVideo(keywords as string, limit as number)

  ctx.body = createRes(ResponseCode.SUCCESS, {
    movies: movieResult,
    videos: result
  })
})

router.get('hotVideo', '/hot', async (ctx) => {
  const result = await wyMusic.queryHotMv()
  const firstMovieUrl = await wyMusic.queryVideoURL(result[0].uuid, VideoURLType.MV)
  result[0].videoUrl = (firstMovieUrl as MVURL).url
  ctx.body = createRes(ResponseCode.SUCCESS, result)
})

router.get('newVideo', '/new', async (ctx) => {
  const { offset } = ctx.query
  const result = await wyMusic.queryNewMV((offset as unknown as number) || 0)
  ctx.body = createRes(ResponseCode.SUCCESS, result)
})

router.get('recommendVideo', '/recommend', async (ctx) => {
  const result = await wyMusic.getRecommendVideos()
  ctx.body = createRes(ResponseCode.SUCCESS, result)
})

router.get('getURL', '/url', async (ctx) => {
  const { id, type } = ctx.query
  const result = await wyMusic.queryVideoURL(id as string, type as VideoURLType)
  const urlResult = Array.isArray(result) ? result[0].url : result?.url
  let resData = null
  switch (type) {
    case VideoURLType.COMMON:
    case VideoURLType.MV:
      resData = createRes(ResponseCode.SUCCESS, urlResult)
  }
  ctx.body = resData
})
export default router