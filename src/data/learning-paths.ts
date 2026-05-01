/**
 * Learning paths are situation-based, not role-based. The premise: a busy
 * manager, HRBP, or TR partner shows up because they have a specific job to
 * do. The path selector reorders modules so the most useful one for that
 * situation reads first.
 *
 * The five situations come from the autonomous-execution brief. The sixth
 * option ("Just looking") preserves canonical order for users browsing
 * without a specific task.
 */
export type LearningPathId =
  | "level-new-role"
  | "prepare-promotion"
  | "explain-architecture"
  | "calibrate-boundary"
  | "clean-up-titles"
  | "just-looking";

export type LearningPath = {
  id: LearningPathId;
  label: string;
  /**
   * One-line read of the situation. Renders below the radio label so users
   * recognize their own task without reading every module title first.
   */
  blurb: string;
  moduleOrder: string[];
};

const canonicalOrder = [
  "architecture",
  "leveling",
  "tracks",
  "calibration",
  "pay-transparency",
];

export const learningPaths: LearningPath[] = [
  {
    id: "level-new-role",
    label: "Level a new role",
    blurb: "Sizing a job that hasn't existed before, or a job that just changed shape.",
    moduleOrder: [
      "leveling",
      "tracks",
      "architecture",
      "calibration",
      "pay-transparency",
    ],
  },
  {
    id: "prepare-promotion",
    label: "Prepare a promotion request",
    blurb: "Building the case for an internal promotion before HR reviews it.",
    moduleOrder: [
      "leveling",
      "calibration",
      "tracks",
      "architecture",
      "pay-transparency",
    ],
  },
  {
    id: "explain-architecture",
    label: "Explain job architecture to a manager",
    blurb: "Walking a leader through the model before any calibration or pay conversation.",
    moduleOrder: [
      "architecture",
      "tracks",
      "leveling",
      "pay-transparency",
      "calibration",
    ],
  },
  {
    id: "calibrate-boundary",
    label: "Calibrate a boundary case",
    blurb: "Working a role that sits between two levels and needs a defensible call.",
    moduleOrder: [
      "calibration",
      "leveling",
      "tracks",
      "architecture",
      "pay-transparency",
    ],
  },
  {
    id: "clean-up-titles",
    label: "Clean up titles or career paths",
    blurb: "Tightening a job family before posting ranges or running pay equity work.",
    moduleOrder: [
      "pay-transparency",
      "architecture",
      "tracks",
      "leveling",
      "calibration",
    ],
  },
  {
    id: "just-looking",
    label: "Just looking around",
    blurb: "Read the modules in their default order.",
    moduleOrder: canonicalOrder,
  },
];
