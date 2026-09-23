const express = require('express');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const documentController = require('../controllers/document.controller');
const {
  getStorageDirectory,
} = require('../repositories/document.repository');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => callback(null, getStorageDirectory()),
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024),
  },
});

const router = express.Router();

router.post('/upload', upload.single('file'), documentController.createUpload);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;