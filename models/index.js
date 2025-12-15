import AlumniModel from './alumni.js';
import MasterAlumniModel from './masterAlumni.js';
import AuthenticationModel from './authentication.js';
import AdminModel from './admin.js';

export const init = async (sequelize) => {
  const Alumni = AlumniModel(sequelize);
  const MasterAlumni = MasterAlumniModel(sequelize);
  const Authentication = AuthenticationModel(sequelize);
  const Admin = AdminModel(sequelize);

  return { Alumni, MasterAlumni, Authentication, Admin };
};

export default { init };
