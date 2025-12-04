import Sequelize from 'sequelize';
import config from '../config/config.js';

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

    // simpan instance ke Hapi
    server.app.db = sequelize;

    // load models
    const models = {
      Alumni: (await import('../models/Alumni.js')).default(sequelize)
    };

    server.app.models = models;
  }
};
