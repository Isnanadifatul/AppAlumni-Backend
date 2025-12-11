import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      tableName: 'admin',
      timestamps: false
    }
  );

  return Admin;
};
