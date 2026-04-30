import {
  dimensions,
  levelNames,
  type DimensionId,
  type RoleType,
} from "@/data/leveling";

export type LevelRange = {
  code: keyof typeof levelNames;
  min: number;
  max: number;
};

export type LevelingScores = Partial<Record<DimensionId, number>>;

export type LevelingResult = {
  roleType: RoleType;
  coreAverage: number;
  weightedScore: number;
  levelCode: keyof typeof levelNames;
  levelName: string;
  confidence: "High" | "Medium" | "Low";
  standardDeviation: number;
  boundary: string | null;
  flags: string[];
  explanation: string;
  moveUp: string;
  moveDown: string;
  calibrationPrompt: string;
  dimensionRows: Array<{
    id: DimensionId;
    label: string;
    score: number;
  }>;
};

export const levelMaps: Record<RoleType, LevelRange[]> = {
  ic: [
    { code: "P1", min: 1.0, max: 1.7 },
    { code: "P2", min: 1.8, max: 2.4 },
    { code: "P3", min: 2.5, max: 3.2 },
    { code: "P4", min: 3.3, max: 4.0 },
    { code: "P5", min: 4.1, max: 4.8 },
    { code: "P6", min: 4.9, max: 5.6 },
    { code: "P7", min: 5.7, max: 7.0 },
  ],
  manager: [
    { code: "M2", min: 1.0, max: 2.2 },
    { code: "M3", min: 2.3, max: 3.4 },
    { code: "M4", min: 3.5, max: 4.6 },
    { code: "M5", min: 4.7, max: 5.8 },
    { code: "M6", min: 5.9, max: 7.0 },
  ],
  executive: [
    { code: "E1", min: 1.0, max: 2.2 },
    { code: "E2", min: 2.3, max: 3.4 },
    { code: "E3", min: 3.5, max: 4.6 },
    { code: "E4", min: 4.7, max: 5.8 },
    { code: "E5", min: 5.9, max: 7.0 },
  ],
};

const coreIds: DimensionId[] = [
  "scope",
  "complexity",
  "autonomy",
  "influence",
  "knowledge",
  "businessImpact",
];

export function requiredDimensionIds(roleType: RoleType): DimensionId[] {
  if (roleType === "manager") return [...coreIds, "peopleLeadership"];
  if (roleType === "executive") return [...coreIds, "strategyOwnership"];
  return coreIds;
}

