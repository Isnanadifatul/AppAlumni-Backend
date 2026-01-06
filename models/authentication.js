import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Authentication = sequelize.define(
    'Authentication',
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      id_alumni: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'authentication',
      timestamps: false
    }
  );

  return Authentication;
};
