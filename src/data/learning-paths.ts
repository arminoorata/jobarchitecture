export type LearningPathId = "hrbp" | "manager" | "tr-leader" | "curious";

export type LearningPath = {
  id: LearningPathId;
  label: string;
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
    id: "hrbp",
    label: "I'm an HRBP or People Partner",
    moduleOrder: [
      "calibration",
      "leveling",
      "tracks",
      "architecture",
      "pay-transparency",
    ],
  },
  {
    id: "manager",
    label: "I'm a people manager preparing a leveling case",
    moduleOrder: [
      "leveling",
      "tracks",
      "architecture",
      "calibration",
      "pay-transparency",
    ],
  },
  {
    id: "tr-leader",
    label: "I lead Total Rewards or Comp",
    moduleOrder: [
      "architecture",
      "pay-transparency",
      "calibration",
      "leveling",
      "tracks",
    ],
  },
  {
    id: "curious",
    label: "I'm just looking around",
    moduleOrder: canonicalOrder,
  },
];
