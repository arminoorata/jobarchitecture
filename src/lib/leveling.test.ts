import { describe, expect, it } from "vitest";
import {
  buildSummaryText,
  calculateLevelingResult,
  levelMaps,
  requiredDimensionIds,
  roleTypeLabel,
  type LevelingScores,
} from "./leveling";

/**
 * Engine guardrail tests for `src/lib/leveling.ts`.
 *
 * The wizard ships applied-learning copy on top of these formulas, so any
 * accidental behavior change here would silently mislead users. The tests
 * lock the contract: scoring, weighting, confidence, boundaries, flags,
 * explanations, summary text. Fixtures match the engine reference doc.
 */

const balancedIcScores: LevelingScores = {
  scope: 4,
  complexity: 4,
  autonomy: 4,
  influence: 3,
  knowledge: 4,
  businessImpact: 4,
};

const balancedManagerScores: LevelingScores = {
  scope: 4,
  complexity: 4,
  autonomy: 4,
  influence: 4,
  knowledge: 4,
  businessImpact: 4,
  peopleLeadership: 4,
};

const balancedExecScores: LevelingScores = {
  scope: 5,
  complexity: 5,
  autonomy: 5,
  influence: 5,
  knowledge: 5,
  businessImpact: 5,
  strategyOwnership: 5,
};

describe("requiredDimensionIds", () => {
  it("returns the six core dimensions for IC track", () => {
    expect(requiredDimensionIds("ic")).toEqual([
      "scope",
      "complexity",
      "autonomy",
      "influence",
      "knowledge",
      "businessImpact",
    ]);
  });

  it("appends peopleLeadership for manager track", () => {
    const ids = requiredDimensionIds("manager");
    expect(ids).toHaveLength(7);
    expect(ids[6]).toBe("peopleLeadership");
  });

  it("appends strategyOwnership for executive track", () => {
    const ids = requiredDimensionIds("executive");
    expect(ids).toHaveLength(7);
    expect(ids[6]).toBe("strategyOwnership");
  });
});

describe("roleTypeLabel", () => {
  it("maps role types to user-facing labels", () => {
    expect(roleTypeLabel("ic")).toBe("Individual Contributor");
    expect(roleTypeLabel("manager")).toBe("People Manager");
    expect(roleTypeLabel("executive")).toBe("Executive");
  });
});

describe("levelMaps", () => {
  it("defines seven IC bands from P1 to P7", () => {
    expect(levelMaps.ic.map((r) => r.code)).toEqual([
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      "P7",
    ]);
  });

  it("defines five manager bands from M2 to M6 (no M1 by design)", () => {
    expect(levelMaps.manager.map((r) => r.code)).toEqual([
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ]);
  });

  it("defines five executive bands from E1 to E5", () => {
    expect(levelMaps.executive.map((r) => r.code)).toEqual([
      "E1",
      "E2",
      "E3",
      "E4",
      "E5",
    ]);
  });
});

