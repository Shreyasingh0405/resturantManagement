import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Specify the file name
  }
});

const upload = multer({ storage: storage });

// Middleware to handle file upload
const uploadImage = upload.array('image',5); // Handle single file upload with the field name 'image'

export {uploadImage} ;
