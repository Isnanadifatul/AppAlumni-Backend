import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (models) => {
  const { Alumni, MasterAlumni } = models;

  // ------------------ CREATE ------------------
  const create = async (request, h) => {
    try {
      const payload = request.payload;

      // 1. CEK NIM DI MASTER ALUMNI
      const cekMaster = await MasterAlumni.findOne({
        where: { nim: payload.nim }
      });

      if (!cekMaster) {
        return h
          .response({ error: 'NIM yang anda masukkan salah' })
          .code(400);
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

        fotoFilename = Date.now() + '-' + fotoFile.hapi.filename;
        const filePath = path.join(uploadFolder, fotoFilename);

        const fileStream = fs.createWriteStream(filePath);
        fotoFile.pipe(fileStream);
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
      return items;
    } catch (err) {
      return { error: err.message };
    }
  };

  // ------------------ GET ------------------
  const get = async (request, h) => {
    try {
      const item = await Alumni.findByPk(request.params.id);
      if (!item) return h.response({ error: 'Not found' }).code(404);
      return h.response(item);
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

        fotoFilename = Date.now() + '-' + fotoFile.hapi.filename;
        const newPath = path.join(uploadFolder, fotoFilename);

        const fileStream = fs.createWriteStream(newPath);
        fotoFile.pipe(fileStream);
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
      return h.response({ error: err.message }).code(500);
    }
  };

  // ------------------ DELETE ------------------
  const remove = async (request, h) => {
    try {
      const item = await Alumni.findByPk(request.params.id);
      if (!item) return h.response({ error: 'Not found' }).code(404);

      await item.destroy();
      return h.response({ success: true });
    } catch (err) {
      return h.response({ error: err.message }).code(500);
    }
  };

  return { create, list, get, update, remove };
};