describe("IC score-to-level mapping", () => {
  // Each row: scores producing a known core average that lands in the band.
  const cases: Array<{ scores: LevelingScores; expected: string }> = [
    {
      // average 1.5 → P1
      scores: { scope: 1, complexity: 2, autonomy: 1, influence: 2, knowledge: 2, businessImpact: 1 },
      expected: "P1",
    },
    {
      // average 2.0 → P2
      scores: { scope: 2, complexity: 2, autonomy: 2, influence: 2, knowledge: 2, businessImpact: 2 },
      expected: "P2",
    },
    {
      // average 3.0 → P3
      scores: { scope: 3, complexity: 3, autonomy: 3, influence: 3, knowledge: 3, businessImpact: 3 },
      expected: "P3",
    },
    {
      // average ≈3.83 → P4 (rounded to 3.8 falls in 3.3..4.0)
      scores: balancedIcScores,
      expected: "P4",
    },
    {
      // average 4.5 → P5
      scores: { scope: 5, complexity: 5, autonomy: 4, influence: 4, knowledge: 5, businessImpact: 4 },
      expected: "P5",
    },
    {
      // average 5.0 → P6 (rounded score 5.0 falls in 4.9..5.6)
      scores: { scope: 5, complexity: 5, autonomy: 5, influence: 5, knowledge: 5, businessImpact: 5 },
      expected: "P6",
    },
    {
      // average ≈5.83 → P7 (rounded to 5.8 falls in 5.7..7.0)
      scores: { scope: 6, complexity: 6, autonomy: 6, influence: 5, knowledge: 6, businessImpact: 6 },
      expected: "P7",
    },
  ];

  for (const c of cases) {
    it(`maps to ${c.expected}`, () => {
      const r = calculateLevelingResult("ic", c.scores);
      expect(r.levelCode).toBe(c.expected);
    });
  }

  it("clamps to the lowest band when the weighted score falls below it", () => {
    // Hypothetical out-of-domain scores (engine doesn't validate input range).
    const r = calculateLevelingResult("ic", {
      scope: 0.5,
      complexity: 0.5,
      autonomy: 0.5,
      influence: 0.5,
      knowledge: 0.5,
      businessImpact: 0.5,
    });
    expect(r.levelCode).toBe("P1");
  });

  it("clamps to the highest band when the weighted score exceeds it", () => {
    const r = calculateLevelingResult("ic", {
      scope: 9,
      complexity: 9,
      autonomy: 9,
      influence: 9,
      knowledge: 9,
      businessImpact: 9,
    });
    expect(r.levelCode).toBe("P7");
  });
});

describe("Manager track weighting and per-band coverage", () => {
  it("computes weightedScore as 0.8*coreAverage + 0.2*peopleLeadership", () => {
    const r = calculateLevelingResult("manager", balancedManagerScores);
    expect(r.coreAverage).toBe(4);
    // 0.8 * 4 + 0.2 * 4 = 4
    expect(r.weightedScore).toBe(4);
    expect(r.levelCode).toBe("M4"); // 4.0 falls in 3.5..4.6
  });

  it("shifts the result when peopleLeadership is much higher than core", () => {
    // Core 3, peopleLeadership 7 → weighted = 0.8*3 + 0.2*7 = 2.4 + 1.4 = 3.8 → M4
    const r = calculateLevelingResult("manager", {
      scope: 3,
      complexity: 3,
      autonomy: 3,
      influence: 3,
      knowledge: 3,
      businessImpact: 3,
      peopleLeadership: 7,
    });
    expect(r.weightedScore).toBeCloseTo(3.8, 5);
    expect(r.levelCode).toBe("M4");
  });

  it("matches the engine reference §16.2 manager-boundary worked example", () => {
    // §16.2: scope 3, complexity 3, autonomy 3, influence 4, knowledge 4,
    // businessImpact 3, peopleLeadership 4. Weighted 3.467, lookup 3.5 → M4.
    const r = calculateLevelingResult("manager", {
      scope: 3,
      complexity: 3,
      autonomy: 3,
      influence: 4,
      knowledge: 4,
      businessImpact: 3,
      peopleLeadership: 4,
    });
    expect(r.coreAverage).toBeCloseTo(3.33, 2);
    expect(r.weightedScore).toBeCloseTo(3.47, 2);
    expect(r.levelCode).toBe("M4");
    expect(r.boundary).toBe("M3/M4");
  });

  // Each row exercises a different M-band so the mapping table is locked.
  const cases: Array<{ scores: LevelingScores; expected: string }> = [
    {
      // weighted = 0.8*1 + 0.2*1 = 1.0 → M2
      scores: { scope: 1, complexity: 1, autonomy: 1, influence: 1, knowledge: 1, businessImpact: 1, peopleLeadership: 1 },
      expected: "M2",
    },
    {
      // weighted = 0.8*3 + 0.2*3 = 3.0 → M3 (band 2.3..3.4)
      scores: { scope: 3, complexity: 3, autonomy: 3, influence: 3, knowledge: 3, businessImpact: 3, peopleLeadership: 3 },
      expected: "M3",
    },
    {
      // weighted = 0.8*4 + 0.2*4 = 4.0 → M4 (band 3.5..4.6)
      scores: { scope: 4, complexity: 4, autonomy: 4, influence: 4, knowledge: 4, businessImpact: 4, peopleLeadership: 4 },
      expected: "M4",
    },
    {
      // weighted = 0.8*5 + 0.2*5 = 5.0 → M5 (band 4.7..5.8)
      scores: { scope: 5, complexity: 5, autonomy: 5, influence: 5, knowledge: 5, businessImpact: 5, peopleLeadership: 5 },
      expected: "M5",
    },
    {
      // weighted = 0.8*6 + 0.2*6 = 6.0 → M6 (band 5.9..7.0)
      scores: { scope: 6, complexity: 6, autonomy: 6, influence: 6, knowledge: 6, businessImpact: 6, peopleLeadership: 6 },
      expected: "M6",
    },
  ];
  for (const c of cases) {
    it(`maps to ${c.expected}`, () => {
      expect(calculateLevelingResult("manager", c.scores).levelCode).toBe(
        c.expected,
      );
    });
  }
});

