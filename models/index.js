import AlumniModel from './alumni.js';
import MasterAlumniModel from './masterAlumni.js';
import AuthenticationModel from './authentication.js';

export const init = async (sequelize) => {
  const Alumni = AlumniModel(sequelize);
  const MasterAlumni = MasterAlumniModel(sequelize);
  const Authentication = AuthenticationModel(sequelize);

  return { Alumni, MasterAlumni, Authentication };
};

export default { init };
