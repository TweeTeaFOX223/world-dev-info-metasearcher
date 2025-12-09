import { useState } from "preact/hooks";
import type { SearchEngine } from "../types";

interface EditEngineModalProps {
  engine: SearchEngine;
  onSave: (engine: SearchEngine) => void;
  onCancel: () => void;
}

export function EditEngineModal({
  engine,
  onSave,
  onCancel,
}: EditEngineModalProps) {
  const [name, setName] = useState(engine.name);
  const [url, setUrl] = useState(engine.url);
  const [icon, setIcon] = useState(engine.icon || "");
  const [description, setDescription] = useState(engine.description || "");

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      alert("名前とURLは必須です");
      return;
    }

    const updatedEngine: SearchEngine = {
      ...engine,
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim() || undefined,
      description: description.trim() || undefined,
    };

    onSave(updatedEngine);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content add-engine-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">検索エンジンを編集</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="engine-name">
              名前 <span className="required">*</span>
            </label>
            <input
              id="engine-name"
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              placeholder="例: Google"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="engine-url">
              検索URL <span className="required">*</span>
            </label>
            <input
              id="engine-url"
              type="text"
              value={url}
              onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="例: https://www.google.com/search?q={query}"
              className="form-input"
              required
            />
            <p className="form-hint">
              ※検索URLの単語の部分を{"{query}"}に置き換えて入力
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="engine-icon">アイコンURL</label>
            <input
              id="engine-icon"
              type="text"
              value={icon}
              onInput={(e) => setIcon((e.target as HTMLInputElement).value)}
              placeholder="例: https://example.com/icon.png"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="engine-description">説明</label>
            <textarea
              id="engine-description"
              value={description}
              onInput={(e) =>
                setDescription((e.target as HTMLTextAreaElement).value)
              }
              placeholder="検索エンジンの説明を入力"
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onCancel}
            >
              キャンセル
            </button>
            <button type="submit" className="modal-btn modal-btn-confirm">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
