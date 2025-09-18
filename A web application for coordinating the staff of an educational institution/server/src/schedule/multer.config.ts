import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
};