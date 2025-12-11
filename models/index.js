import AlumniModel from './Alumni.js';
import MasterAlumniModel from './masterAlumni.js';

export const init = async (sequelize) => {
  const Alumni = AlumniModel(sequelize);
  const MasterAlumni = MasterAlumniModel(sequelize);

  return { Alumni, MasterAlumni};
};
