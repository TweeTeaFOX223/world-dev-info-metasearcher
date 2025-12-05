import { useState } from "preact/hooks";
import type { AppSettings } from "../types";
import { ConfirmModal } from "./ConfirmModal";

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
  onReset: () => void;
}

export function Settings({
  settings,
  onSettingsChange,
  onClose,
  onReset,
}: SettingsProps) {
  const [showResetModal, setShowResetModal] = useState(false);

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

  const handleApplyMinCardsOnMobileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onSettingsChange({
      ...settings,
      applyMinCardsOnMobile: target.checked,
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

        <div className="settings-content">
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
                  {settings.theme === "dark" ? "ダークモード" : "ライトモード"}
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
            <p className="settings-note">※スマホ表示時は一行1個になります</p>
            <div className="settings-item">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.applyMinCardsOnMobile}
                  onChange={handleApplyMinCardsOnMobileChange}
                />
                <span>スマホ表示時にも、最小カード数の設定を適用する</span>
              </label>
            </div>
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

          <div className="settings-info">
            <p>
              ※設定は現在のセッション中のみ有効です（ローカルストレージへの保存は未実装）
            </p>
          </div>

          {/* リセットボタン */}
          <div className="settings-reset">
            <button className="reset-btn" onClick={handleResetClick}>
              設定をリセット
            </button>
          </div>
        </div>

        {showResetModal && (
          <ConfirmModal
            message="設定をデフォルトに戻しますか？"
            onConfirm={handleResetConfirm}
            onCancel={handleResetCancel}
          />
        )}
      </div>
    </div>
  );
}