describe("Executive track weighting and per-band coverage", () => {
  it("computes weightedScore as 0.7*coreAverage + 0.3*strategyOwnership", () => {
    const r = calculateLevelingResult("executive", balancedExecScores);
    expect(r.coreAverage).toBe(5);
    // 0.7*5 + 0.3*5 = 5
    expect(r.weightedScore).toBe(5);
    expect(r.levelCode).toBe("E4"); // 5.0 falls in 4.7..5.8
  });

  it("matches the engine reference §16.3 flag-trigger worked example", () => {
    // §16.3: scope 6, complexity 5, autonomy 7, influence 6, knowledge 6,
    // businessImpact 6, strategyOwnership 2 → weighted 4.80, level E4,
    // boundary E3/E4, low confidence, two flags.
    const r = calculateLevelingResult("executive", {
      scope: 6,
      complexity: 5,
      autonomy: 7,
      influence: 6,
      knowledge: 6,
      businessImpact: 6,
      strategyOwnership: 2,
    });
    expect(r.coreAverage).toBe(6);
    expect(r.weightedScore).toBeCloseTo(4.8, 5);
    expect(r.levelCode).toBe("E4");
    expect(r.boundary).toBe("E3/E4");
    expect(r.confidence).toBe("Low");
    // Lock by content, not count: only the executive-strategy flag and the
    // spread flag should fire, never the std-dev variant of flag 5.
    const flagText = r.flags.join(" | ");
    expect(flagText).toMatch(/Executive track was selected/);
    expect(flagText).toMatch(/Scores vary widely across dimensions\. The role/);
    expect(flagText).not.toMatch(/Review the highest and lowest scores/);
  });

  const cases: Array<{ scores: LevelingScores; expected: string }> = [
    {
      // weighted = 0.7*1 + 0.3*1 = 1.0 → E1
      scores: { scope: 1, complexity: 1, autonomy: 1, influence: 1, knowledge: 1, businessImpact: 1, strategyOwnership: 1 },
      expected: "E1",
    },
    {
      // weighted = 0.7*3 + 0.3*3 = 3.0 → E2 (band 2.3..3.4)
      scores: { scope: 3, complexity: 3, autonomy: 3, influence: 3, knowledge: 3, businessImpact: 3, strategyOwnership: 3 },
      expected: "E2",
    },
    {
      // weighted = 0.7*4 + 0.3*4 = 4.0 → E3 (band 3.5..4.6)
      scores: { scope: 4, complexity: 4, autonomy: 4, influence: 4, knowledge: 4, businessImpact: 4, strategyOwnership: 4 },
      expected: "E3",
    },
    {
      // weighted = 0.7*5 + 0.3*5 = 5.0 → E4 (band 4.7..5.8)
      scores: { scope: 5, complexity: 5, autonomy: 5, influence: 5, knowledge: 5, businessImpact: 5, strategyOwnership: 5 },
      expected: "E4",
    },
    {
      // weighted = 0.7*6 + 0.3*7 = 4.2 + 2.1 = 6.3 → E5 (band 5.9..7.0)
      scores: { scope: 6, complexity: 6, autonomy: 6, influence: 6, knowledge: 6, businessImpact: 6, strategyOwnership: 7 },
      expected: "E5",
    },
  ];
  for (const c of cases) {
    it(`maps to ${c.expected}`, () => {
      expect(calculateLevelingResult("executive", c.scores).levelCode).toBe(
        c.expected,
      );
    });
  }
});

