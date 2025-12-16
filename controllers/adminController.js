// controllers/adminController.js
export default (models) => {
  const { Admin } = models;

  // ------------------ CREATE ADMIN ------------------
  const create = async (request, h) => {
    try {
      const { nama } = request.payload;

      if (!nama) {
        return h.response({ error: 'Nama admin wajib diisi' }).code(400);
      }

      const admin = await Admin.create({ nama });

      return h.response({
        success: true,
        data: admin
      }).code(201);

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

  
// ================= LIST USER =================
  const listAdmin = async (request, h) => {
    try {
      const users = await Admin.findAll({
        attributes: [
          'id_admin',
          'nama',
        ],
        order: [['id_admin', 'ASC']]
      });

      return h.response({
        success: true,
        data: users
      });

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };


  return { create, listAdmin };
};
