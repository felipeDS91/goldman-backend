import { resolve } from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads');

export default {
  driver: process.env.STORAGE_DRIVER,

  uploadsFolder: tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
};
