const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

async function startServer() {
  const server = app.listen(0);
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

function createDocumentForm() {
  const formData = new FormData();
  formData.append('owner', 'teste');
  formData.append('file', new Blob(['conteúdo do teste'], { type: 'text/plain' }), 'teste.txt');
  return formData;
}

test('faz upload de um documento', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: createDocumentForm(),
    });
    const uploadedDocument = await uploadResponse.json();

    assert.strictEqual(uploadResponse.status, 201);
    assert.strictEqual(uploadedDocument.originalName, 'teste.txt');
    assert.strictEqual(uploadedDocument.owner, 'teste');
    assert.strictEqual('storedName' in uploadedDocument, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('lista documentos por proprietário', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: createDocumentForm(),
    });
    const uploadedDocument = await uploadResponse.json();

    const listResponse = await fetch(`${baseUrl}/documents?owner=teste`);
    const documents = await listResponse.json();
    assert.strictEqual(listResponse.status, 200);
    assert.ok(documents.some((document) => document.id === uploadedDocument.id));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('baixa um documento pelo identificador', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: createDocumentForm(),
    });
    const uploadedDocument = await uploadResponse.json();

    const downloadResponse = await fetch(`${baseUrl}/documents/${uploadedDocument.id}/download`);
    assert.strictEqual(downloadResponse.status, 200);
    assert.strictEqual(await downloadResponse.text(), 'conteúdo do teste');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('rejeita upload sem proprietário e documento inexistente', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteúdo'], { type: 'text/plain' }), 'sem-owner.txt');
    const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: formData });
    const uploadError = await uploadResponse.json();
    assert.strictEqual(uploadResponse.status, 400);
    assert.strictEqual(uploadError.error.code, 'OWNER_REQUIRED');

    const downloadResponse = await fetch(`${baseUrl}/documents/inexistente/download`);
    const downloadError = await downloadResponse.json();
    assert.strictEqual(downloadResponse.status, 404);
    assert.strictEqual(downloadError.error.code, 'DOCUMENT_NOT_FOUND');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
