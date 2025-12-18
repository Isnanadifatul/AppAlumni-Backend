import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prosesUploadFoto } from '../utils/kompresFoto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (models) => {
  const { Alumni, MasterAlumni, Authentication } = models;

  // ------------------ CREATE ------------------
  const create = async (request, h) => {
    try {
      const payload = request.payload;

      // 1. CEK NIM DI MASTER ALUMNI
      const cekMaster = await MasterAlumni.findOne({
        where: { nim: payload.nim }
      });

      if (!cekMaster) {
        return h.response({ error: 'NIM yang anda masukkan salah' }).code(400);
      }

      // 2. CEK DUPLIKAT DI TABEL ALUMNI
      const exists = await Alumni.findOne({
        where: { nim: payload.nim }
      });

      if (exists) {
        return h.response({ error: 'NIM already exists' }).code(409);
      }

      // PROSES UPLOAD FOTO
      let fotoFilename = null;
      const fotoFile = payload.foto;

      if (fotoFile && fotoFile.hapi) {
        const uploadFolder = path.join(__dirname, '..', 'uploads', 'alumni');
        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder, { recursive: true });
        }

        fotoFilename = await prosesUploadFoto(fotoFile, uploadFolder);
      }

      const item = await Alumni.create({
        nim: payload.nim,
        nama: payload.nama ?? null,
        fakultas: payload.fakultas ?? null,
        prodi: payload.prodi ?? null,
        angkatan: payload.angkatan ?? null,
        tahun_masuk: payload.tahun_masuk ?? null,
        tahun_keluar: payload.tahun_keluar ?? null,
        foto: fotoFilename
      });

      return h.response(item).code(201);

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------ LIST ------------------
  const list = async () => {
    try {
      const items = await Alumni.findAll();

      const result = items.map(a => ({
        ...a.dataValues,
        foto_url: a.foto 
          ? `http://localhost:3000/uploads/alumni/${a.foto}`
          : null
      }));

      return result;

    } catch (err) {
      return { error: err.message };
    }
  };

    // ------------------ GET ------------------
  const get = async (request, h) => {
    try {
      const item = await Alumni.findByPk(request.params.id);
      if (!item) return h.response({ error: 'Not found' }).code(404);

      return h.response({
        ...item.dataValues,
        foto_url: item.foto
          ? `http://localhost:3000/uploads/alumni/${item.foto}`
          : null
      });

    } catch (err) {
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------ UPDATE ------------------
  const update = async (request, h) => {
    try {
      const id = request.params.id;
      const payload = request.payload;

      const item = await Alumni.findByPk(id);
      if (!item) return h.response({ error: 'Not found' }).code(404);

      // Cek duplicate NIM
      if (payload.nim && payload.nim !== item.nim) {
        const exist = await Alumni.findOne({ where: { nim: payload.nim } });
        if (exist) {
          return h.response({ error: 'NIM already used' }).code(409);
        }
      }

      // FOTO BARU
      let fotoFilename = item.foto;
      const fotoFile = payload.foto;

      if (fotoFile && fotoFile.hapi) {
        const uploadFolder = path.join(__dirname, '..', 'uploads', 'alumni');
        if (!fs.existsSync(uploadFolder))
          fs.mkdirSync(uploadFolder, { recursive: true });

        // Hapus foto lama jika ada
        if (item.foto) {
          const oldPath = path.join(uploadFolder, item.foto);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Upload foto baru
        fotoFilename = await prosesUploadFoto(fotoFile, uploadFolder);
      }

      await item.update({
        nim: payload.nim ?? item.nim,
        nama: payload.nama ?? item.nama,
        fakultas: payload.fakultas ?? item.fakultas,
        prodi: payload.prodi ?? item.prodi,
        angkatan: payload.angkatan ?? item.angkatan,
        tahun_masuk: payload.tahun_masuk ?? item.tahun_masuk,
        tahun_keluar: payload.tahun_keluar ?? item.tahun_keluar,
        foto: fotoFilename
      });

      return h.response(item);

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };
  /*
  // ------------------ DELETE ------------------
  const remove = async (request, h) => {
    try {
      const item = await Alumni.findByPk(request.params.id);
      if (!item) return h.response({ error: "Not found" }).code(404);

      // Hapus foto jika ada
      if (item.foto) {
        const folder = path.join(__dirname, "..", "uploads", "alumni");
        const fotoPath = path.join(folder, item.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }

      await item.destroy();
      return h.response({ success: true });
    } catch (err) {
      return h.response({ error: err.message }).code(500);
    }
  };
  */
  
  // ------------------ DELETE ALUMNI + ACCOUNT ------------------
  const remove = async (request, h) => {
    try {
      const { id } = request.params;

      // 1. Cari alumni
      const alumni = await Alumni.findByPk(id);
      if (!alumni) {
        return h.response({ error: 'Alumni tidak ditemukan' }).code(404);
      }

      // 2. Hapus foto alumni jika ada
      if (alumni.foto) {
        const fotoPath = path.join(
          __dirname,
          '..',
          'uploads',
          'alumni',
          alumni.foto
        );

        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
        }
      }

      // 3. Hapus akun authentication (jika ada)
      await Authentication.destroy({
        where: { id_alumni: alumni.id_alumni }
      });

      // 4. Hapus data alumni
      await alumni.destroy();

      return h.response({
        success: true,
        message: 'Alumni dan akun berhasil dihapus'
      });

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message }).code(500);
    }
  };

    // ------------------ SEARCH ------------------
  const search = async (request, h) => {
    try {
      const nim = request.params.nim;
      const item = await Alumni.findOne({ where: { nim } });

      if (!item) return h.response({ error: "Not found" }).code(404);

      return h.response({
        ...item.dataValues,
        foto_url: item.foto
          ? `http://localhost:3000/uploads/alumni/${item.foto}`
          : null
      });

    } catch (err) {
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------------
  // RETURN SEMUA FUNGSI
  // ------------------------
  return { create, list, get, update, remove, search };
};
