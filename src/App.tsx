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
import { EditEngineModal } from "./components/EditEngineModal";
import { EditTabModal } from "./components/EditTabModal";
import { getTabById } from "./utils/searchUtils";
import {
  loadSettings,
  saveSettings,
  loadConfig,
  saveConfig,
} from "./utils/localStorage";
import searchEnginesConfig from "./data/searchEngines.json";

const initialConfig: Config = searchEnginesConfig as Config;

const defaultSettings: AppSettings = {
  theme: "light",
  cardScale: 1.0,
  fontSize: 1.0,
  cardsPerRowMode: "auto",
  minCardsPerRow: 4,
  showName: true,
  showDescription: true,
  showUrl: true,
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
  // 設定の状態管理（ローカルストレージから読み込み）
  const [settings, setSettings] = useState<AppSettings>(() => {
    const loaded = loadSettings();
    return loaded || defaultSettings;
  });

  // 検索エンジンの設定（ローカルストレージから読み込み、なければ初期設定）
  const [config, setConfig] = useState<Config>(() => {
    const loaded = loadConfig();
    return loaded || JSON.parse(JSON.stringify(initialConfig));
  });

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
  const [editEngineTarget, setEditEngineTarget] = useState<{
    tabId: string;
    engineId: string;
  } | null>(null);
  const [editTabTarget, setEditTabTarget] = useState<string | null>(null);

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
      document.title = `${searchQuery} - WDIMS メタ検索`;
    } else {
      document.title = "WDIMS メタ検索エンジン";
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

  // カード数モード（固定/オート）を制御
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-cards-mode",
      settings.cardsPerRowMode
    );
  }, [settings.cardsPerRowMode]);

  const activeTab = getTabById(config, activeTabId);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSettingsReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
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
      saveConfig(newConfig);
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
      saveConfig(newConfig);
    }
    setShowAddEngineModal(false);
  };

  const handleAddEngineCancel = () => {
    setShowAddEngineModal(false);
  };

  const handleEditEngineRequest = (tabId: string, engineId: string) => {
    setEditEngineTarget({ tabId, engineId });
  };

  const handleEditEngine = (
    updatedEngine: SearchEngine,
    newTabId?: string,
    newPosition?: number
  ) => {
    if (!editEngineTarget) return;

    const newConfig = { ...config };
    const oldTabIndex = newConfig.tabs.findIndex(
      (tab) => tab.id === editEngineTarget.tabId
    );

    if (oldTabIndex === -1) return;

    const engineIndex = newConfig.tabs[oldTabIndex].engines.findIndex(
      (eng) => eng.id === editEngineTarget.engineId
    );

    if (engineIndex === -1) return;

    // タブの変更があるか確認
    const targetTabId = newTabId || editEngineTarget.tabId;
    const isTabChanged = targetTabId !== editEngineTarget.tabId;

    if (isTabChanged) {
      // 別のタブに移動する場合
      const newTabIndex = newConfig.tabs.findIndex(
        (tab) => tab.id === targetTabId
      );
      if (newTabIndex === -1) return;

      // 元のタブから削除
      newConfig.tabs[oldTabIndex] = {
        ...newConfig.tabs[oldTabIndex],
        engines: newConfig.tabs[oldTabIndex].engines.filter(
          (_, i) => i !== engineIndex
        ),
      };

      // 新しいタブに追加（先頭に配置、またはnewPositionが指定されていればその位置に）
      const targetEngines = [...newConfig.tabs[newTabIndex].engines];
      const insertPosition =
        newPosition !== undefined ? newPosition : 0;
      targetEngines.splice(insertPosition, 0, updatedEngine);
      newConfig.tabs[newTabIndex] = {
        ...newConfig.tabs[newTabIndex],
        engines: targetEngines,
      };
    } else {
      // 同じタブ内での編集
      const engines = [...newConfig.tabs[oldTabIndex].engines];

      // 位置が変更される場合
      if (newPosition !== undefined && newPosition !== engineIndex) {
        // 一旦削除
        engines.splice(engineIndex, 1);
        // 新しい位置に挿入
        engines.splice(newPosition, 0, updatedEngine);
      } else {
        // 位置変更なし、データのみ更新
        engines[engineIndex] = updatedEngine;
      }

      newConfig.tabs[oldTabIndex] = {
        ...newConfig.tabs[oldTabIndex],
        engines,
      };
    }

    setConfig(newConfig);
    saveConfig(newConfig);
    setEditEngineTarget(null);
  };

  const handleEditEngineCancel = () => {
    setEditEngineTarget(null);
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
    saveConfig(newConfig);
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
    saveConfig(newConfig);

    // 削除したタブがアクティブだった場合、最初のタブに切り替え
    if (deleteTabTarget === activeTabId && newConfig.tabs.length > 0) {
      setActiveTabId(newConfig.tabs[0].id);
    }

    setDeleteTabTarget(null);
  };

  const handleDeleteTabCancel = () => {
    setDeleteTabTarget(null);
  };

  const handleEditTabRequest = (tabId: string) => {
    setEditTabTarget(tabId);
  };

  const handleEditTab = (updatedTab: TabConfig) => {
    if (!editTabTarget) return;

    const newConfig = { ...config };
    const tabIndex = newConfig.tabs.findIndex(
      (tab) => tab.id === editTabTarget
    );
    if (tabIndex !== -1) {
      newConfig.tabs[tabIndex] = {
        ...newConfig.tabs[tabIndex],
        name: updatedTab.name,
      };
      setConfig(newConfig);
      saveConfig(newConfig);
    }
    setEditTabTarget(null);
  };

  const handleEditTabCancel = () => {
    setEditTabTarget(null);
  };

  const handleTabReorder = (fromIndex: number, toIndex: number) => {
    const newConfig = { ...config };
    const tabs = [...newConfig.tabs];
    const [movedTab] = tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, movedTab);
    newConfig.tabs = tabs;
    setConfig(newConfig);
    saveConfig(newConfig);
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
        saveConfig(newConfig);
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

  const handleDropOnTab = (targetTabId: string) => {
    if (!draggedItem) return;

    const newConfig = { ...config };
    const sourceTabIndex = newConfig.tabs.findIndex(
      (tab) => tab.id === draggedItem.sourceTabId
    );
    const targetTabIndex = newConfig.tabs.findIndex(
      (tab) => tab.id === targetTabId
    );

    if (sourceTabIndex === -1 || targetTabIndex === -1) return;

    // 同じタブへのドロップは無視
    if (draggedItem.sourceTabId === targetTabId) {
      setDraggedItem(null);
      return;
    }

    const draggedEngine =
      newConfig.tabs[sourceTabIndex].engines[draggedItem.sourceIndex];

    // 元のタブから削除
    newConfig.tabs[sourceTabIndex] = {
      ...newConfig.tabs[sourceTabIndex],
      engines: newConfig.tabs[sourceTabIndex].engines.filter(
        (_, i) => i !== draggedItem.sourceIndex
      ),
    };

    // 新しいタブの先頭に追加
    const targetEngines = [...newConfig.tabs[targetTabIndex].engines];
    targetEngines.unshift(draggedEngine);
    newConfig.tabs[targetTabIndex] = {
      ...newConfig.tabs[targetTabIndex],
      engines: targetEngines,
    };

    setConfig(newConfig);
    saveConfig(newConfig);
    setDraggedItem(null);
    setActiveTabId(targetTabId); // 移動先のタブに切り替え
  };

  const handleConfigImport = (newConfig: Config) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    // インポート後は最初のタブに切り替え
    if (newConfig.tabs.length > 0) {
      setActiveTabId(newConfig.tabs[0].id);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title-container">
          {editMode && (
            <div className="edit-mode-overlay">
              編集モード：検索エンジンやタブをドラッグして並び替え、または編集＆削除できます
            </div>
          )}
          <h1 className="app-title">World Dev Info Meta Searcher</h1>
          <p className="app-subtitle">
            開発技術＋αの情報収集に使える軽量メタ検索エンジン：クライアント版(ブラウザのローカルストレージに設定保存)
          </p>
        </div>
        <div className="header-buttons">
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            aria-label="設定を開く"
          >
            ⚙️ 設定
          </button>
          <button
            className={`header-edit-btn ${editMode ? "active" : ""}`}
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
          onTabEdit={handleEditTabRequest}
          onAddTab={handleAddTabRequest}
          onDropEngine={handleDropOnTab}
        />

        {activeTab && (
          <SearchResults
            query={searchQuery}
            engines={activeTab.engines}
            editMode={editMode}
            showName={settings.showName}
            showDescription={settings.showDescription}
            showUrl={settings.showUrl}
            onDelete={handleDeleteRequest}
            onEdit={(engineId) =>
              handleEditEngineRequest(activeTabId, engineId)
            }
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

      <ScrollToTop
        editMode={editMode}
        onSettingsClick={() => setShowSettings(true)}
        onEditToggle={() => setEditMode(!editMode)}
      />

      {showSettings && (
        <Settings
          settings={settings}
          config={config}
          onSettingsChange={handleSettingsChange}
          onConfigImport={handleConfigImport}
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

      {editEngineTarget &&
        (() => {
          const tab = config.tabs.find((t) => t.id === editEngineTarget.tabId);
          const engine = tab?.engines.find(
            (e) => e.id === editEngineTarget.engineId
          );
          const currentPosition =
            tab?.engines.findIndex((e) => e.id === editEngineTarget.engineId) ??
            0;
          return engine && tab ? (
            <EditEngineModal
              engine={engine}
              currentTabId={editEngineTarget.tabId}
              currentPosition={currentPosition}
              allTabs={config.tabs}
              onSave={handleEditEngine}
              onCancel={handleEditEngineCancel}
            />
          ) : null;
        })()}

      {editTabTarget &&
        (() => {
          const tab = config.tabs.find((t) => t.id === editTabTarget);
          return tab ? (
            <EditTabModal
              tab={tab}
              onSave={handleEditTab}
              onCancel={handleEditTabCancel}
            />
          ) : null;
        })()}
    </div>
  );
}
