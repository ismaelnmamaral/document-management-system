import { useState } from 'react';

export default function UploadComponent({ onUpload, uploading }) {
  const [owner, setOwner] = useState('');
  const [file, setFile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || !owner.trim()) return;

    await onUpload({ file, owner: owner.trim() });
    setFile(null);
    event.target.reset();
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Novo documento</p>
          <h2>Adicionar arquivo</h2>
        </div>
        <span className="upload-icon" aria-hidden="true">+</span>
      </div>

      <label htmlFor="owner">Proprietário</label>
      <input
        id="owner"
        name="owner"
        value={owner}
        onChange={(event) => setOwner(event.target.value)}
        placeholder="Ex.: ismael"
        required
      />

      <label htmlFor="file">Arquivo</label>
      <input
        id="file"
        name="file"
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        required
      />

      <button type="submit" disabled={uploading || !file || !owner.trim()}>
        {uploading ? 'Enviando...' : 'Enviar documento'}
      </button>
      <small>Limite de 10 MB por arquivo.</small>
    </form>
  );
}