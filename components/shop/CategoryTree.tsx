"use client";

import { useState, useMemo } from "react";
import type { CategoryNode } from "@/types/product";
import { collectDescendantIds } from "@/hooks/useCategories";

interface TreeProps {
  nodes?: CategoryNode[]; // Made optional
  selectedIds?: number[]; // Made optional
  onToggle: (ids: number[], select: boolean) => void;
}

function Node({ node, selectedIds = [], onToggle, depth = 0 }: any) {
  const [open, setOpen] = useState(true);


  if (!node || !node.id) return null;

  const children = node.children || [];
  const hasChildren = children.length > 0;
  const isSelected = selectedIds.includes(node.id);

  // Wrap calculation in a try-catch to prevent a "Back Button" crash
  const someDescendantSelected = useMemo(() => {
    try {
      if (isSelected || !hasChildren) return false;
      return children.some((c: any) =>
        collectDescendantIds(c).some((id) => selectedIds.includes(id))
      );
    } catch (e) {
      return false;
    }
  }, [isSelected, hasChildren, children, selectedIds]);

  const allIds = useMemo(() => {
    try {
      return collectDescendantIds(node);
    } catch (e) {
      return [node.id];
    }
  }, [node]);

  return (
    <li>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(allIds, !isSelected)}
          className={`flex items-center gap-2.5 flex-1 px-2 py-2 rounded-lg text-left transition-all ${
            isSelected ? "text-jet font-semibold" : "text-jet/60"
          }`}
        >
          <span className={`w-4 h-4 rounded border flex items-center justify-center ${
            isSelected ? "bg-[#FFCA68] border-[#FFCA68]" : "border-jet/25 bg-white"
          }`}>
            {isSelected && (
              <svg className="w-2.5 h-2.5 text-jet" viewBox="0 0 10 10" fill="none">
                <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </span>
          <span className="text-sm">{node.name}</span>
          {node.count > 0 && (
            <span className="ml-auto text-xs text-jet/35">{node.count}</span>
          )}
        </button>

        {hasChildren && (
          <button onClick={() => setOpen(!open)} className="p-1.5">
            <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="ml-4 pl-2 border-l border-lavender/50">
          {children.map((child: any) => (
            <Node key={child.id} node={child} selectedIds={selectedIds} onToggle={onToggle} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryTree({ nodes = [], selectedIds = [], onToggle }: TreeProps) {
  if (!nodes || nodes.length === 0) return <div className="p-4 text-xs text-jet/30 italic">Aucune catégorie...</div>;

  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <Node key={node.id} node={node} selectedIds={selectedIds} onToggle={onToggle} />
      ))}
    </ul>
  );
}