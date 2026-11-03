import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import { detectImage } from './controller/detectionController';
import { getMetrics } from './controller/metricsController';

// Force reliable DNS servers — fixes mongodb+srv:// resolution issues on some networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const port = process.env.PORT || 5000;
const uploadsDir = path.join(process.cwd(), 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

app.get('/', (_req, res) => {
  res.status(200).send('test for server');
});

app.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 5MB)' : err.message;
      res.status(400).json({ message });
      return;
    }

    if (err) {
      res.status(400).json({
        message: err instanceof Error ? err.message : 'Upload failed',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    res.status(200).json({ msg: 'Success!', filename: req.file.filename });
  });
});

app.post('/api/v1/detect', detectImage);
app.get('/api/v1/metrics', getMetrics);

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error(err);
  res.status(500).json({
    message: err instanceof Error ? err.message : 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