describe("Boundary detection", () => {
  it("does not fire when the weighted score is comfortably inside a band", () => {
    // P4 band centerline: 3.65. Engine reference §16.1 confirms no boundary.
    const r = calculateLevelingResult("ic", balancedIcScores);
    expect(r.boundary).toBeNull();
  });

  it("fires when the weighted score is within +0.2 of an upper threshold", () => {
    // weighted ≈ 4.0, upper P4 boundary is 4.1. |4.0-4.1| = 0.1 → P4/P5.
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
    });
    expect(r.weightedScore).toBe(4);
    expect(r.boundary).toBe("P4/P5");
  });

  it("fires when the weighted score is within -0.2 of a lower threshold", () => {
    // weighted = 4.83, P5 spans 4.1..4.8. |4.83-4.9| = 0.07 → boundary P5/P6.
    const r = calculateLevelingResult("ic", {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 4,
    });
    expect(r.weightedScore).toBeCloseTo(4.83, 2);
    expect(r.boundary).toBe("P5/P6");
  });

  it("fires when within tolerance above a threshold (well inside ±0.2)", () => {
    // weighted = 4.25, threshold 4.1 → |4.25 - 4.1| = 0.15. Inside tolerance.
    // Avoids floating-point edge cases that bite at exactly 0.2.
    const r = calculateLevelingResult("ic", {
      scope: 4.25,
      complexity: 4.25,
      autonomy: 4.25,
      influence: 4.25,
      knowledge: 4.25,
      businessImpact: 4.25,
    });
    expect(r.weightedScore).toBeCloseTo(4.25, 5);
    expect(r.boundary).toBe("P4/P5");
  });

  it("does not fire when comfortably outside ±0.2 tolerance", () => {
    // weighted ≈ 3.5, threshold 4.1 → |3.5 - 4.1| = 0.6. Outside tolerance.
    const r = calculateLevelingResult("ic", {
      scope: 3.5,
      complexity: 3.5,
      autonomy: 3.5,
      influence: 3.5,
      knowledge: 3.5,
      businessImpact: 3.5,
    });
    expect(r.weightedScore).toBe(3.5);
    expect(r.boundary).toBeNull();
  });

  it("does not fire when unrounded score is just outside tolerance even if rounded lands inside", () => {
    // Threshold 4.1. Pick weighted = 3.875 → rounded 3.9 is inside ±0.2 of
    // 4.1, but unrounded 3.875 has |3.875 - 4.1| = 0.225, which is outside
    // the ±0.2 inclusive tolerance. The engine must use the unrounded value.
    const r = calculateLevelingResult("ic", {
      scope: 3.875,
      complexity: 3.875,
      autonomy: 3.875,
      influence: 3.875,
      knowledge: 3.875,
      businessImpact: 3.875,
    });
    expect(r.weightedScore).toBeCloseTo(3.88, 2);
    expect(r.boundary).toBeNull();
  });

  it("respects the unrounded weighted score for boundary checks (§16.1 case)", () => {
    // Engine reference §16.1: unrounded 3.833 vs threshold 4.1 → 0.267 gap,
    // no boundary, even though the rounded lookup score 3.8 sits in P4.
    const r = calculateLevelingResult("ic", balancedIcScores);
    expect(r.weightedScore).toBeCloseTo(3.83, 2);
    expect(r.boundary).toBeNull();
  });
});

