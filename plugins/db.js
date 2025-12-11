import models from '../models/index.js';
import { Sequelize } from 'sequelize';

export const dbPlugin = {
  name: 'dbPlugin',
  register: async (server) => {
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
      }
    );

    try {
      await sequelize.authenticate();
      console.log("Database connected");
    } catch (err) {
      console.error("Database connection error:", err);
    }

    // Load all models
    const loadedModels = await models.init(sequelize);

    server.app.sequelize = sequelize;
    server.app.models = loadedModels;
  }
};
