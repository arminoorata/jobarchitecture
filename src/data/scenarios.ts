export type Scenario = {
  id: string;
  title: string;
  family: string;
  track: "IC" | "Manager" | "Executive";
  facts: string[];
  strongestEvidence: string[];
  watchOuts: string[];
  recommendedBand: string;
  calibrationQuestion: string;
};

export const scenarios: Scenario[] = [
  {
    id: "senior-engineer",
    title: "Platform Engineer Leading a Critical Migration",
    family: "Software Engineering",
    track: "IC",
    facts: [
      "Owns migration design for a high-traffic internal platform.",
      "Influences engineering teams that do not report to them.",
      "Solves ambiguous technical problems, but roadmap and budget are set by directors.",
      "Coaches peers and raises engineering standards in one domain.",
    ],
    strongestEvidence: [
      "Advanced complexity",
      "Cross-team influence",
      "Domain-level technical ownership",
    ],
    watchOuts: [
      "Not yet setting multi-domain technology strategy.",
      "Scope is broad within a domain, not enterprise-wide.",
    ],
    recommendedBand: "P4 (boundary P4/P5)",
    calibrationQuestion:
      "Would the next level require influence across multiple platforms or a company-wide technical standard?",
  },
  {
    id: "finance-manager",
    title: "Finance Manager Building the Planning Rhythm",
    family: "FP&A",
    track: "Manager",
    facts: [
      "Manages four analysts and owns quarterly planning cadence.",
      "Partners with department heads on tradeoff decisions.",
      "Improves forecast quality, but CFO owns planning strategy.",
      "Handles performance routines, hiring input, and analyst development.",
    ],
    strongestEvidence: [
      "Formal people leadership",
      "Function process ownership",
      "Cross-functional operating influence",
    ],
    watchOuts: [
      "Scope is one planning process, not the whole finance function.",
      "Strategy ownership is limited.",
    ],
    recommendedBand: "M3 (boundary M3/M4)",
    calibrationQuestion:
      "Is the role managing a team within a process or accountable for a broader finance domain?",
  },
  {
    id: "regional-sales-vp",
    title: "Regional Sales VP Owning a Growth Market",
    family: "Sales Leadership",
    track: "Executive",
    facts: [
      "Owns regional revenue strategy, headcount plan, and channel choices.",
      "Leads directors across several countries.",
      "Balances growth, margin, customer risk, and market entry decisions.",
      "Influences product and marketing priorities for the region.",
    ],
    strongestEvidence: [
      "Regional strategy ownership",
      "Manager-of-managers leadership",
      "Material business impact",
    ],
    watchOuts: [
      "Enterprise portfolio choices still sit above the role.",
      "Scope depends on revenue size and strategic importance of the region.",
    ],
    recommendedBand: "E1 (boundary E1/E2)",
    calibrationQuestion:
      "Is this an executive role because of strategy ownership, or a senior sales management role because of operating scale?",
  },
  {
    id: "hrbp",
    title: "HRBP Supporting a Fast-Growing Business Unit",
    family: "Human Resources",
    track: "IC",
    facts: [
      "Advises leaders on org design, talent reviews, performance, and engagement.",
      "Works independently with a business unit leadership team.",
      "Escalates sensitive employee relations and compensation exceptions.",
      "Influences people decisions, but does not own HR strategy for the enterprise.",
    ],
    strongestEvidence: [
      "Independent advisory work",
      "Senior stakeholder influence",
      "Broad HR domain knowledge",
    ],
    watchOuts: [
      "Impact depends on business unit size and leader population.",
      "Some work may be consultative rather than directly owned.",
    ],
    recommendedBand: "P4",
    calibrationQuestion:
      "Does the role set people strategy for the unit, or mostly execute and advise within defined HR programs?",
  },
];
