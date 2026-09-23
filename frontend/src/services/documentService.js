async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message || 'Não foi possível concluir a operação.');
  }
  return response.json();
}

export function listDocuments() {
  return request('/api/documents');
}

export function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  return request('/api/upload', {
    method: 'POST',
    body: formData,
  });
}

export function getDownloadUrl(documentId) {
  return `/api/documents/${documentId}/download`;
}