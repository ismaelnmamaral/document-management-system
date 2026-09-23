import { getDownloadUrl } from '../services/documentService.js';

export default function DownloadButton({ documentId }) {
  return (
    <a className="download-link" href={getDownloadUrl(documentId)}>
      Baixar
    </a>
  );
}