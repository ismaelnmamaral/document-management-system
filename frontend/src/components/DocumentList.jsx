import DownloadButton from './DownloadButton.jsx';

function formatSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default function DocumentList({ documents, loading }) {
  return (
    <section className="documents-panel">
      <div className="section-heading list-heading">
        <div>
          <p className="eyebrow">Biblioteca</p>
          <h2>Documentos recentes</h2>
        </div>
        <span className="count-badge">{documents.length}</span>
      </div>

      {loading && <p className="empty-state">Carregando documentos...</p>}
      {!loading && documents.length === 0 && (
        <p className="empty-state">Nenhum documento foi enviado ainda.</p>
      )}
      {!loading && documents.length > 0 && (
        <div className="document-list">
          {documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div className="file-symbol" aria-hidden="true">DOC</div>
              <div className="document-info">
                <strong>{document.originalName}</strong>
                <span>{document.owner} · {formatSize(document.size)} · {formatDate(document.uploadedAt)}</span>
              </div>
              <DownloadButton documentId={document.id} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}