describe("Confidence rating", () => {
  it("returns High when scores agree closely (std dev <= 0.5)", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
    });
    expect(r.standardDeviation).toBe(0);
    expect(r.confidence).toBe("High");
  });

  it("returns Medium when scores have moderate spread (0.5 < std dev <= 1.2)", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 5,
      autonomy: 3,
      influence: 4,
      knowledge: 5,
      businessImpact: 3,
    });
    expect(r.confidence).toBe("Medium");
  });

  it("returns Low when scores vary widely (std dev > 1.2)", () => {
    const r = calculateLevelingResult("ic", {
      scope: 6,
      complexity: 5,
      autonomy: 7,
      influence: 6,
      knowledge: 6,
      businessImpact: 1,
    });
    expect(r.confidence).toBe("Low");
  });

  it("treats std dev exactly 0.5 as High (inclusive upper edge)", () => {
    // Three 4s and three 5s (population stdDev = 0.5).
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
    });
    expect(r.standardDeviation).toBe(0.5);
    expect(r.confidence).toBe("High");
  });

  it("returns Medium when std dev is just above 0.5", () => {
    // Decimal scores nudge std dev slightly above 0.5.
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 5,
      knowledge: 5,
      businessImpact: 5.05,
    });
    expect(r.standardDeviation).toBeGreaterThan(0.5);
    expect(r.confidence).toBe("Medium");
  });

  it("returns Medium when std dev is just below 1.2", () => {
    // Three 3s and three 5s on integer inputs → population std dev exactly 1.0.
    // (mean 4, devs ±1, variance 1, sqrt 1.) Comfortably below 1.2.
    const r = calculateLevelingResult("ic", {
      scope: 3,
      complexity: 5,
      autonomy: 3,
      influence: 5,
      knowledge: 3,
      businessImpact: 5,
    });
    expect(r.standardDeviation).toBe(1);
    expect(r.confidence).toBe("Medium");
  });

  it("returns Low when std dev is comfortably above 1.2", () => {
    // 2/5 split alternating → mean 3.5, devs ±1.5, variance 2.25, sqrt 1.5.
    const r = calculateLevelingResult("ic", {
      scope: 2,
      complexity: 5,
      autonomy: 2,
      influence: 5,
      knowledge: 2,
      businessImpact: 5,
    });
    expect(r.standardDeviation).toBe(1.5);
    expect(r.confidence).toBe("Low");
  });
});

