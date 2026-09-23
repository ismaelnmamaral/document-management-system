const crypto = require('node:crypto');
const documentRepository = require('../repositories/document.repository');

function createError(code, message, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function toPublicDocument(document) {
  const { id, originalName, mimeType, size, uploadedAt, owner } = document;
  return { id, originalName, mimeType, size, uploadedAt, owner };
}

function normalizeOwner(owner) {
  return typeof owner === 'string' ? owner.trim() : '';
}

function requireOwner(owner) {
  const normalizedOwner = normalizeOwner(owner);
  if (!normalizedOwner) {
    throw createError('OWNER_REQUIRED', 'O proprietário é obrigatório.', 400);
  }
  return normalizedOwner;
}

function validateFile(file) {
  if (!file) {
    throw createError('FILE_REQUIRED', 'Um arquivo é obrigatório.', 400);
  }
}

function buildDocument(file, owner) {
  return {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
  };
}

function createDocument(file, owner) {
  validateFile(file);

  let normalizedOwner;
  try {
    normalizedOwner = requireOwner(owner);
  } catch (error) {
    documentRepository.removeFile({ storedName: file.filename });
    throw error;
  }

  const document = buildDocument(file, normalizedOwner);

  try {
    return toPublicDocument(documentRepository.saveMetadata(document));
  } catch (error) {
    documentRepository.removeFile(document);
    throw error;
  }
}

function listDocuments(owner) {
  return documentRepository
    .findAll(normalizeOwner(owner))
    .map(toPublicDocument);
}

async function getDocumentForDownload(id) {
  const document = documentRepository.findById(id);
  if (!document) {
    throw createError('DOCUMENT_NOT_FOUND', 'Documento não encontrado.', 404);
  }

  if (!await documentRepository.fileExists(document)) {
    throw createError('FILE_NOT_FOUND', 'Arquivo do documento não encontrado.', 404);
  }

  return { document, filePath: documentRepository.getFilePath(document) };
}

module.exports = {
  createDocument,
  getDocumentForDownload,
  listDocuments,
};