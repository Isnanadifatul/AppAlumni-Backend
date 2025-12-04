import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('MasterAlumni', {
    nim: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'master_alumni',
    timestamps: false
  });
};
