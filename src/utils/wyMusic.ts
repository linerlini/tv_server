import { ResponseCode, VideoURLType, WYSearchType } from 'utils/constants'
import HttpError from 'utils/http_error'
import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import {
  SearchVideoResponse,
  MV,
  RecommendVideoInfo,
  Video,
  QueryVideoURLResponse,
  VideoURL,
  MVURL,
  QueryMVURLResponse,
  QueryFirstMVResponse,
  GetHotVideoResponse,
  GetRecommendVideoRes,
  HotVideo,
} from 'types/wyapi'
import { MovieInfo } from '../types/movie'

function formatHotMVInfo(mvs: HotVideo[]) {
  return mvs.map<MovieInfo>((mv) => ({
    uuid: `${mv.id}`,
    name: mv.name,
    actors: mv.artistName,
    time: mv.mv.publishTime,
    imgUrl: mv.cover,
    isHot: true,
    desc: mv.briefDesc,
    videoType: VideoURLType.MV,
  }))
}
function formatNewMVInfo(mvs: MV[]) {
  return mvs.map<MovieInfo>((mv) => ({
    uuid: `${mv.id}`,
    name: mv.name,
    actors: mv.artistName,
    imgUrl: mv.cover,
    isHot: true,
    desc: mv.briefDesc,
    videoType: VideoURLType.COMMON,
  }))
}
function formatRecommendInfo(videos: RecommendVideoInfo[]) {
  return videos.map<MovieInfo>((video) => ({
    uuid: video.vid,
    name: video.title,
    actors: video.creator.nickname,
    imgUrl: video.coverUrl,
    desc: video.description,
    videoType: VideoURLType.COMMON,
  }))
}
function formatSearchVideo(videos: Video[]) {
  return videos.map<MovieInfo>((video) => ({
    uuid: video.vid,
    name: video.title,
    actors: Array.isArray(video.creator) ? video.creator.map((item) => item.userName).join(',') : '',
    imgUrl: video.coverUrl,
    desc: video.title,
    videoType: VideoURLType.COMMON,
  }))
}
export class WYMusic {
  private cookie = ''

  public baseUrl = ''

  private account = ''

  private password = ''

  private server: AxiosInstance | null = null

  constructor(baseUrl: string, account: string, password: string) {
    this.baseUrl = baseUrl
    this.account = account
    this.password = password

    this.initRequestManager()
    this.login()
  }

  private initRequestManager() {
    this.server = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
      validateStatus(status) {
        return status < 500
      },
    })
    axiosRetry(this.server, { retries: 3 })
  }

  // 登录
  public async login() {
    const result = await this.server?.get('/login/cellphone', {
      params: {
        phone: this.account,
        password: this.password,
      },
    })
    if (result?.data) {
      const { cookie } = result.data
      this.cookie = cookie
      return true
    }
    return false
  }

  // 搜索视频
  public async searchVideo(keywords: string, limit: number) {
    const result = await this.server?.post<SearchVideoResponse>('/cloudsearch', {
      keywords,
      type: WYSearchType.VIDEO,
      cookie: this.cookie,
      limit,
    })
    let data: MovieInfo[] = []
    if (Array.isArray(result?.data?.result?.videos)) {
      data = formatSearchVideo(result?.data.result.videos!)
    }
    return data
  }

  // 获取视频播放链接
  public async queryVideoURL(id: string, type: VideoURLType) {
    const urlMap = {
      [VideoURLType.COMMON]: '/video/url',
      [VideoURLType.MV]: '/mv/url',
    }
    const url = urlMap[type]
    if (!url) {
      throw new HttpError(ResponseCode.RANGE_ERROR, '参数范围有误', 200)
    }
    const result = await this.server?.post<QueryVideoURLResponse | QueryMVURLResponse>(
      urlMap[type],
      {
        id,
        cookie: this.cookie,
      },
      {
        params: {
          timestamp: Date.now(),
        },
      },
    )
    let urls: VideoURL[] | MVURL | null = null
    if (result?.data) {
      const data = result?.data
      if (type === VideoURLType.COMMON) {
        if (Array.isArray((data as QueryVideoURLResponse).urls)) {
          urls = (data as QueryVideoURLResponse).urls.filter((item) => !item.needPay)
        }
      } else {
        urls = (data as QueryMVURLResponse).data
      }
    }
    return urls
  }

  // 获取最新视频
  public async queryNewMV(offset: number) {
    const newOffset = offset >= 0 ? offset : 0
    const result = await this.server?.post<QueryFirstMVResponse>(
      '/mv/all',
      {
        cookie: this.cookie,
        order: '最新',
        limit: 24,
        offset: newOffset * 24,
      },
      {
        params: {
          timestamp: Date.now(),
        },
      },
    )
    let data: MovieInfo[] = []
    if (Array.isArray(result?.data.data)) {
      data = formatNewMVInfo(result?.data.data!)
    }
    return data
  }

  // 获取热门mv
  public async queryHotMv() {
    const result = await this.server?.post<GetHotVideoResponse>('/top/mv', {
      cookie: this.cookie,
    })
    let data: MovieInfo[] = []
    if (Array.isArray(result?.data.data)) {
      data = formatHotMVInfo(result?.data.data!)
    }
    return data
  }

  // 获取推荐视频
  public async getRecommendVideos() {
    const result = await this.server?.post<GetRecommendVideoRes>('/video/timeline/recommend', {
      cookie: this.cookie,
      timestamp: Date.now(),
    })
    console.log(this.cookie)
    let data: MovieInfo[] = []
    if (Array.isArray(result?.data.datas)) {
      data = formatRecommendInfo(result?.data.datas.map((item) => item.data)!)
    }
    console.log(data)
    return data
  }
}

const wyMusic = new WYMusic('http://1.14.74.191:3000', '13647613586', 'lkk200033.')
export { wyMusic }
