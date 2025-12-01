import type { SearchEngine } from "../types";
import { generateSearchUrl } from "../utils/searchUtils";
import { SearchEngineCard } from "./SearchEngineCard";

interface SearchResultsProps {
  query: string;
  engines: SearchEngine[];
}

export function SearchResults({ query, engines }: SearchResultsProps) {
  return (
    <div className="search-results" role="region" aria-label="検索結果">
      <div className="search-results-grid">
        {engines.map((engine) => (
          <SearchEngineCard
            key={engine.id}
            engine={engine}
            searchUrl={generateSearchUrl(engine.url, query)}
          />
        ))}
      </div>
    </div>
  );
}
