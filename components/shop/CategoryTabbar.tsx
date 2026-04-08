"use client";

import type { CategoryNode } from "@/types/product";
import { collectDescendantIds } from "@/hooks/useCategories";
import { useMemo } from "react";

interface Props {
  roots: CategoryNode[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

// Category icons mapped by slug (add more as needed)
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "art-de-la-table": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h18M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  ),
  "maison-et-decoration": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  electromenager: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  cuisine: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  ),
  "salle-de-bain": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/>
      <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/>
    </svg>
  ),
};

function DefaultIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  );
}

export default function CategoryTabBar({ roots, selectedIds, onSelect }: Props) {
  
  const renderedRoots = useMemo(() => {
    return roots.map(cat => ({
      ...cat,
      icon: CATEGORY_ICONS[cat.slug] || <DefaultIcon />,
      // Ensure count is at least 0 to avoid type errors
      safeCount: (cat as any).count || 0 
    }));
  }, [roots]);

  if (roots.length === 0) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[120, 160, 140, 100, 130].map((w, i) => (
          <div key={i} className="h-9 rounded-full bg-lavender/50 animate-pulse flex-shrink-0" style={{ width: w }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
      {/* "All" tab */}
      <button
        onClick={() => onSelect([])}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 border ${
          selectedIds.length === 0
            ? "bg-jet text-white border-jet shadow-md"
            : "bg-white text-jet/60 border-lavender hover:border-gold/60 hover:text-jet hover:bg-lavender/30"
        }`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        Tous
      </button>

      {renderedRoots.map((cat) => {
        // 2. CRITICAL PERFORMANCE FIX: 
        // Do not call collectDescendantIds in the render body. 
        // We only check if the current category ID is in the selection.
        const isActive = selectedIds.includes(cat.id);

        return (
          <button
            key={cat.id}
            // Move the recursive logic inside the click handler
            onClick={() => {
              const allChildIds = collectDescendantIds(cat);
              onSelect(allChildIds);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 border ${
              isActive
                ? "bg-jet text-snow border-jet shadow-md"
                : "bg-snow text-jet/60 border-lavender hover:border-gold/60 hover:text-jet hover:bg-lavender/30"
            }`}
          >
            <span className={isActive ? "text-gold" : "text-jet/40"}>{cat.icon}</span>
            {cat.name}
            {cat.safeCount > 0 && (
              <span className={`text-xs tabular-nums ${isActive ? "text-white/60" : "text-jet/30"}`}>
                {cat.safeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}