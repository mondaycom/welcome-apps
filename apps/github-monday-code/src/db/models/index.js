'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import configs from '../config/db.config.js';
import { getEnv } from '../../helpers/environment.js';
import logger from '../../services/logger/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = getEnv();
const config = configs[env] || configs.development;
const TAG = 'db_runner';
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const initializeDb = () => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
      let model;

      import(path.join(__dirname, file)).then((mod) => {
        const factory = mod.default;
        model = factory(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        logger.info('loaded model', TAG, { model: model.name });
      });
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

let isDdbSynced = false;
const getDbModel = async (modelName) => {
  if (!isDdbSynced) {
    logger.info('syncing sql db', TAG, { env, config });
    try {
      await sequelize.sync();
      logger.info('sql db synced successfully', TAG, { env, config });
      isDdbSynced = true;
    } catch (error) {
      logger.error('sql db failed to sync', TAG, { env, config, error: err.message });
    }
  }

  return db[modelName];
};
export default getDbModel;
