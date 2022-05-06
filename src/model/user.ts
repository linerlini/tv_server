import { ResponseCode } from "utils/constants";
import HttpError from "utils/http_error";
import { Model, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "controller/db";

const USER_NAME_MAX_LENGTH = 16;
const ACCOUNT_MAX_LENGTH = 32;
const PASSWORD_MAX_LENGTH = 64;

function checkFieldLength(userName: string, account: string, password: string) {
  let valid = true;
  let msg = "注册成功";
  if (userName.length > USER_NAME_MAX_LENGTH) {
    valid = false;
    msg = `用户昵称长度应小于${USER_NAME_MAX_LENGTH}位`;
  } else if (account.length > ACCOUNT_MAX_LENGTH) {
    valid = false;
    msg = `账号长度应小于${ACCOUNT_MAX_LENGTH}位`;
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    valid = false;
    msg = `密码长度应小于${PASSWORD_MAX_LENGTH}}位`;
  } else {
    valid = true;
  }

  return {
    valid,
    msg,
  };
}

class User extends Model {
  static async createNewUser(
    account: string,
    password: string,
    userName: string
  ) {
    const checkLengthResult = checkFieldLength(userName, account, password);
    if (!checkLengthResult.valid) {
      throw new HttpError(ResponseCode.RANGE_ERROR, checkLengthResult.msg, 200);
    }
    const accountExisted = !!(await this.getUserByAccount(account));
    if (accountExisted) {
      throw new HttpError(ResponseCode.VALUD_REPEAT, "已存在该账号", 200);
    }
    const newUser = User.build({
      account,
      password,
      userName,
    });
    const result = await newUser.save();
    return result;
  }

  static async getUserByAccount(account: string) {
    let result: User | null = null;
    const queryResult = await User.findAll({
      where: {
        account,
      },
    });
    if (queryResult.length) {
      [result] = queryResult;
    }
    return result;
  }
}
User.init(
  {
    userName: {
      type: DataTypes.STRING(USER_NAME_MAX_LENGTH),
      allowNull: false,
    },
    account: {
      type: DataTypes.STRING(ACCOUNT_MAX_LENGTH),
      unique: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue() {
        return uuidv4();
      },
    },
    password: {
      type: DataTypes.STRING(PASSWORD_MAX_LENGTH),
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

User.sync({ alter: true });
export default User;
