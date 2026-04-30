"use client";

import { useState } from "react";
import type { LearnModule } from "@/data/modules";
import type { LearningPathId } from "@/data/learning-paths";
import { PathSelector } from "@/components/learn/PathSelector";
import { LearnModuleGrid } from "@/components/learn/LearnModuleGrid";

type Props = {
  modules: LearnModule[];
};

/**
 * Client wrapper that owns the selected path. Used on `/` and `/learn` so
 * the surrounding pages stay server-rendered for SEO. Renders the path
 * selector above the module grid, with the grid reordering when the path
 * changes.
 */
export function HomePathSection({ modules }: Props) {
  const [path, setPath] = useState<LearningPathId | null>(null);
  return (
    <div className="space-y-6">
      <PathSelector value={path} onChange={setPath} />
      <LearnModuleGrid modules={modules} pathId={path} />
    </div>
  );
}

export default HomePathSection;
