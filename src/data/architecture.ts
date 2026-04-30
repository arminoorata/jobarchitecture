export type EducationModule = {
  id: string;
  title: string;
  minutes: number;
  audience: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
    managerMove: string;
  }>;
  checks: string[];
};

export type ArchitectureLayer = {
  label: string;
  example: string;
  explanation: string;
  managerQuestion: string;
};

export type GlossaryTerm = {
  term: string;
  plain: string;
  useWhen: string;
};

export type SourceNote = {
  label: string;
  href: string;
  note: string;
};

export const architectureLayers: ArchitectureLayer[] = [
  {
    label: "Function",
    example: "Engineering, Finance, Sales, People",
    explanation:
      "The broad area of work. Functions help leaders see how work clusters across the enterprise.",
    managerQuestion:
      "Which business capability does this role primarily strengthen?",
  },
  {
    label: "Job family",
    example: "Software Engineering, FP&A, Account Management",
    explanation:
      "A group of related jobs that use similar skills and career paths. Families keep job matching and career movement clean.",
    managerQuestion:
      "What work would this role benchmark against in the market?",
  },
  {
    label: "Career track",
    example: "Individual contributor, people manager, executive",
    explanation:
      "The path by which work increases in value. Strong architectures let experts grow without forcing them into management.",
    managerQuestion:
      "Does the role create leverage through expertise, people leadership, or enterprise strategy?",
  },
  {
    label: "Level",
    example: "P4 Advanced, M4 Senior Manager, E2 Regional VP",
    explanation:
      "The relative size of the role based on scope, complexity, autonomy, influence, knowledge, and impact.",
    managerQuestion:
      "What is the size of the job, independent of the current employee?",
  },
  {
    label: "Title",
    example: "Senior Software Engineer, Director of Finance",
    explanation:
      "The business-facing label. Titles should be consistent, but they should not be the primary evidence for level.",
    managerQuestion:
      "Would this title mean the same thing in a different business unit?",
  },
  {
    label: "Market match",
    example: "Radford McLagan survey job and level match",
    explanation:
      "The external comparison point used for market pricing. This is where licensed survey tools are strongest.",
    managerQuestion:
      "Which external survey role is closest in work, level, and talent market?",
  },
];

