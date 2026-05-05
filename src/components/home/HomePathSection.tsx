"use client";

import { useState } from "react";
import type { LearnModule } from "@/data/modules";
import { learningPaths, type LearningPathId } from "@/data/learning-paths";
import { PathSelector } from "@/components/learn/PathSelector";
import { LearnModuleGrid } from "@/components/learn/LearnModuleGrid";

type Props = {
  modules: LearnModule[];
};

const DEFAULT_FEATURED_ID = "architecture";

/**
 * Client wrapper that owns the selected path. Used on `/` and `/learn` so
 * the surrounding pages stay server-rendered for SEO. Renders the path
 * selector above the module grid, with the grid reordering when the path
 * changes. The featured module (rendered larger with a "Start here" badge)
 * is the first id in the selected path's order, falling back to
 * `architecture` when no path is selected.
 */
export function HomePathSection({ modules }: Props) {
  const [path, setPath] = useState<LearningPathId | null>(null);
  const featuredId = path
    ? (learningPaths.find((p) => p.id === path)?.moduleOrder[0] ??
        DEFAULT_FEATURED_ID)
    : DEFAULT_FEATURED_ID;
  return (
    <div className="space-y-6">
      <PathSelector value={path} onChange={setPath} />
      <LearnModuleGrid
        modules={modules}
        pathId={path}
        featuredId={featuredId}
      />
    </div>
  );
}

export default HomePathSection;