export function calculateLevelingResult(
  roleType: RoleType,
  scores: LevelingScores,
): LevelingResult {
  const requiredIds = requiredDimensionIds(roleType);
  const rows = requiredIds.map((id) => {
    const dimension = dimensions.find((item) => item.id === id);
    if (!dimension) {
      throw new Error(`Unknown dimension: ${id}`);
    }
    const score = scores[id];
    if (!score) {
      throw new Error(`Missing score: ${id}`);
    }
    return {
      id,
      label: dimension.shortLabel,
      score,
    };
  });

  const coreAverage = average(coreIds.map((id) => scores[id] ?? 0));
  const weightedScore =
    roleType === "manager"
      ? coreAverage * 0.8 + (scores.peopleLeadership ?? 0) * 0.2
      : roleType === "executive"
        ? coreAverage * 0.7 + (scores.strategyOwnership ?? 0) * 0.3
        : coreAverage;

  const map = mapScore(roleType, weightedScore);
  const standardDeviation = stdDev(rows.map((row) => row.score));
  const confidence = confidenceFromDeviation(standardDeviation);
  const flags = getFlags(roleType, scores, standardDeviation);
  const explanation = buildExplanation(map.code, rows, confidence);

  return {
    roleType,
    coreAverage: roundTo(coreAverage, 2),
    weightedScore: roundTo(weightedScore, 2),
    levelCode: map.code,
    levelName: levelNames[map.code],
    confidence,
    standardDeviation: roundTo(standardDeviation, 2),
    boundary: map.boundary,
    flags,
    explanation,
    moveUp: buildMoveUp(rows, roleType),
    moveDown: buildMoveDown(rows),
    calibrationPrompt:
      "Compare this role to two known roles in your organization: one clearly below this level and one clearly above it. Does the scope, independence, and impact still line up?",
    dimensionRows: rows,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDev(values: number[]): number {
  const avg = average(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function confidenceFromDeviation(
  standardDeviation: number,
): LevelingResult["confidence"] {
  if (standardDeviation <= 0.5) return "High";
  if (standardDeviation <= 1.2) return "Medium";
  return "Low";
}

function mapScore(
  roleType: RoleType,
  score: number,
): {
  code: keyof typeof levelNames;
  boundary: string | null;
} {
  const roundedScore = roundTo(score, 1);
  const ranges = levelMaps[roleType];
  const range =
    ranges.find((item) => roundedScore >= item.min && roundedScore <= item.max) ??
    (roundedScore < ranges[0].min ? ranges[0] : ranges[ranges.length - 1]);

  const boundary =
    ranges
      .slice(1)
      .map((item, index) => ({
        value: item.min,
        pair: `${ranges[index].code}/${item.code}`,
      }))
      .find((item) => Math.abs(score - item.value) <= 0.2)?.pair ?? null;

  return {
    code: range.code,
    boundary,
  };
}

function getFlags(
  roleType: RoleType,
  scores: LevelingScores,
  standardDeviation: number,
): string[] {
  const flags: string[] = [];

  if ((scores.autonomy ?? 0) >= 6 && (scores.complexity ?? 0) <= 3) {
    flags.push(
      "Autonomy is very high while complexity is low. Confirm whether the role is truly independent or simply lightly supervised.",
    );
  }

  if ((scores.peopleLeadership ?? 0) >= 6 && (scores.scope ?? 0) <= 3) {
    flags.push(
      "People leadership is very high while scope is narrow. Confirm team scale and organizational reach.",
    );
  }

  if (roleType === "executive" && (scores.strategyOwnership ?? 0) <= 3) {
    flags.push(
      "Executive track was selected, but strategy ownership is low. Confirm whether this is an executive role or a senior management role.",
    );
  }

  const requiredScores = requiredDimensionIds(roleType).map((id) => scores[id] ?? 0);
  if (Math.max(...requiredScores) - Math.min(...requiredScores) >= 3) {
    flags.push(
      "Scores vary widely across dimensions. The role may be a hybrid, a stretch assignment, or a boundary case.",
    );
  } else if (standardDeviation > 1.2) {
    flags.push(
      "Scores vary widely across dimensions. Review the highest and lowest scores before using the recommendation.",
    );
  }

  return flags;
}

function buildExplanation(
  levelCode: keyof typeof levelNames,
  rows: LevelingResult["dimensionRows"],
  confidence: LevelingResult["confidence"],
): string {
  const topRows = [...rows].sort((a, b) => b.score - a.score).slice(0, 2);
  const lowRows = [...rows].sort((a, b) => a.score - b.score).slice(0, 2);
  const strengths = topRows.map((row) => row.label.toLowerCase()).join(" and ");
  const constraints = lowRows.map((row) => row.label.toLowerCase()).join(" and ");

  if (confidence === "High") {
    return `The pattern points cleanly to ${levelCode}. The strongest evidence is ${strengths}, and the other dimensions are reasonably aligned.`;
  }

  if (confidence === "Medium") {
    return `The pattern points to ${levelCode}, with the strongest evidence in ${strengths}. The main calibration tension is ${constraints}, so compare this role to adjacent levels before finalizing.`;
  }

  return `The pattern points directionally to ${levelCode}, but the score spread is wide. The role shows high ${strengths} while ${constraints} are materially lower, which makes this a calibration case.`;
}

function buildMoveUp(
  rows: LevelingResult["dimensionRows"],
  roleType: RoleType,
): string {
  const lowRows = [...rows]
    .filter((row) => row.score < 6)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  if (roleType === "manager" && lowRows.some((row) => row.id === "peopleLeadership")) {
    return "Clearer ownership of people outcomes, larger team scale, and broader cross-functional operating impact.";
  }

  if (roleType === "executive" && lowRows.some((row) => row.id === "strategyOwnership")) {
    return "Durable ownership of business or enterprise strategy, including resource choices and measurable outcomes.";
  }

  return `Broader ${lowRows
    .map((row) => row.label.toLowerCase())
    .join(" and ")} would make the next level more credible.`;
}

function buildMoveDown(rows: LevelingResult["dimensionRows"]): string {
  const highRows = [...rows]
    .filter((row) => row.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  return `Reduced ${highRows
    .map((row) => row.label.toLowerCase())
    .join(" and ")} would point to a lower level.`;
}

export function buildSummaryText(result: LevelingResult): string {
  const lines = [
    "Job Architecture Toolkit - Leveling Summary",
    "",
    `Recommended level: ${result.levelCode} - ${result.levelName}`,
    `Role type: ${roleTypeLabel(result.roleType)}`,
    `Weighted score: ${result.weightedScore}`,
    `Core average: ${result.coreAverage}`,
    `Confidence: ${result.confidence}`,
    `Boundary: ${result.boundary ?? "None"}`,
    "",
    "Dimension scores:",
    ...result.dimensionRows.map((row) => `- ${row.label}: ${row.score}`),
    "",
    "Explanation:",
    result.explanation,
    "",
    "What would move it up:",
    result.moveUp,
    "",
    "What would move it down:",
    result.moveDown,
    "",
    "Calibration prompt:",
    result.calibrationPrompt,
    "",
    "Flags:",
    ...(result.flags.length ? result.flags.map((flag) => `- ${flag}`) : ["- None"]),
    "",
    "Disclaimer:",
    "This tool provides a directional job level recommendation based on general market practices. It is intended for guidance only and should be used alongside internal calibration and judgment. It does not reproduce proprietary Radford, Mercer, WTW, or other survey-provider methodology.",
  ];

  return lines.join("\n");
}

export function roleTypeLabel(roleType: RoleType): string {
  if (roleType === "ic") return "Individual Contributor";
  if (roleType === "manager") return "People Manager";
  return "Executive";
}
