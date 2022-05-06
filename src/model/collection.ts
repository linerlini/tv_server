import { Model, DataTypes } from "sequelize";
import sequelize from "controller/db";
import HttpError from "utils/http_error";
import { ResponseCode, VideoURLType } from "utils/constants";
import { MovieInfo } from "../types/movie";

async function connectCollectionTable(tableName: string) {
  class Collection extends Model {}

  Collection.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(16),
        allowNull: true,
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      imgUrl: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
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
      videoType: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName,
      sequelize,
    }
  );

  try {
    await Collection.sync({ alter: true });
    return Collection;
  } catch (err) {
    console.error(err);
    throw new HttpError(200, "获取收藏失败", ResponseCode.DATABASE_ERROR);
  }
}

export async function addCollection(
  tableName: string,
  movieInfo: MovieInfo,
  videoType?: VideoURLType
) {
  try {
    const table = await connectCollectionTable(tableName);
    const target = await table.findOne({
      where: {
        uuid: movieInfo.uuid,
      },
    });
    if (!target) {
      await table.create({
        ...movieInfo,
        videoType: videoType || "movie",
      });
    }
  } catch (err) {
    console.error(err);
    throw new HttpError(200, "服务器异常", ResponseCode.DATABASE_ERROR);
  }
}

export async function deleteCollection(tableName: string, id: string) {
  try {
    const table = await connectCollectionTable(tableName);
    const target = await table.findOne({
      where: {
        uuid: id,
      },
    });
    if (target) {
      await target.destroy();
    }
  } catch (err) {
    throw new HttpError(200, "服务器异常", ResponseCode.DATABASE_ERROR);
  }
}
export async function getCollections(account: string) {
  try {
    const table = await connectCollectionTable(account);
    const result = await table.findAll();
    return result || [];
  } catch (err) {
    console.error(err);
    throw new HttpError(200, "数据库异常", ResponseCode.DATABASE_ERROR);
  }
}
