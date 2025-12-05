import type { AppSettings, Config } from "../types";

const SETTINGS_STORAGE_KEY = "wdis-app-settings";
const CONFIG_STORAGE_KEY = "wdis-search-engines-config";

/**
 * 表示設定をローカルストレージに保存
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
}

/**
 * 表示設定をローカルストレージから読み込み
 */
export function loadSettings(): AppSettings | null {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppSettings;
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }
  return null;
}

/**
 * 検索エンジンとタブの設定をローカルストレージに保存
 */
export function saveConfig(config: Config): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config to localStorage:", error);
  }
}

/**
 * 検索エンジンとタブの設定をローカルストレージから読み込み
 */
export function loadConfig(): Config | null {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Config;
    }
  } catch (error) {
    console.error("Failed to load config from localStorage:", error);
  }
  return null;
}

/**
 * 表示設定をJSON文字列としてエクスポート
 */
export function exportSettings(settings: AppSettings): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * JSON文字列から表示設定をインポート
 */
export function importSettings(jsonString: string): AppSettings {
  return JSON.parse(jsonString) as AppSettings;
}

/**
 * 検索エンジンとタブの設定をJSON文字列としてエクスポート
 */
export function exportConfig(config: Config): string {
  return JSON.stringify(config, null, 2);
}

/**
 * JSON文字列から検索エンジンとタブの設定をインポート
 */
export function importConfig(jsonString: string): Config {
  return JSON.parse(jsonString) as Config;
}

/**
 * JSONファイルとしてダウンロード
 */
export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
