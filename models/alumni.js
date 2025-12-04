import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Alumni = sequelize.define(
    'Alumni',
    {
      id_alumni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nim: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fakultas: {
        type: DataTypes.STRING,
         allowNull: false
      },
      prodi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tahun_masuk: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tahun_keluar: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'alumni',
      timestamps: false
    }
  );

  return Alumni;
};
