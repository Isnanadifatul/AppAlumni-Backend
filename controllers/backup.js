import bcrypt from 'bcrypt';

export default (models) => {
  const { Authentication } = models;
  const SALT_ROUNDS = 10;

  // ------------------ REGISTER ------------------
  const register = async (request, h) => {
    try {
      const { username, password, id_admin, id_alumni } = request.payload;

      // ---- VALIDASI EMAIL ----
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return h.response({ error: "Format email tidak valid" }).code(400);
      }

      // ---- CEK EMAIL SUDAH ADA ----
      const existingUser = await Authentication.findOne({ where: { username } });
      if (existingUser) {
        return h.response({ error: "Email sudah terdaftar" }).code(400);
      }

      // ---- CEK PASSWORD ----
      if (!password || password.length < 6) {
        return h.response({ error: "Password minimal 6 karakter" }).code(400);
      }

      // ---- HASH PASSWORD ----
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // ---- SIMPAN USER ----
      const newUser = await Authentication.create({
        username,
        password: hashedPassword,
        id_admin: id_admin || null,
        id_alumni: id_alumni || null
      });

      return h.response({
        success: true,
        message: "Register berhasil",
        user: {
          id_user: newUser.id_user,
          username: newUser.username,
          id_admin: newUser.id_admin,
          id_alumni: newUser.id_alumni
        }
      }).code(201);

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------ LOGIN ------------------
  const login = async (request, h) => {
    try {
      const { username, password } = request.payload;

      // ---- CEK USER ----
      const user = await Authentication.findOne({ where: { username } });
      if (!user) {
        return h.response({ error: "Akun tidak ditemukan" }).code(404);
      }

      // ---- CEK PASSWORD ----
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
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
      console.error("LOGIN ERROR:", err);
      return h.response({ error: err.message }).code(500);
    }
  };

  return { register, login };
};



  // ================= REGISTER =================
  const register = async (request, h) => {
    try {
      const { username, password, id_admin, id_alumni } = request.payload;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return h.response({ error: "Format email tidak valid" }).code(400);
      }

      const existingUser = await Authentication.findOne({ where: { username } });
      if (existingUser) {
        return h.response({ error: "Email sudah terdaftar" }).code(400);
      }

      if (!password || password.length < 6) {
        return h.response({ error: "Password minimal 6 karakter" }).code(400);
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await Authentication.create({
        username,
        password: hashedPassword,
        id_admin: id_admin || null,
        id_alumni: id_alumni || null
      });

      return h.response({
        success: true,
        message: "Register berhasil",
        user: {
          id_user: newUser.id_user,
          username: newUser.username
        }
      }).code(201);

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return h.response({ error: err.message }).code(500);
    }
  };
