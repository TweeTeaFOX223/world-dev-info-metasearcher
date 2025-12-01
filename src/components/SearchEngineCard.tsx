import type { SearchEngine } from "../types";

interface SearchEngineCardProps {
  engine: SearchEngine;
  searchUrl: string;
}

export function SearchEngineCard({ engine, searchUrl }: SearchEngineCardProps) {
  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="search-engine-card"
      aria-label={`${engine.name}で検索`}
    >
      <div className="search-engine-card-header">
        {engine.icon && (
          <img
            src={engine.icon}
            alt=""
            className="search-engine-icon"
            loading="lazy"
          />
        )}
        <h3 className="search-engine-name">{engine.name}</h3>
      </div>
      {engine.description && (
        <p className="search-engine-description">{engine.description}</p>
      )}
      <p className="search-engine-url" title={searchUrl}>
        {searchUrl}
      </p>
    </a>
  );
}
