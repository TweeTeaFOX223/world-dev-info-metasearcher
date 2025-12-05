import { useState, useEffect } from "preact/hooks";
import type { Config, AppSettings, SearchEngine, TabConfig } from "./types";
import { TabBar } from "./components/TabBar";
import { SearchBox } from "./components/SearchBox";
import { SearchResults } from "./components/SearchResults";
import { ScrollToTop } from "./components/ScrollToTop";
import { Settings } from "./components/Settings";
import { ConfirmModal } from "./components/ConfirmModal";
import { AddEngineModal } from "./components/AddEngineModal";
import { AddTabModal } from "./components/AddTabModal";
import { DeleteTabModal } from "./components/DeleteTabModal";
import { getTabById } from "./utils/searchUtils";
import searchEnginesConfig from "./data/searchEngines.json";

const initialConfig: Config = searchEnginesConfig as Config;

const defaultSettings: AppSettings = {
  theme: "light",
  cardScale: 1.0,
  fontSize: 1.0,
  minCardsPerRow: 4,
  showName: true,
  showDescription: true,
  showUrl: true,
  applyMinCardsOnMobile: false,
};

/**
 * URLパラメータから検索クエリを取得
 */
function getQueryFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || params.get("query") || params.get("word") || "";
}

/**
 * URLパラメータからタブIDを取得
 */
function getTabIdFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("tab") || "";
}

/**
 * URLパラメータを更新
 */
function updateUrlParameter(query: string, tabId: string) {
  const url = new URL(window.location.href);

  // タブIDを設定
  if (tabId) {
    url.searchParams.set("tab", tabId);
  } else {
    url.searchParams.delete("tab");
  }

  // 検索クエリを設定
  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }

  window.history.replaceState({}, "", url.toString());
}

