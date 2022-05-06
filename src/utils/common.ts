import { ResponseCode } from './constants'

export function createRes<T>(code: ResponseCode = ResponseCode.SUCCESS, data: T | null = null, msg: string = '') {
  return {
    code,
    data,
    msg,
  }
}

export function Other() {}
