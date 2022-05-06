class HttpError extends Error {
  code: number

  statusCode: number

  constructor(code: number, msg: string, statusCode: number) {
    super()
    this.code = code
    this.message = msg
    this.statusCode = statusCode
  }
}
export default HttpError
