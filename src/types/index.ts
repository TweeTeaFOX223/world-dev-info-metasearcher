export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface TabConfig {
  id: string;
  name: string;
  engines: SearchEngine[];
}

export interface Config {
  tabs: TabConfig[];
}

export interface AppSettings {
  theme: "light" | "dark";
  cardScale: number;
  fontSize: number;
  minCardsPerRow: number;
  showName: boolean;
  showDescription: boolean;
  showUrl: boolean;
  applyMinCardsOnMobile: boolean;
}

export interface DragItem {
  engineId: string;
  sourceTabId: string;
  index: number;
}