describe("Sanity flags", () => {
  it("flags autonomy >= 6 with complexity <= 3", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 3,
      autonomy: 6,
      influence: 3,
      knowledge: 4,
      businessImpact: 4,
    });
    const text = r.flags.join(" | ");
    expect(text).toMatch(/Autonomy is very high while complexity is low/);
  });

  it("flags peopleLeadership >= 6 with scope <= 3 on manager track", () => {
    const r = calculateLevelingResult("manager", {
      scope: 3,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
      peopleLeadership: 6,
    });
    const text = r.flags.join(" | ");
    expect(text).toMatch(/People leadership is very high/);
  });

  it("flags executive selection with strategyOwnership <= 3", () => {
    const r = calculateLevelingResult("executive", {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
      strategyOwnership: 3,
    });
    const text = r.flags.join(" | ");
    expect(text).toMatch(/Executive track was selected/);
  });

  it("flags wide spread (max - min >= 3) and suppresses the std-dev variant", () => {
    const r = calculateLevelingResult("ic", {
      scope: 7,
      complexity: 7,
      autonomy: 7,
      influence: 1,
      knowledge: 6,
      businessImpact: 1,
    });
    const wideSpread = r.flags.find((f) =>
      f.startsWith("Scores vary widely across dimensions. The role"),
    );
    const stdDevVariant = r.flags.find((f) =>
      f.startsWith("Scores vary widely across dimensions. Review"),
    );
    expect(wideSpread).toBeDefined();
    expect(stdDevVariant).toBeUndefined();
  });

  it("returns no flags for clean balanced inputs", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    expect(r.flags).toEqual([]);
  });

  it("fires only the std-dev variant when spread < 3 but std dev > 1.2", () => {
    // 2.5 / 5 split alternating: spread = 2.5 (< 3), std dev = 1.25 (> 1.2).
    // Flag 4 (spread) does not fire; flag 5 (std-dev review) does.
    const r = calculateLevelingResult("ic", {
      scope: 2.5,
      complexity: 5,
      autonomy: 2.5,
      influence: 5,
      knowledge: 2.5,
      businessImpact: 5,
    });
    expect(r.standardDeviation).toBe(1.25);
    const reviewVariant = r.flags.find((f) =>
      f.startsWith("Scores vary widely across dimensions. Review"),
    );
    const wideSpreadVariant = r.flags.find((f) =>
      f.startsWith("Scores vary widely across dimensions. The role"),
    );
    expect(reviewVariant).toBeDefined();
    expect(wideSpreadVariant).toBeUndefined();
  });
});

describe("Missing-score behavior", () => {
  it("throws when a required dimension is missing", () => {
    const incomplete: LevelingScores = {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      // businessImpact missing
    };
    expect(() => calculateLevelingResult("ic", incomplete)).toThrow(
      /Missing score: businessImpact/,
    );
  });

  it("throws when manager track is selected without peopleLeadership", () => {
    expect(() =>
      calculateLevelingResult("manager", balancedIcScores),
    ).toThrow(/Missing score: peopleLeadership/);
  });

  it("throws when executive track is selected without strategyOwnership", () => {
    expect(() =>
      calculateLevelingResult("executive", balancedIcScores),
    ).toThrow(/Missing score: strategyOwnership/);
  });

  it("treats a zero score as missing (current engine behavior)", () => {
    expect(() =>
      calculateLevelingResult("ic", {
        scope: 0,
        complexity: 4,
        autonomy: 4,
        influence: 4,
        knowledge: 4,
        businessImpact: 4,
      }),
    ).toThrow(/Missing score: scope/);
  });
});

describe("Explanation generation", () => {
  it("emits the exact high-confidence template", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
    });
    // All scores tie at 4. Stable sort preserves dimensionRows order, so the
    // top two are scope and complexity (lowercase via shortLabel).
    expect(r.explanation).toBe(
      "The pattern points cleanly to P4. The strongest evidence is scope and complexity, and the other dimensions are reasonably aligned.",
    );
  });

  it("emits the exact medium-confidence template with calibration tension", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 5,
      autonomy: 3,
      influence: 4,
      knowledge: 5,
      businessImpact: 3,
    });
    // Top two by score: complexity (5) and knowledge (5), stable order.
    // Bottom two: autonomy (3) and businessImpact (3), stable order.
    expect(r.explanation).toBe(
      "The pattern points to P4, with the strongest evidence in complexity and knowledge. The main calibration tension is autonomy and impact, so compare this role to adjacent levels before finalizing.",
    );
  });

  it("emits the exact low-confidence template when scores spread widely", () => {
    const r = calculateLevelingResult("ic", {
      scope: 6,
      complexity: 5,
      autonomy: 7,
      influence: 6,
      knowledge: 6,
      businessImpact: 1,
    });
    // Sum 31, mean 5.17, lookup 5.2 → P6 band.
    // Top two desc: autonomy (7), then 6s in stable order → scope.
    // Bottom two asc: businessImpact (1), then complexity (5).
    expect(r.levelCode).toBe("P6");
    expect(r.explanation).toBe(
      "The pattern points directionally to P6, but the score spread is wide. The role shows high autonomy and scope while impact and complexity are materially lower, which makes this a calibration case.",
    );
  });
});

