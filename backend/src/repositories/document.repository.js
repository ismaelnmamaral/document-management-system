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

async function fileExists(document) {
  try {
    await fs.promises.access(getFilePath(document), fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
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
  fileExists,
  getFilePath,
  getStorageDirectory,
  removeFile,
  saveMetadata,
};