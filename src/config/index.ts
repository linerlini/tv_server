import { Options } from 'sequelize'

const dbConfig: Options = {
  username: '',
  password: '',
  database: '',
  host: '',
  dialect: 'mysql',
}
export { dbConfig }
export const withoutVerifyRoute = ['/api/user/register', '/api/user/login', '/api/user/auto']
