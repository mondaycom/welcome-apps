'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import configs from '../config/db.config.js';
import { getSecret } from '../../helpers/secret-store.js';
import { getEnv } from '../../helpers/environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = getEnv();
const config = configs[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(getSecret(config.use_env_variable), config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
    });
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const getDbModel = (modelName) => db[modelName];
export default getDbModel;
