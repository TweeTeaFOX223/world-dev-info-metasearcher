import type { SearchEngine } from "../types";
import { generateSearchUrl } from "../utils/searchUtils";
import { SearchEngineCard } from "./SearchEngineCard";

interface SearchResultsProps {
  query: string;
  engines: SearchEngine[];
  editMode?: boolean;
  showName?: boolean;
  showDescription?: boolean;
  showUrl?: boolean;
  onDelete?: (engineId: string) => void;
  onDragStart?: (engineId: string, index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (index: number) => void;
  onDrop?: (targetIndex: number) => void;
  onAddEngine?: (position: number) => void;
}

export function SearchResults({
  query,
  engines,
  editMode = false,
  showName = true,
  showDescription = true,
  showUrl = true,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onAddEngine,
}: SearchResultsProps) {
  return (
    <div className="search-results" role="region" aria-label="検索結果">
      <div className="search-results-grid">
        {engines.map((engine, index) => (
          <div className="search-result-item" key={engine.id}>
            {editMode && onAddEngine && (
              <button
                className="add-engine-btn"
                onClick={() => onAddEngine(index)}
                aria-label="この位置に検索エンジンを追加"
              >
                +
              </button>
            )}
            <SearchEngineCard
              engine={engine}
              searchUrl={generateSearchUrl(engine.url, query)}
              editMode={editMode}
              showName={showName}
              showDescription={showDescription}
              showUrl={showUrl}
              draggable={editMode}
              onDelete={onDelete ? () => onDelete(engine.id) : undefined}
              onDragStart={
                onDragStart
                  ? (e: DragEvent) => {
                      e.dataTransfer!.effectAllowed = "move";
                      onDragStart(engine.id, index);
                    }
                  : undefined
              }
              onDragEnd={onDragEnd}
              onDragOver={
                onDragOver
                  ? (e: DragEvent) => {
                      e.preventDefault();
                      onDragOver(index);
                    }
                  : undefined
              }
              onDrop={onDrop ? () => onDrop(index) : undefined}
            />
            {editMode && onAddEngine && index === engines.length - 1 && (
              <button
                className="add-engine-btn"
                onClick={() => onAddEngine(engines.length)}
                aria-label="最後に検索エンジンを追加"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