export const educationModules: EducationModule[] = [
  {
    id: "architecture",
    title: "Job Architecture 101",
    minutes: 8,
    audience: "New and experienced people leaders",
    summary:
      "A practical model for organizing work before debating pay, titles, or promotions.",
    sections: [
      {
        heading: "Start with the work, not the person",
        body:
          "Job architecture is the system that organizes roles by function, family, career track, level, and title. The cleanest conversations separate the job from the person in the job. Performance, potential, tenure, and retention risk matter, but they are different decisions.",
        managerMove:
          "Describe the job as if you were backfilling it tomorrow. Then level that job description.",
      },
      {
        heading: "Architecture is the spine of Total Rewards",
        body:
          "Leveling feeds salary structures, equity guidelines, bonus eligibility, pay equity analytics, workforce planning, and career paths. When architecture is vague, every downstream reward program becomes harder to explain.",
        managerMove:
          "Before requesting a title or pay change, identify which architecture element actually changed.",
      },
      {
        heading: "Radford/Aon is a strong market reference point",
        body:
          "Aon publicly describes job architecture around functions, job families, jobs, career levels, titles, and market data. Their Radford McLagan Compensation Database is built for compensation benchmarking across jobs, countries, industries, and peer groups. This tool uses that public mental model as an example and points users toward licensed Radford/Aon resources for production benchmarking.",
        managerMove:
          "Use this tool for education and directional sizing. Use licensed survey data and internal calibration for formal pay decisions.",
      },
    ],
    checks: [
      "Can you state the role's function and family in one sentence?",
      "Can you explain the level without mentioning the incumbent's tenure?",
      "Can another HRBP apply the same logic and reach a similar answer?",
    ],
  },
  {
    id: "leveling",
    title: "How Leveling Works",
    minutes: 10,
    audience: "Managers making role or promotion requests",
    summary:
      "The six dimensions that usually decide whether a role is junior, mid, senior, principal, director, or executive.",
    sections: [
      {
        heading: "Scope is the first anchor",
        body:
          "Scope asks what the role owns. A task, a project, a product area, a function, a region, or the enterprise. Managers often over-index on difficulty while under-describing scope.",
        managerMove:
          "Write the largest recurring outcome the role owns without help from the manager.",
      },
      {
        heading: "Complexity is about ambiguity",
        body:
          "Complexity is not workload volume. It is the level of ambiguity, tradeoffs, risk, and systems thinking required to reach a sound answer.",
        managerMove:
          "Ask whether the role follows known playbooks, adapts playbooks, or creates new ones.",
      },
      {
        heading: "Influence separates senior from simply experienced",
        body:
          "Higher-level roles move work through others. They create alignment, change priorities, set standards, or influence leaders who do not report to them.",
        managerMove:
          "Name the stakeholders whose decisions change because this role exists.",
      },
    ],
    checks: [
      "Is the evidence about job size rather than performance?",
      "Did you consider scope, complexity, autonomy, influence, knowledge, and business impact?",
      "Would a lower-level role reasonably struggle with this work even with coaching?",
    ],
  },
  {
    id: "tracks",
    title: "IC, Manager, and Executive Tracks",
    minutes: 9,
    audience: "Managers designing teams",
    summary:
      "How expert, people-leadership, and enterprise-strategy roles create different kinds of leverage.",
    sections: [
      {
        heading: "IC roles scale through expertise",
        body:
          "Individual contributors grow by solving broader or more ambiguous problems, setting technical or functional standards, and influencing work beyond their own deliverables.",
        managerMove:
          "Do not use people management as the only route to growth for deep experts.",
      },
      {
        heading: "Manager roles scale through teams",
        body:
          "People leadership adds accountability for hiring, coaching, performance, resource allocation, and operating rhythm. A lead who coordinates work is different from a manager accountable for the team system.",
        managerMove:
          "Clarify whether the role owns people outcomes or only project coordination.",
      },
      {
        heading: "Executive roles scale through strategy",
        body:
          "Executive roles shape direction across functions, regions, business units, or the enterprise. They operate through strategy, resource choices, risk management, and external or board-level influence.",
        managerMove:
          "Look for durable ownership of strategy, not just attendance in senior forums.",
      },
    ],
    checks: [
      "Does the role's leverage come from expertise, people systems, or enterprise direction?",
      "Is the requested track consistent with how the role actually spends time?",
      "Would the level still fit if the incumbent left?",
    ],
  },
  {
    id: "calibration",
    title: "Calibration",
    minutes: 11,
    audience: "HRBPs and Total Rewards leaders",
    summary:
      "A facilitation model for making leveling decisions consistent across teams and business units.",
    sections: [
      {
        heading: "Calibration is a conversation, not a vote",
        body:
          "The best calibration sessions compare evidence across similar roles. The goal is not to win the highest level. It is to make the architecture durable enough that leaders can explain decisions consistently.",
        managerMove:
          "Bring two peer roles: one that is clearly lower and one that is clearly higher.",
      },
      {
        heading: "Use boundary cases deliberately",
        body:
          "Borderline roles are valuable because they reveal how your company interprets scope and impact. Document why a role landed on one side of the boundary.",
        managerMove:
          "Ask what must change in the job for the next level to become obvious.",
      },
      {
        heading: "Govern exceptions",
        body:
          "Exceptions happen, especially in fast-moving businesses. What matters is whether they are named, time-bound, and reviewed. Hidden exceptions become precedent.",
        managerMove:
          "Label exceptions as exceptions and give them a review date.",
      },
    ],
    checks: [
      "Did the group compare jobs of similar family and track?",
      "Did anyone confuse pay pressure with job size?",
      "Did you capture the decision rationale in plain language?",
    ],
  },
  {
    id: "pay-transparency",
    title: "Pay Transparency Readiness",
    minutes: 7,
    audience: "Senior HR and business leaders",
    summary:
      "Why clean job architecture makes pay ranges, progression, and employee communication easier to defend.",
    sections: [
      {
        heading: "Transparency exposes messy architecture",
        body:
          "When ranges are posted or shared, employees compare titles, levels, and pay. If titles are inflated or levels are inconsistent, trust erodes fast.",
        managerMove:
          "Review title-level consistency before broad pay range communication.",
      },
      {
        heading: "Architecture supports pay equity analysis",
        body:
          "Pay equity analytics depend on grouping comparable work. If job families and levels are inconsistent, the analysis becomes noisier and harder to act on.",
        managerMove:
          "Use architecture cleanup as a prerequisite to pay equity remediation planning.",
      },
      {
        heading: "Maintenance is part of the system",
        body:
          "Roles change, markets move, skills emerge, and businesses reorganize. A job architecture that is never maintained becomes a historical artifact.",
        managerMove:
          "Set a lightweight quarterly process for new roles, title exceptions, and level boundary questions.",
      },
    ],
    checks: [
      "Can managers explain what differentiates adjacent levels?",
      "Can employees see a credible path from one level to the next?",
      "Can Total Rewards connect levels to market data and pay ranges?",
    ],
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Job architecture",
    plain:
      "The structure that organizes work into functions, families, tracks, levels, and titles.",
    useWhen:
      "Use it when explaining how roles fit together before discussing pay.",
  },
  {
    term: "Job family",
    plain:
      "A group of jobs that use similar skills and follow related career paths.",
    useWhen:
      "Use it when choosing the right market match or career ladder.",
  },
  {
    term: "Level",
    plain:
      "The size of the job based on scope, complexity, autonomy, influence, knowledge, and impact.",
    useWhen:
      "Use it when deciding whether a role is entry, developing, proficient, advanced, expert, principal, or executive.",
  },
  {
    term: "Career track",
    plain:
      "The path by which work scales: individual contributor, people manager, or executive.",
    useWhen:
      "Use it when deciding whether growth comes through expertise, teams, or enterprise strategy.",
  },
  {
    term: "Benchmark job",
    plain:
      "The external survey role used to compare pay and market practice.",
    useWhen:
      "Use it after the internal job is clearly described and leveled.",
  },
  {
    term: "Calibration",
    plain:
      "A structured discussion that compares similar roles so level decisions are consistent.",
    useWhen:
      "Use it for borderline roles, promotion requests, reorganizations, and new job families.",
  },
  {
    term: "Incumbent",
    plain:
      "The person currently in the job.",
    useWhen:
      "Use it when separating employee performance from job size.",
  },
  {
    term: "Market pricing",
    plain:
      "Using external compensation data to understand pay for comparable jobs.",
    useWhen:
      "Use it after job matching and leveling, not as a substitute for them.",
  },
  {
    term: "Pay equity",
    plain:
      "Analyzing whether people in comparable work are paid fairly after accounting for legitimate factors.",
    useWhen:
      "Use it when connecting architecture to fairness, compliance, and trust.",
  },
  {
    term: "JobLink",
    plain:
      "Aon's proprietary job evaluation methodology, referenced here only as a licensed Aon offering.",
    useWhen:
      "Use it when pointing leaders toward Aon for formal methodology and consulting support.",
  },
];

