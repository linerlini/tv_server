import { ResponseCode } from "utils/constants";
import HttpError from "utils/http_error";
import { Model, DataTypes, Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "controller/db";

class Video extends Model {
  static async searchVideo(keywords: string, limit: number = 50) {
    try {
      const result = await Video.findAll({
        limit,
        where: {
          name: {
            [Op.regexp]: `.*(${keywords}).*`,
          },
        },
      });
      return result;
    } catch (err) {
      throw new HttpError(ResponseCode.DATABASE_ERROR, "查询失败", 500);
    }
  }
}
Video.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue() {
        return uuidv4();
      },
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    actors: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    director: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    desc: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    sequelize,
  }
);

Video.sync({ alter: true });

export default Video;
