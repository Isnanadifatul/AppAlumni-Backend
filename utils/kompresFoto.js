import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

export const prosesUploadFoto = async (fotoFile, uploadFolder) => {
  if (!fotoFile || !fotoFile.hapi) return null;

  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/png'];
  const mime = fotoFile.hapi.headers['content-type'];

  if (!allowedTypes.includes(mime)) {
    throw new Error('File harus JPG atau PNG');
  }

  // Validasi ukuran file (<1MB tidak dikompres)
  const maxSize = 1 * 1024 * 1024; // 1MB
  const fileSize = fotoFile._data.length;

  const filename = Date.now() + '-' + fotoFile.hapi.filename;
  const fullPath = path.join(uploadFolder, filename);

  // Jika < 1MB → simpan langsung
  if (fileSize < maxSize) {
    fs.writeFileSync(fullPath, fotoFile._data);
    return filename;
  }

  // Jika ≥1MB → kompres dengan sharp
  await sharp(fotoFile._data)
    .resize({ width: 800 })   // tetap jelas
    .jpeg({ quality: 70 })    // ukuran kecil tapi tajam
    .toFile(fullPath);

  return filename;
};
