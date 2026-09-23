const documentService = require('../services/document.service');

function createUpload(req, res, next) {
  try {
    const document = documentService.createDocument(req.file, req.body.owner);
    return res.status(201).json(document);
  } catch (error) {
    return next(error);
  }
}

function listDocuments(req, res, next) {
  try {
    return res.json(documentService.listDocuments(req.query.owner));
  } catch (error) {
    return next(error);
  }
}

function downloadDocument(req, res, next) {
  try {
    const { document, filePath } = documentService.getDocumentForDownload(req.params.id);
    res.download(filePath, document.originalName, (error) => {
      if (error && !res.headersSent) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUpload,
  downloadDocument,
  listDocuments,
};