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

  return { create };
};