export function App() {
  // 設定の状態管理
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // 検索エンジンの設定（編集可能）
  const [config, setConfig] = useState<Config>(
    JSON.parse(JSON.stringify(initialConfig))
  );

  // UI状態
  const [activeTabId, setActiveTabId] = useState(config.tabs[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    tabId: string;
    engineId: string;
  } | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    engineId: string;
    sourceTabId: string;
    sourceIndex: number;
  } | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [showAddEngineModal, setShowAddEngineModal] = useState(false);
  const [addEnginePosition, setAddEnginePosition] = useState<number>(0);
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [addTabPosition, setAddTabPosition] = useState<number>(0);
  const [deleteTabTarget, setDeleteTabTarget] = useState<string | null>(null);

  // 初回マウント時にURLパラメータから検索クエリとタブIDを読み取る
  useEffect(() => {
    const urlQuery = getQueryFromUrl();
    const urlTabId = getTabIdFromUrl();

    if (urlQuery) {
      setSearchQuery(urlQuery);
    }

    // URLにタブIDがあり、それが有効な場合は設定
    if (urlTabId && config.tabs.some((tab) => tab.id === urlTabId)) {
      setActiveTabId(urlTabId);
    }
  }, []);

  // 検索クエリが変更されたらページタイトルを更新
  useEffect(() => {
    if (searchQuery) {
      document.title = `${searchQuery} - WDIS メタ検索`;
    } else {
      document.title = "WDIS メタ検索エンジン";
    }
  }, [searchQuery]);

  // タブIDまたは検索クエリが変更されたらURLを更新
  useEffect(() => {
    updateUrlParameter(searchQuery, activeTabId);
  }, [searchQuery, activeTabId]);

  // テーマ適用
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  // カードスケールと文字サイズを適用
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--card-scale",
      settings.cardScale.toString()
    );
    document.documentElement.style.setProperty(
      "--font-scale",
      settings.fontSize.toString()
    );
  }, [settings.cardScale, settings.fontSize]);

  // カード数制御を適用
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--min-cards-per-row",
      settings.minCardsPerRow.toString()
    );
  }, [settings.minCardsPerRow]);

  // モバイルでのカード数設定適用を制御
  useEffect(() => {
    if (settings.applyMinCardsOnMobile) {
      document.documentElement.setAttribute("data-mobile-cards", "custom");
    } else {
      document.documentElement.removeAttribute("data-mobile-cards");
    }
  }, [settings.applyMinCardsOnMobile]);

  const activeTab = getTabById(config, activeTabId);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleSettingsReset = () => {
    setSettings(defaultSettings);
  };

  const handleDeleteRequest = (engineId: string) => {
    setDeleteTarget({ tabId: activeTabId, engineId });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    const newConfig = { ...config };
    const tabIndex = newConfig.tabs.findIndex(
      (tab) => tab.id === deleteTarget.tabId
    );
    if (tabIndex !== -1) {
      newConfig.tabs[tabIndex] = {
        ...newConfig.tabs[tabIndex],
        engines: newConfig.tabs[tabIndex].engines.filter(
          (e) => e.id !== deleteTarget.engineId
        ),
      };
      setConfig(newConfig);
    }
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleAddEngineRequest = (position: number) => {
    setAddEnginePosition(position);
    setShowAddEngineModal(true);
  };

  const handleAddEngine = (engine: SearchEngine) => {
    const newConfig = { ...config };
    const tabIndex = newConfig.tabs.findIndex((tab) => tab.id === activeTabId);
    if (tabIndex !== -1) {
      const engines = [...newConfig.tabs[tabIndex].engines];
      engines.splice(addEnginePosition, 0, engine);
      newConfig.tabs[tabIndex] = {
        ...newConfig.tabs[tabIndex],
        engines,
      };
      setConfig(newConfig);
    }
    setShowAddEngineModal(false);
  };

  const handleAddEngineCancel = () => {
    setShowAddEngineModal(false);
  };

  const handleAddTabRequest = (position: number) => {
    setAddTabPosition(position);
    setShowAddTabModal(true);
  };

  const handleAddTab = (tab: TabConfig) => {
    const newConfig = { ...config };
    const tabs = [...newConfig.tabs];
    tabs.splice(addTabPosition, 0, tab);
    newConfig.tabs = tabs;
    setConfig(newConfig);
    setShowAddTabModal(false);
    setActiveTabId(tab.id);
  };

  const handleAddTabCancel = () => {
    setShowAddTabModal(false);
  };

  const handleDeleteTabRequest = (tabId: string) => {
    setDeleteTabTarget(tabId);
  };

  const handleDeleteTabConfirm = () => {
    if (!deleteTabTarget) return;

    const newConfig = { ...config };
    newConfig.tabs = newConfig.tabs.filter((tab) => tab.id !== deleteTabTarget);
    setConfig(newConfig);

    // 削除したタブがアクティブだった場合、最初のタブに切り替え
    if (deleteTabTarget === activeTabId && newConfig.tabs.length > 0) {
      setActiveTabId(newConfig.tabs[0].id);
    }

    setDeleteTabTarget(null);
  };

  const handleDeleteTabCancel = () => {
    setDeleteTabTarget(null);
  };

  const handleTabReorder = (fromIndex: number, toIndex: number) => {
    const newConfig = { ...config };
    const tabs = [...newConfig.tabs];
    const [movedTab] = tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, movedTab);
    newConfig.tabs = tabs;
    setConfig(newConfig);
  };

  const handleDragStart = (engineId: string, index: number) => {
    setDraggedItem({ engineId, sourceTabId: activeTabId, sourceIndex: index });
  };

  const handleDragEnd = () => {
    setHoverIndex(null);
  };

  const handleDragOver = (index: number) => {
    if (draggedItem && draggedItem.sourceIndex !== index) {
      setHoverIndex(index);

      // リアルタイムプレビュー：即座に並び替えを適用
      const newConfig = { ...config };
      const sourceTabIndex = newConfig.tabs.findIndex(
        (tab) => tab.id === draggedItem.sourceTabId
      );
      const targetTabIndex = newConfig.tabs.findIndex(
        (tab) => tab.id === activeTabId
      );

      if (sourceTabIndex !== -1 && targetTabIndex !== -1) {
        const draggedEngine =
          newConfig.tabs[sourceTabIndex].engines[draggedItem.sourceIndex];

        if (draggedItem.sourceTabId === activeTabId) {
          // 同じタブ内での移動
          const engines = [...newConfig.tabs[targetTabIndex].engines];
          engines.splice(draggedItem.sourceIndex, 1);
          engines.splice(index, 0, draggedEngine);
          newConfig.tabs[targetTabIndex] = {
            ...newConfig.tabs[targetTabIndex],
            engines,
          };
        } else {
          // 別のタブへの移動
          newConfig.tabs[sourceTabIndex] = {
            ...newConfig.tabs[sourceTabIndex],
            engines: newConfig.tabs[sourceTabIndex].engines.filter(
              (_, i) => i !== draggedItem.sourceIndex
            ),
          };
          const engines = [...newConfig.tabs[targetTabIndex].engines];
          engines.splice(index, 0, draggedEngine);
          newConfig.tabs[targetTabIndex] = {
            ...newConfig.tabs[targetTabIndex],
            engines,
          };
        }

        setConfig(newConfig);
        // ドラッグ元の情報を更新
        setDraggedItem({
          ...draggedItem,
          sourceTabId: activeTabId,
          sourceIndex: index,
        });
      }
    }
  };

  const handleDrop = (targetIndex: number) => {
    // リアルタイムプレビューで既に並び替えが適用されているので、
    // ここでは状態をクリアするだけ
    console.log(targetIndex);
    console.log(hoverIndex);
    setDraggedItem(null);
    setHoverIndex(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">World Dev Info Searcher</h1>
        <p className="app-subtitle">
          開発技術＋αの情報収集に使える軽量メタ検索エンジン
        </p>
        <div className="header-buttons">
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            aria-label="設定を開く"
          >
            ⚙️ 設定
          </button>
          <button
            className={`edit-btn ${editMode ? "active" : ""}`}
            onClick={() => setEditMode(!editMode)}
            aria-label={editMode ? "編集モードを終了" : "編集モードを開始"}
          >
            {editMode ? "✓ 完了" : "✏️ 編集"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <SearchBox onSearch={handleSearch} initialQuery={searchQuery} />

        <TabBar
          tabs={config.tabs}
          activeTabId={activeTabId}
          editMode={editMode}
          onTabChange={handleTabChange}
          onTabReorder={handleTabReorder}
          onTabDelete={handleDeleteTabRequest}
          onAddTab={handleAddTabRequest}
        />

        {editMode && (
          <div className="edit-mode-notice">
            編集モード：検索エンジンをドラッグして並び替え、または削除できます
          </div>
        )}

        {activeTab && (
          <SearchResults
            query={searchQuery}
            engines={activeTab.engines}
            editMode={editMode}
            showName={settings.showName}
            showDescription={settings.showDescription}
            showUrl={settings.showUrl}
            onDelete={handleDeleteRequest}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddEngine={handleAddEngineRequest}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          説明書とコラムとソースコードはこちら |{" "}
          <a
            href="https://github.com/TweeTeaFOX223/world-dev-info-metasearcher"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>

      <ScrollToTop />

      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          onReset={handleSettingsReset}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message="本当にこの検索エンジンを削除しますか？"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {showAddEngineModal && (
        <AddEngineModal
          onAdd={handleAddEngine}
          onCancel={handleAddEngineCancel}
        />
      )}

      {showAddTabModal && (
        <AddTabModal onAdd={handleAddTab} onCancel={handleAddTabCancel} />
      )}

      {deleteTabTarget && (
        <DeleteTabModal
          tab={config.tabs.find((tab) => tab.id === deleteTabTarget)!}
          onConfirm={handleDeleteTabConfirm}
          onCancel={handleDeleteTabCancel}
        />
      )}
    </div>
  );
}
