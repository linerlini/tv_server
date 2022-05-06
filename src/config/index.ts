import { Options } from 'sequelize'

const dbConfig: Options = {
  username: 'lzs',
  password: 'lzs20000313.',
  database: 'tv',
  host: '1.14.74.191',
  dialect: 'mysql',
}
export { dbConfig }
export const withoutVerifyRoute = ['/api/user/register', '/api/user/login', '/api/user/auto']
