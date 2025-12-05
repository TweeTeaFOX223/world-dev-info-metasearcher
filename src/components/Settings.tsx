import { useState, useRef } from "preact/hooks";
import type { AppSettings, Config } from "../types";
import { ConfirmModal } from "./ConfirmModal";
import {
  exportSettings,
  exportConfig,
  importSettings,
  importConfig,
  downloadJSON,
} from "../utils/localStorage";

interface SettingsProps {
  settings: AppSettings;
  config: Config;
  onSettingsChange: (settings: AppSettings) => void;
  onConfigImport: (config: Config) => void;
  onClose: () => void;
  onReset: () => void;
}

export function Settings({
  settings,
  config,
  onSettingsChange,
  onConfigImport,
  onClose,
  onReset,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<
    "display" | "import-export" | "reset"
  >("display");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearStorageModal, setShowClearStorageModal] = useState(false);
  const settingsFileInputRef = useRef<HTMLInputElement>(null);
  const configFileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeToggle = () => {
    onSettingsChange({
      ...settings,
      theme: settings.theme === "light" ? "dark" : "light",
    });
  };

  const handleCardScaleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      cardScale: parseFloat(target.value),
    });
  };

  const handleFontSizeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      fontSize: parseFloat(target.value),
    });
  };

  const handleCardsPerRowModeChange = (mode: "fixed" | "auto") => {
    onSettingsChange({
      ...settings,
      cardsPerRowMode: mode,
    });
  };

  const handleMinCardsChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newMin = parseInt(target.value);
    onSettingsChange({
      ...settings,
      minCardsPerRow: newMin,
    });
  };

  const handleShowNameChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      showName: target.checked,
    });
  };

  const handleShowDescriptionChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      showDescription: target.checked,
    });
  };

  const handleShowUrlChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      showUrl: target.checked,
    });
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    onReset();
    setShowResetModal(false);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  // エクスポート機能
  const handleExportSettings = () => {
    const json = exportSettings(settings);
    downloadJSON(json, "設定ファイル.wdis_ui.json");
  };

  const handleExportConfig = () => {
    const json = exportConfig(config);
    downloadJSON(json, "設定ファイル.wdis_engine.json");
  };

  // インポート機能
  const handleImportSettingsClick = () => {
    settingsFileInputRef.current?.click();
  };

  const handleImportConfigClick = () => {
    configFileInputRef.current?.click();
  };

  const handleSettingsFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const newSettings = importSettings(json);
        onSettingsChange(newSettings);
        alert("表示設定をインポートしました");
      } catch (error) {
        alert(
          "ファイルの読み込みに失敗しました。正しいJSON形式か確認してください。"
        );
        console.error(error);
      }
    };
    reader.readAsText(file);
    // リセット（同じファイルを再度選択可能にする）
    target.value = "";
  };

  const handleConfigFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const newConfig = importConfig(json);
        onConfigImport(newConfig);
        alert("検索エンジンとタブのデータをインポートしました");
      } catch (error) {
        alert(
          "ファイルの読み込みに失敗しました。正しいJSON形式か確認してください。"
        );
        console.error(error);
      }
    };
    reader.readAsText(file);
    // リセット（同じファイルを再度選択可能にする）
    target.value = "";
  };

  // ローカルストレージをクリア
  const handleClearStorageClick = () => {
    setShowClearStorageModal(true);
  };

  const handleClearStorageConfirm = () => {
    localStorage.clear();
    setShowClearStorageModal(false);
    alert("ローカルストレージをクリアしました。ページをリロードします。");
    window.location.reload();
  };

  const handleClearStorageCancel = () => {
    setShowClearStorageModal(false);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>設定</h2>
          <button
            className="settings-close-btn"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${
              activeTab === "display" ? "active" : ""
            }`}
            onClick={() => setActiveTab("display")}
          >
            表示設定
          </button>
          <button
            className={`settings-tab ${
              activeTab === "import-export" ? "active" : ""
            }`}
            onClick={() => setActiveTab("import-export")}
          >
            設定ファイルの保存・読み込み
          </button>
          <button
            className={`settings-tab ${activeTab === "reset" ? "active" : ""}`}
            onClick={() => setActiveTab("reset")}
          >
            初期化(危険)
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "display" && (
            <>
              {/* テーマ切り替え */}
              <div className="settings-section">
                <h3>テーマ</h3>
                <div className="settings-item">
                  <label className="theme-toggle">
                    <input
                      type="checkbox"
                      checked={settings.theme === "dark"}
                      onChange={handleThemeToggle}
                    />
                    <span className="theme-toggle-slider"></span>
                    <span className="theme-toggle-label">
                      {settings.theme === "dark"
                        ? "ダークモード"
                        : "ライトモード"}
                    </span>
                  </label>
                </div>
              </div>

              {/* カードサイズ調整 */}
              <div className="settings-section">
                <h3>カードサイズ</h3>
                <div className="settings-item">
                  <label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.5"
                      step="0.1"
                      value={settings.cardScale}
                      onInput={handleCardScaleChange}
                      className="settings-slider"
                    />
                    <span className="settings-value">
                      {Math.round(settings.cardScale * 100)}%
                    </span>
                  </label>
                </div>
              </div>

              {/* 文字サイズ調整 */}
              <div className="settings-section">
                <h3>文字サイズ</h3>
                <div className="settings-item">
                  <label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.1"
                      value={settings.fontSize}
                      onInput={handleFontSizeChange}
                      className="settings-slider"
                    />
                    <span className="settings-value">
                      {Math.round(settings.fontSize * 100)}%
                    </span>
                  </label>
                </div>
              </div>

              {/* 一行のカード数（最小） */}
              <div className="settings-section">
                <h3>一行のカード数（最小）</h3>
                <div className="settings-item">
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="cardsPerRowMode"
                        checked={settings.cardsPerRowMode === "auto"}
                        onChange={() => handleCardsPerRowModeChange("auto")}
                      />
                      <span>数をオート可変</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="cardsPerRowMode"
                        checked={settings.cardsPerRowMode === "fixed"}
                        onChange={() => handleCardsPerRowModeChange("fixed")}
                      />
                      <span>固定</span>
                    </label>
                  </div>
                </div>
                {settings.cardsPerRowMode === "fixed" && (
                  <div className="settings-item">
                    <label>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={settings.minCardsPerRow}
                        onInput={handleMinCardsChange}
                        className="settings-slider"
                      />
                      <span className="settings-value">
                        {settings.minCardsPerRow}枚
                      </span>
                    </label>
                  </div>
                )}
                <p className="settings-note">
                  {settings.cardsPerRowMode === "fixed"
                    ? "※スマホ表示時は一行1個になります"
                    : "※画面幅に応じて自動的にカード数が調整されます"}
                </p>
              </div>

              {/* カードの情報表示 */}
              <div className="settings-section">
                <h3>カードの情報表示</h3>
                <div className="settings-checkboxes">
                  <label className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={settings.showName}
                      onChange={handleShowNameChange}
                    />
                    <span>検索エンジンの名前</span>
                  </label>
                  <label className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={settings.showDescription}
                      onChange={handleShowDescriptionChange}
                    />
                    <span>検索エンジンの説明</span>
                  </label>
                  <label className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={settings.showUrl}
                      onChange={handleShowUrlChange}
                    />
                    <span>検索URL</span>
                  </label>
                </div>
              </div>

              {/* リセットボタン */}
              <div className="settings-reset">
                <button className="reset-btn" onClick={handleResetClick}>
                  設定をリセット
                </button>
              </div>
            </>
          )}

          {activeTab === "import-export" && (
            <>
              {/* ローカルストレージについての警告 */}
              <div className="settings-warning">
                <p>
                  ⚠️
                  このアプリの設定はブラウザのローカルストレージに保存されます。ブラウザの履歴やサイトデータを消去すると消える可能性があるので注意してください。
                </p>
                <p>
                  大切な設定は定期的にファイル保存（エクスポート）することをおすすめします。
                </p>
              </div>

              {/* 表示設定のファイル保存・読み込み */}
              <div className="settings-section">
                <h3>表示設定</h3>
                <div className="import-export-buttons">
                  <button className="export-btn" onClick={handleExportSettings}>
                    💾 ファイル保存（エクスポート）
                  </button>
                  <button
                    className="import-btn"
                    onClick={handleImportSettingsClick}
                  >
                    📂 設定ファイル読み込み（インポート）
                  </button>
                </div>
                <p className="settings-note">
                  テーマ、カードサイズ、文字サイズなどの表示設定をJSON形式で保存/読み込みできます。
                </p>
              </div>

              {/* 検索エンジンとタブのデータのファイル保存・読み込み */}
              <div className="settings-section">
                <h3>検索エンジンとタブのデータ</h3>
                <div className="import-export-buttons">
                  <button className="export-btn" onClick={handleExportConfig}>
                    💾 ファイル保存（エクスポート）
                  </button>
                  <button
                    className="import-btn"
                    onClick={handleImportConfigClick}
                  >
                    📂 設定ファイル読み込み（インポート）
                  </button>
                </div>
                <p className="settings-note">
                  タブと検索エンジンの設定をJSON形式で保存/読み込みできます。
                  <br />
                  形式は <code>src/data/searchEngines.json</code> と同じです。
                </p>
              </div>

              <div className="settings-info">
                <h4>サンプルファイルについて</h4>
                <p>
                  サンプルのJSON設定ファイルは、プロジェクトの{" "}
                  <code>config_sample/</code>{" "}
                  フォルダにあります。参考にしてください。
                </p>
              </div>

              {/* 非表示のファイル入力 */}
              <input
                ref={settingsFileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleSettingsFileChange}
              />
              <input
                ref={configFileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleConfigFileChange}
              />
            </>
          )}

          {activeTab === "reset" && (
            <>
              <div className="settings-section">
                <h3>⚠️ ローカルストレージの初期化</h3>
                <div className="settings-warning">
                  <p>
                    ブラウザのローカルストレージの中にある設定ファイルを削除し、表示や検索エンジンの設定を初期化してリセットします。
                  </p>
                  <p>
                    設定を保存したい場合は{" "}
                    <button
                      className="link-button"
                      onClick={() => setActiveTab("import-export")}
                    >
                      「設定ファイルの保存・読み込み」
                    </button>{" "}
                    のタブで設定保存を行ってください。
                  </p>
                </div>
                <div className="settings-reset">
                  <button
                    className="danger-btn"
                    onClick={handleClearStorageClick}
                  >
                    🗑️ ローカルストレージを削除して初期化
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {showResetModal && (
          <ConfirmModal
            message="設定をデフォルトに戻しますか？"
            onConfirm={handleResetConfirm}
            onCancel={handleResetCancel}
          />
        )}

        {showClearStorageModal && (
          <ConfirmModal
            message="警告: ローカルストレージを削除すると、すべての設定が初期化されます。本当に実行しますか？"
            onConfirm={handleClearStorageConfirm}
            onCancel={handleClearStorageCancel}
          />
        )}
      </div>
    </div>
  );
}
