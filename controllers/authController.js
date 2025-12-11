import bcrypt from 'bcrypt';

export default (models) => {
  const { Authentication } = models;
  const SALT_ROUNDS = 10;

  // ------------------ REGISTER ------------------
  const register = async (request, h) => {
    try {
      const { username, password, id_admin, id_alumni } = request.payload;

      // VALIDASI EMAIL
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return h.response({ error: "Format email tidak valid" }).code(400);
      }

      // CEK EMAIL SUDAH TERDAFTAR
      const exists = await Authentication.findOne({ where: { username } });
      if (exists) {
        return h.response({ error: "Email sudah terdaftar" }).code(400);
      }

      // PASSWORD MINIMAL
      if (password.length < 6) {
        return h.response({ error: "Password minimal 6 karakter" }).code(400);
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await Authentication.create({
        username,
        password: hashedPassword,
        id_admin: id_admin ?? null,
        id_alumni: id_alumni ?? null
      });

      return h.response({
        success: true,
        message: "Register berhasil",
        user: {
          id_user: user.id_user,
          username: user.username
        }
      }).code(201);

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------ LOGIN ------------------
  const login = async (request, h) => {
    try {
      const { username, password } = request.payload;

      const user = await Authentication.findOne({ where: { username } });
      if (!user) {
        return h.response({ error: "Akun tidak ditemukan" }).code(404);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return h.response({ error: "Password salah" }).code(400);
      }

      return h.response({
        success: true,
        message: "Login berhasil",
        user: {
          id_user: user.id_user,
          username: user.username,
          id_admin: user.id_admin,
          id_alumni: user.id_alumni
        }
      });

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

  return { register, login };
};