describe("Move-up / move-down generation", () => {
  it("returns a clean move-up sentence on balanced IC inputs", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    expect(r.moveUp).toBe(
      "Broader influence and scope would make the next level more credible.",
    );
  });

  it("returns a clean move-down sentence on balanced IC inputs", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    expect(r.moveDown).toBe(
      "Reduced scope and complexity would point to a lower level.",
    );
  });

  it("emits the exact manager-specific move-up copy when peopleLeadership is among the lowest", () => {
    const r = calculateLevelingResult("manager", {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
      peopleLeadership: 3,
    });
    expect(r.moveUp).toBe(
      "Clearer ownership of people outcomes, larger team scale, and broader cross-functional operating impact.",
    );
  });

  it("emits the exact executive-specific move-up copy when strategyOwnership is among the lowest", () => {
    const r = calculateLevelingResult("executive", {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
      strategyOwnership: 3,
    });
    expect(r.moveUp).toBe(
      "Durable ownership of business or enterprise strategy, including resource choices and measurable outcomes.",
    );
  });

  it("emits the exact ceiling empty-join string", () => {
    // Engine reference §15: with all scores >= 6, move-up filter is empty.
    // Locking the documented exact output so the wizard's empty-join detector
    // (which looks for "  ") keeps working.
    const r = calculateLevelingResult("ic", {
      scope: 7,
      complexity: 7,
      autonomy: 7,
      influence: 7,
      knowledge: 7,
      businessImpact: 7,
    });
    expect(r.moveUp).toBe(
      "Broader  would make the next level more credible.",
    );
  });

  it("emits the exact floor empty-join string", () => {
    const r = calculateLevelingResult("ic", {
      scope: 1,
      complexity: 1,
      autonomy: 1,
      influence: 1,
      knowledge: 1,
      businessImpact: 1,
    });
    expect(r.moveDown).toBe("Reduced  would point to a lower level.");
  });
});

describe("Decimal-input acceptance and tie behavior", () => {
  it("accepts decimal scores without throwing (engine does not validate)", () => {
    // The wizard only emits integers, but the engine accepts numeric input
    // without bounds checking. Locking that behavior so a future change is a
    // deliberate tightening, not an accidental loosening.
    const r = calculateLevelingResult("ic", {
      scope: 3.5,
      complexity: 3.5,
      autonomy: 3.5,
      influence: 3.5,
      knowledge: 3.5,
      businessImpact: 3.5,
    });
    expect(r.coreAverage).toBe(3.5);
    expect(r.weightedScore).toBe(3.5);
    expect(r.levelCode).toBe("P4");
  });

  it("uses dimensionRows order to break ties in move-up sorting", () => {
    // All six dimensions tie at 3. requiredDimensionIds order is scope,
    // complexity, autonomy, influence, knowledge, businessImpact. The first
    // two ascending should come from that order, which Array.prototype.sort
    // preserves stably in modern JavaScript.
    const r = calculateLevelingResult("ic", {
      scope: 3,
      complexity: 3,
      autonomy: 3,
      influence: 3,
      knowledge: 3,
      businessImpact: 3,
    });
    expect(r.moveUp).toBe(
      "Broader scope and complexity would make the next level more credible.",
    );
  });

  it("uses dimensionRows order to break ties in move-down sorting", () => {
    const r = calculateLevelingResult("ic", {
      scope: 3,
      complexity: 3,
      autonomy: 3,
      influence: 3,
      knowledge: 3,
      businessImpact: 3,
    });
    // Descending sort with stable ties yields scope, complexity for the top
    // two of the > 2 filter.
    expect(r.moveDown).toBe(
      "Reduced scope and complexity would point to a lower level.",
    );
  });

  it("uses dimensionRows order to break ties in explanation top/bottom selection", () => {
    const r = calculateLevelingResult("ic", {
      scope: 3,
      complexity: 3,
      autonomy: 3,
      influence: 3,
      knowledge: 3,
      businessImpact: 3,
    });
    // High confidence path. Top two ties go to scope/complexity.
    expect(r.explanation).toBe(
      "The pattern points cleanly to P3. The strongest evidence is scope and complexity, and the other dimensions are reasonably aligned.",
    );
  });
});