export const sourceNotes: SourceNote[] = [
  {
    label: "Aon Job Architecture",
    href: "https://www.aon.com/en/capabilities/talent-and-rewards/job-architecture",
    note:
      "Public Aon material frames job architecture around functions, families, jobs, career levels, and titles, and connects it to compensation, career frameworks, pay equity, and pay transparency.",
  },
  {
    label: "Radford McLagan Compensation Database reporting features",
    href: "https://www.aon.com/en/capabilities/human-capital-analytics/radford-mclagan-compensation-database/reporting-features",
    note:
      "Aon describes the database as a major source of compensation data and tools for benchmarking, peer groups, job matching, employee-vs-market analysis, and executive regression.",
  },
  {
    label: "Radford McLagan Job Offers Data",
    href: "https://www.aon.com/en/capabilities/human-capital-analytics/radford-mclagan-compensation-database/job-offers-data",
    note:
      "Aon states that Job Offers Data and RMCD data use a consistent job architecture and leveling structure for apples-to-apples comparisons.",
  },
  {
    label: "Aon Compensation 101",
    href: "https://rewards.aon.com/en-us/insights/compensation-101/how-much-to-pay-rewards-program-design",
    note:
      "Aon explains why job levels, job families, survey participation, and job matching are critical Total Rewards skills.",
  },
];
