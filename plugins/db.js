import Sequelize from 'sequelize';
import config from '../config/config.js';
import { init } from '../models/index.js';

export const dbPlugin = {
  name: 'dbPlugin',
  register: async (server) => {
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        logging: false
      }
    );

    await sequelize.authenticate();
    console.log('Database connected');

    const models = await init(sequelize);

    server.app.db = sequelize;
    server.app.models = models;
  }
};
