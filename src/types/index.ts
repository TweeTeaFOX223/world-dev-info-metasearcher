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
