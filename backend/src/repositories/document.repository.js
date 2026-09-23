const fs = require('node:fs');
const path = require('node:path');

const storageDirectory = path.resolve(
  process.env.STORAGE_DIR || path.join(__dirname, '../../../storage'),
);
const documents = new Map();

function ensureStorageDirectory() {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

function getStorageDirectory() {
  return storageDirectory;
}

function saveMetadata(document) {
  documents.set(document.id, document);
  return document;
}

function findAll(owner) {
  const allDocuments = [...documents.values()];
  return owner ? allDocuments.filter((document) => document.owner === owner) : allDocuments;
}

function findById(id) {
  return documents.get(id);
}

function getFilePath(document) {
  return path.join(storageDirectory, document.storedName);
}

function removeFile(document) {
  const filePath = getFilePath(document);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  ensureStorageDirectory,
  findAll,
  findById,
  getFilePath,
  getStorageDirectory,
  removeFile,
  saveMetadata,
};