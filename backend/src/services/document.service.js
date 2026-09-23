const crypto = require('node:crypto');
const fs = require('node:fs');
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

function createDocument(file, owner) {
  if (!file) {
    throw createError('FILE_REQUIRED', 'Um arquivo é obrigatório.', 400);
  }

  const normalizedOwner = typeof owner === 'string' ? owner.trim() : '';
  if (!normalizedOwner) {
    documentRepository.removeFile({ storedName: file.filename });
    throw createError('OWNER_REQUIRED', 'O proprietário é obrigatório.', 400);
  }

  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: normalizedOwner,
  };

  try {
    return toPublicDocument(documentRepository.saveMetadata(document));
  } catch (error) {
    documentRepository.removeFile(document);
    throw error;
  }
}

function listDocuments(owner) {
  return documentRepository
    .findAll(typeof owner === 'string' ? owner.trim() : '')
    .map(toPublicDocument);
}

async function getDocumentForDownload(id) {
  const document = documentRepository.findById(id);
  if (!document) {
    throw createError('DOCUMENT_NOT_FOUND', 'Documento não encontrado.', 404);
  }

  const filePath = documentRepository.getFilePath(document);
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch (error) {
    throw createError('FILE_NOT_FOUND', 'Arquivo do documento não encontrado.', 404);
  }

  return { document, filePath };
}

module.exports = {
  createDocument,
  getDocumentForDownload,
  listDocuments,
};