import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { detectImage } from './controller/detectionController';


const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

// Configure where uploaded files get stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // tell multer to save into the 'uploads/' folder
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    // generate a unique filename, e.g. Date.now() + '-' + file.originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Create the multer instance using that storage config
const upload = multer({
  storage,
  // add a file size limit (in bytes)
  limits: { fileSize: 5 * 1024 *1024 },
  // add a fileFilter function to only accept image types
  fileFilter : (req, file, cb) => {

    if (!file.mimetype.startsWith('image/')) {
      cb(null, false)
    }
    else {
      cb(null, true)
    }

  }
});

app.get('/', (req, res) =>{
    res.status(200).send('test for server')
})

// TODO 3: Write the POST /upload route
app.post('/upload', upload.single('image'), (req, res) => {
  // if not -> respond with an appropriate error status + message
  // if yes -> respond with success + the saved filename
  if (!req.file){
    res.status(400).send('Not found the file')
  }
  else {
    res.status(200).json({msg: 'Success!', filename: req.file.filename})
  }
});

// Detect image 
app.post('/api/v1/detect', detectImage);

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
 });