/* eslint-disable no-unused-vars */
export const enum ResponseCode {
  SUCCESS = 0,
  RANGE_ERROR = 1,
  VALUD_REPEAT = 2,
  EMPTY_VALUE = 3,
  DATABASE_ERROR = 4,
  VALUE_WRONG = 5,
  RESPONSE_ERROR = 999, // 请求在响应时错误
  REQUEST_ERROR = 998, // 请求在前端出出错
  TOKEN_OUT = 997, // jwt过期
  TOKEN_WRONG = 996,
  NETWORK_ERROR = 995, // 网络问题
}

export const enum WYSearchType {
  VIDEO = 1014,
}

export enum VideoURLType {
  COMMON = 'common',
  MV = 'mv',
}

export enum VideoTrend {
  HOT = 1,
  NEW = 2,
}

export enum MovieType {
  COMEDY = '喜剧',
  GUNPLAY = '枪战',
  SCIENCEFICTION = '科幻',
  WARFARE = '战争',
  SUSPENSE = '悬疑',
  ANIMATION = '动画',
}
export const MovieTypeArr = [...Object.values(MovieType), '热门', '最新']
