import { useState, useEffect } from "preact/hooks";
import type { Config } from "./types";
import { TabBar } from "./components/TabBar";
import { SearchBox } from "./components/SearchBox";
import { SearchResults } from "./components/SearchResults";
import { ScrollToTop } from "./components/ScrollToTop";
import { getTabById } from "./utils/searchUtils";
import searchEnginesConfig from "./data/searchEngines.json";

const config: Config = searchEnginesConfig as Config;

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
  const [activeTabId, setActiveTabId] = useState(config.tabs[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

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

  const activeTab = getTabById(config, activeTabId);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">World Dev Info Searcher</h1>
        <p className="app-subtitle">
          開発技術＋αの情報収集に使える軽量メタ検索エンジン
        </p>
      </header>

      <main className="app-main">
        <SearchBox onSearch={handleSearch} initialQuery={searchQuery} />

        <TabBar
          tabs={config.tabs}
          activeTabId={activeTabId}
          onTabChange={handleTabChange}
        />

        {activeTab && (
          <SearchResults query={searchQuery} engines={activeTab.engines} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          軽量メタ検索エンジン(単一HTMLファイルで動作可能) |{" "}
          <a
            href="https://github.com/TweeTeaFOX223/world-dev-info-metasearcher"
            target="_blank"
            rel="noopener noreferrer"
          >
            リポジトリ
          </a>
        </p>
      </footer>

      <ScrollToTop />
    </div>
  );
}
