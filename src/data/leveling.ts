export type RoleType = "ic" | "manager" | "executive";

export type DimensionId =
  | "scope"
  | "complexity"
  | "autonomy"
  | "influence"
  | "knowledge"
  | "businessImpact"
  | "peopleLeadership"
  | "strategyOwnership";

export type DimensionOption = {
  score: number;
  label: string;
  description: string;
};

export type Dimension = {
  id: DimensionId;
  title: string;
  shortLabel: string;
  prompt: string;
  /**
   * Short coaching note shown in a collapsible block below the dimension
   * prompt. One sentence that re-anchors what the dimension is actually
   * measuring, in plain language. Optional.
   */
  whatThisMeans?: string;
  /**
   * Short coaching note shown alongside `whatThisMeans`. One sentence on the
   * pattern of misreading this dimension that the wizard wants to head off.
   * Optional.
   */
  commonMistake?: string;
  options: DimensionOption[];
  appliesTo: "all" | "manager" | "executive";
};

const sevenPoint = (
  labels: Array<[string, string]>,
): DimensionOption[] =>
  labels.map(([label, description], index) => ({
    score: index + 1,
    label,
    description,
  }));

export const dimensions: Dimension[] = [
  {
    id: "scope",
    title: "Scope of Impact",
    shortLabel: "Scope",
    appliesTo: "all",
    prompt: "What does the role reliably own?",
    whatThisMeans:
      "Scope is what stops working when the role takes a week off. Score what the role reliably owns end-to-end.",
    commonMistake:
      "Confusing scope with workload. Volume of tasks does not move this score; the dimension measures what the role owns.",
    options: sevenPoint([
      ["Owns assigned tasks", "Delivers defined work with close direction."],
      ["Owns a small workstream", "Manages repeatable tasks or a narrow project area."],
      ["Owns projects", "Delivers complete projects or a meaningful book of work."],
      ["Owns a product, process, or team outcome", "Accountable for an ongoing area with visible business users."],
      ["Owns a function or major domain", "Sets direction for a broad domain or operating area."],
      ["Owns multiple functions or regions", "Connects outcomes across departments, regions, or business lines."],
      ["Owns enterprise-wide outcomes", "Shapes outcomes that matter across the company."],
    ]),
  },
  {
    id: "complexity",
    title: "Problem Complexity",
    shortLabel: "Complexity",
    appliesTo: "all",
    prompt: "How ambiguous are the problems?",
    whatThisMeans:
      "Complexity is how often the role has to invent a new approach. New-pattern work raises this score.",
    commonMistake:
      "Reading 'hard' as complex. The dimension measures ambiguity, so well-defined hard work scores lower.",
    options: sevenPoint([
      ["Clear and repeatable", "Uses established instructions and known answers."],
      ["Mostly known", "Applies existing playbooks with occasional judgment."],
      ["Varied but familiar", "Adapts known approaches to different situations."],
      ["Ambiguous within a domain", "Solves problems where tradeoffs and root causes are not obvious."],
      ["Cross-functional and uncertain", "Balances competing goals across teams or systems."],
      ["Novel or high-risk", "Creates new approaches where precedent is limited."],
      ["Enterprise-defining", "Solves strategic problems with long-term or company-wide consequences."],
    ]),
  },
  {
    id: "autonomy",
    title: "Autonomy",
    shortLabel: "Autonomy",
    appliesTo: "all",
    prompt: "How independently does the role operate?",
    whatThisMeans:
      "Autonomy is the size of the call the role makes before checking in. Bigger calls with looser oversight push the score up.",
    commonMistake:
      "Confusing autonomy with manager absence. The dimension measures the size of the call the role makes alone.",
    options: sevenPoint([
      ["Needs regular direction", "Manager defines priorities, methods, and checkpoints."],
      ["Works with frequent guidance", "Owns tasks but needs help choosing approach."],
      ["Works independently on known work", "Needs guidance for new or sensitive situations."],
      ["Sets approach for a domain", "Translates goals into plans with periodic alignment."],
      ["Sets priorities within broad goals", "Operates with broad direction and handles tradeoffs."],
      ["Defines direction for others", "Creates operating plans and standards for multiple teams."],
      ["Sets enterprise direction", "Shapes goals, choices, and risk posture with limited precedent."],
    ]),
  },
  {
    id: "influence",
    title: "Influence",
    shortLabel: "Influence",
    appliesTo: "all",
    prompt: "Whose decisions does the role change?",
    whatThisMeans:
      "Influence is whose mind the role can change. Score the highest-stakes audience the role moves regularly.",
    commonMistake:
      "Counting meetings attended. The dimension measures decisions that land differently because the role was there.",
    options: sevenPoint([
      ["Immediate team", "Influences day-to-day work with close peers."],
      ["Adjacent partners", "Coordinates with common partners or internal customers."],
      ["Project stakeholders", "Builds alignment across several teams for project outcomes."],
      ["Cross-functional leaders", "Shapes decisions across functions without direct authority."],
      ["Senior leaders in a domain", "Influences investment, standards, or operating choices."],
      ["Business unit or regional leaders", "Aligns leaders across major parts of the business."],
      ["Enterprise, board, or external market", "Influences company direction, external partners, or governance bodies."],
    ]),
  },
  {
    id: "knowledge",
    title: "Knowledge Depth",
    shortLabel: "Knowledge",
    appliesTo: "all",
    prompt: "What depth of expertise does the role require?",
    whatThisMeans:
      "Knowledge depth is what someone has to read or live through to do this role's work cleanly.",
    commonMistake:
      "Counting years of experience. A new hire with the right training can match a five-year veteran here.",
    options: sevenPoint([
      ["Basic job knowledge", "Learns core tools, processes, and terminology."],
      ["Working knowledge", "Applies common methods with guidance."],
      ["Solid professional knowledge", "Handles common situations independently."],
      ["Advanced domain knowledge", "Solves difficult problems and coaches others."],
      ["Deep subject-matter expertise", "Sets standards and is sought out for judgment."],
      ["Recognized functional authority", "Defines practices across a broad domain or company area."],
      ["Market-shaping expertise", "Recognized inside and outside the company for rare expertise."],
    ]),
  },
  {
    id: "businessImpact",
    title: "Business Impact",
    shortLabel: "Impact",
    appliesTo: "all",
    prompt: "How direct and material is the business impact?",
    whatThisMeans:
      "Business impact is the dollar, customer, or risk number the role moves directly. If the metric is two layers away, score lower.",
    commonMistake:
      "Counting strategic importance to the team. The dimension measures impact on the business.",
    options: sevenPoint([
      ["Limited direct impact", "Impact is mainly on individual task quality."],
      ["Team operating impact", "Improves team throughput, quality, or service."],
      ["Project or customer impact", "Affects project delivery, customer experience, or process quality."],
      ["Domain results", "Impacts a product, function, budget, or operating metric."],
      ["Major business outcomes", "Influences revenue, cost, risk, scale, or talent outcomes."],
      ["Multi-function or regional outcomes", "Material impact across major business areas."],
      ["Enterprise value or risk", "Direct impact on company strategy, enterprise risk, or long-term value."],
    ]),
  },
  {
    id: "peopleLeadership",
    title: "People Leadership",
    shortLabel: "Leadership",
    appliesTo: "manager",
    prompt: "What people system does the role own?",
    whatThisMeans:
      "People leadership is whose performance, hiring, and growth the role actually owns end-to-end. Coordinating peers without ownership scores lower.",
    commonMistake:
      "Counting headcount on the org chart. The dimension measures who actually owns hiring, performance routines, and team outcomes.",
    options: sevenPoint([
      ["Coordinates work only", "May guide tasks but does not own people outcomes."],
      ["Leads a small team informally", "Provides daily guidance with limited formal accountability."],
      ["Manages a team", "Owns hiring input, coaching, goals, and performance routines."],
      ["Manages managers or a large team", "Builds team systems and handles resource tradeoffs."],
      ["Leads a function area", "Owns talent strategy, succession, and operating rhythm for a major area."],
      ["Leads multiple functions or regions", "Builds leadership capacity across broad organizations."],
      ["Shapes enterprise leadership system", "Defines executive-level organization, talent, and culture choices."],
    ]),
  },
  {
    id: "strategyOwnership",
    title: "Strategy Ownership",
    shortLabel: "Strategy",
    appliesTo: "executive",
    prompt: "What strategy does the role own?",
    whatThisMeans:
      "Strategy ownership is whose plan the role gets blamed for if it falls apart. Influencing a plan and owning a plan are different jobs.",
    commonMistake:
      "Confusing executive presence with strategy ownership. Speaking in the strategy meeting and signing off on the strategy are different jobs.",
    options: sevenPoint([
      ["Executes strategy", "Turns defined strategy into plans."],
      ["Influences local strategy", "Provides input to a function or market plan."],
      ["Owns a narrow strategy area", "Sets direction for a product, segment, or region area."],
      ["Owns functional strategy", "Defines strategy for a major function or business domain."],
      ["Owns business unit strategy", "Sets strategy across major revenue, region, or portfolio outcomes."],
      ["Owns multi-business strategy", "Connects strategy across regions, functions, or business lines."],
      ["Owns enterprise strategy", "Shapes company direction, portfolio choices, and long-term risk."],
    ]),
  },
];

export const roleTypeOptions: Array<{
  id: RoleType | "unsure";
  title: string;
  body: string;
}> = [
  {
    id: "ic",
    title: "Individual Contributor",
    body:
      "The role creates leverage through expertise, problem-solving, and influence without formal people leadership.",
  },
  {
    id: "manager",
    title: "People Manager",
    body:
      "The role creates leverage through people systems, coaching, staffing, and accountable team outcomes.",
  },
  {
    id: "executive",
    title: "Executive",
    body:
      "The role creates leverage through enterprise, regional, business unit, or functional strategy.",
  },
  {
    id: "unsure",
    title: "Not Sure",
    body:
      "Use a two-question helper to decide whether the role is mostly expertise, management, or strategy.",
  },
];

export const levelNames = {
  P1: "Entry",
  P2: "Developing",
  P3: "Proficient",
  P4: "Advanced",
  P5: "Expert",
  P6: "Principal",
  P7: "Distinguished",
  M2: "Team Lead",
  M3: "Manager",
  M4: "Senior Manager",
  M5: "Director",
  M6: "Senior Director",
  E1: "VP",
  E2: "Regional VP",
  E3: "SVP",
  E4: "EVP",
  E5: "C-Level",
} as const;
