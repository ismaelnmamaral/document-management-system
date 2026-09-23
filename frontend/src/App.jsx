import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadForm from './components/UploadForm.jsx';
import { listDocuments, uploadDocument } from './services/documentService.js';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function refreshDocuments() {
    setLoading(true);
    try {
      setDocuments(await listDocuments());
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshDocuments();
  }, []);

  async function handleUpload({ file, owner }) {
    setUploading(true);
    try {
      await uploadDocument(file, owner);
      await refreshDocuments();
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Arquivo local · espaço de trabalho</p>
          <h1>Document Management System</h1>
          <p className="hero-copy">
            Guarde, encontre e baixe seus documentos em um só lugar.
          </p>
        </div>
        <div className="hero-mark" aria-hidden="true">DMS</div>
      </header>

      {error && <p className="alert" role="alert">{error}</p>}

      <section className="workspace" aria-label="Gerenciamento de documentos">
        <UploadForm onUpload={handleUpload} uploading={uploading} />
        <DocumentList documents={documents} loading={loading} />
      </section>
    </main>
  );
}
