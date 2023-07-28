/**
 * @todo Use your credentials for production, sqlite is not recommended for production
 */
const config = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite3',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
};

export default config;
