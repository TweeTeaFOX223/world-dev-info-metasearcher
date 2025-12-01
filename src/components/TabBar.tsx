import type { TabConfig } from '../types';

interface TabBarProps {
  tabs: TabConfig[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTabId, onTabChange }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist" aria-label="検索カテゴリ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button ${activeTabId === tab.id ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTabId === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
