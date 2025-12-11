import bcrypt from 'bcrypt';

export default (models) => {
  const { Authentication } = models;
  const SALT_ROUNDS = 10;

  // ================= REGISTER =================
  const register = async (request, h) => {
    try {
      const { username, password, id_admin, id_alumni } = request.payload;

      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return h.response({ error: 'Format email tidak valid' }).code(400);
      }

      // Cek user sudah ada atau belum
      const exist = await Authentication.findOne({ where: { username } });
      if (exist) {
        return h.response({ error: 'Email sudah terdaftar' }).code(400);
      }

      // Validasi password minimal
      if (password.length < 6) {
        return h.response({ error: 'Password minimal 6 karakter' }).code(400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Simpan user
      const newUser = await Authentication.create({
        username,
        password: hashedPassword,
        id_admin: id_admin || null,
        id_alumni: id_alumni || null
      });

      return h
        .response({
          success: true,
          message: 'Register berhasil',
          user: {
            id_user: newUser.id_user,
            username: newUser.username,
            id_admin: newUser.id_admin,
            id_alumni: newUser.id_alumni
          }
        })
        .code(201);

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

  // ================= LOGIN =================
  const login = async (request, h) => {
    try {
      const { username, password } = request.payload;

      const user = await Authentication.findOne({ where: { username } });

      if (!user) {
        return h.response({ error: 'Akun tidak ditemukan' }).code(404);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return h.response({ error: 'Password salah' }).code(400);
      }

      return h.response({
        success: true,
        message: 'Login berhasil',
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