describe("Calibration prompt", () => {
  it("returns the same coaching question on every result", () => {
    const a = calculateLevelingResult("ic", balancedIcScores);
    const b = calculateLevelingResult("manager", balancedManagerScores);
    expect(a.calibrationPrompt).toBe(b.calibrationPrompt);
    expect(a.calibrationPrompt).toMatch(/two known roles in your organization/);
  });
});

describe("buildSummaryText", () => {
  it("emits the full summary in the expected section order", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    const lines = summary.split("\n");
    expect(lines[0]).toBe("Job Architecture Toolkit - Leveling Summary");
    expect(lines[1]).toBe("");

    // Section anchors must appear in this order.
    const order = [
      "Recommended level:",
      "Role type:",
      "Weighted score:",
      "Core average:",
      "Confidence:",
      "Boundary:",
      "Dimension scores:",
      "Explanation:",
      "What would move it up:",
      "What would move it down:",
      "Calibration prompt:",
      "Flags:",
      "Disclaimer:",
    ];
    let cursor = 0;
    for (const anchor of order) {
      const idx = lines.findIndex(
        (line, i) => i >= cursor && line.startsWith(anchor),
      );
      expect(idx, `missing or out-of-order anchor: ${anchor}`).toBeGreaterThan(
        -1,
      );
      cursor = idx + 1;
    }
  });

  it("renders the recommended level, role type, weighted score, core average, and confidence verbatim", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    expect(summary).toContain(
      `Recommended level: ${r.levelCode} - ${r.levelName}`,
    );
    expect(summary).toContain("Role type: Individual Contributor");
    expect(summary).toContain(`Weighted score: ${r.weightedScore}`);
    expect(summary).toContain(`Core average: ${r.coreAverage}`);
    expect(summary).toContain(`Confidence: ${r.confidence}`);
  });

  it("renders 'None' when there is no boundary", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    expect(summary).toContain("Boundary: None");
  });

  it("renders the boundary pair when one fires", () => {
    const r = calculateLevelingResult("ic", {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
    });
    const summary = buildSummaryText(r);
    expect(summary).toContain("Boundary: P4/P5");
  });

  it("renders one dimension row per required dimension and no extras", () => {
    const r = calculateLevelingResult("manager", balancedManagerScores);
    const summary = buildSummaryText(r);
    // The dimension list lives between "Dimension scores:" and the next blank
    // line. Manager track has seven required dimensions.
    const lines = summary.split("\n");
    const start = lines.indexOf("Dimension scores:") + 1;
    const end = lines.indexOf("", start);
    expect(end - start).toBe(7);
  });

  it("renders explanation, move-up, move-down, and calibration prompt verbatim", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    expect(summary).toContain(`\nExplanation:\n${r.explanation}\n`);
    expect(summary).toContain(`\nWhat would move it up:\n${r.moveUp}\n`);
    expect(summary).toContain(`\nWhat would move it down:\n${r.moveDown}\n`);
    expect(summary).toContain(
      `\nCalibration prompt:\n${r.calibrationPrompt}\n`,
    );
  });

  it("includes a 'None' line when the result has no flags", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    expect(summary).toMatch(/Flags:\s*\n- None/);
  });

  it("includes the disclaimer footer", () => {
    const r = calculateLevelingResult("ic", balancedIcScores);
    const summary = buildSummaryText(r);
    expect(summary).toMatch(/directional job level recommendation/);
    expect(summary).toMatch(/Radford, Mercer, WTW/);
  });
});
