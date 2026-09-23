import { getDownloadUrl } from '../services/documentService.js';

export default function DownloadButton({ documentId }) {
  return (
    <a
      className="download-link"
      href={getDownloadUrl(documentId)}
      target="_blank"
      rel="noreferrer"
    >
      Baixar
    </a>
  );
}