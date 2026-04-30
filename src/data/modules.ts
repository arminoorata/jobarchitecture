export type WidgetId =
  | "ArchitectureLadder"
  | "AnchorRolePicker"
  | "DimensionTryOut"
  | "TrackComparator"
  | "TitleVsLevelInsight"
  | "CalibrationCompare"
  | "RangeOverlapVisualizer";

export type Block =
  | { type: "paragraph"; text: string }
  | {
      type: "callout";
      severity: "info" | "amber" | "red" | "green";
      title?: string;
      body: string;
      notAdvice?: boolean;
    }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "worked-example"; title: string; lines: string[]; footnote?: string }
  | { type: "widget"; widgetId: WidgetId; props?: Record<string, unknown> }
  | { type: "quiz"; quizId: string }
  | { type: "questions"; title: string; items: string[] };

export type ModuleSection = {
  id: string;
  heading: string;
  blocks: Block[];
};

export type LearnModule = {
  id: string;
  title: string;
  icon: string;
  minutes: number;
  audience: string;
  blurb: string;
  sections: ModuleSection[];
  lastReviewed: string;
  questions: string[];
};

const architectureModule: LearnModule = {
  id: "architecture",
  title: "Job Architecture 101",
  icon: "🧱",
  minutes: 8,
  audience: "New and experienced people leaders",
  blurb:
    "A working model for how roles fit together before pay, titles, or promotions enter the conversation.",
  lastReviewed: "2026-04",
  questions: [
    "Can I describe this role without naming the person currently in it?",
    "Could another HRBP run my logic and reach the same answer?",
    "Where does my company's job architecture live, and who owns it?",
    "When was the last time we cleaned up a job family or sunset a stale level?",
  ],
  sections: [
    {
      id: "start-with-the-work",
      heading: "Start with the work, not the person",
      blocks: [
        {
          type: "paragraph",
          text: "Most of the toughest comp conversations I've sat through started with the person, not the job. The conversation was really about retention, performance, or pay pressure. Each of those matters. They're separate decisions, with separate evidence, and they'll go better if you keep them apart.",
        },
        {
          type: "callout",
          severity: "info",
          title: "What this module gives you",
          body: "A quick mental model for how roles get organized in a company, why that organization matters before any pay or title discussion, and the vocabulary you'll need for the rest of the toolkit.",
        },
        {
          type: "paragraph",
          text: "Job architecture is the system that organizes work. Function, family, career track, level, title, market match. Six layers. Once they're clean, every downstream Total Rewards program (pay ranges, equity bands, promotion criteria, pay equity analysis) gets noticeably easier to defend.",
        },
        {
          type: "worked-example",
          title: "Same person, two different decisions",
          lines: [
            "Sara is a senior product designer. She's done excellent work for two years.",
            "Question 1: Has the job changed? (Same scope, same complexity, same influence pattern.)",
            "Question 2: Has Sara's performance changed? (Yes, she's now setting design standards across two product areas.)",
            "If only the answer to Q1 is yes, this is a leveling decision.",
            "If only the answer to Q2 is yes, this is a performance decision.",
            "If both are yes, you have two decisions to make in sequence, not one.",
          ],
          footnote:
            "Performance, tenure, retention risk, and pay pressure are real. They just aren't the level.",
        },
      ],
    },
    {
      id: "the-six-layers",
      heading: "The six layers",
      blocks: [
        {
          type: "paragraph",
          text: "This toolkit uses a six-part working model inspired by public Aon framing and common survey practice. It holds up across messy private-company structures, big-company multi-country structures, and almost everything in between.",
        },
        {
          type: "widget",
          widgetId: "ArchitectureLadder",
        },
        {
          type: "table",
          caption: "The six layers, top-down",
          headers: ["Layer", "What it answers", "Where it shows up"],
          rows: [
            ["Function", "Which broad area of work?", "Reporting structure, leadership orgs"],
            ["Job family", "Which related group of jobs?", "Career ladders, market match"],
            ["Career track", "How does this role scale value?", "IC vs. manager vs. exec ladders"],
            ["Level", "How big is the job?", "Pay ranges, equity bands, promo criteria"],
            ["Title", "What do we call it externally?", "Business cards, signatures, LinkedIn"],
            ["Market match", "What benchmark applies?", "Survey participation, market pricing"],
          ],
        },
        {
          type: "callout",
          severity: "amber",
          title: "Titles and levels answer different questions",
          body: 'Titles drift. A "Senior Product Manager" at one company is a different size of job than a "Senior Product Manager" three blocks away. The level is what travels.',
        },
      ],
    },
    {
      id: "spine-of-total-rewards",
      heading: "Architecture is the spine of Total Rewards",
      blocks: [
        {
          type: "paragraph",
          text: "When architecture is clean, Total Rewards programs line up. Pay ranges connect to levels. Equity grants follow guidelines. Promotions move people between known bands. Pay equity work groups people into comparable cohorts. None of that is glamorous, all of it is load-bearing.",
        },
        {
          type: "paragraph",
          text: 'When architecture is vague, the same questions keep coming up. Why does this role pay more than that one? Why does this title exist at three different levels? Why doesn\'t our equity guideline match what we just paid the new hire? Every answer that starts with "well, it\'s complicated" is usually an architecture problem in disguise.',
        },
        {
          type: "callout",
          severity: "green",
          title: "What clean architecture buys you",
          body: "1) Faster, more defensible promotion decisions.\n2) Pay ranges that don't have to be argued every time.\n3) Pay equity analysis you can actually act on.\n4) Career conversations that stop being about title and start being about scope.",
        },
      ],
    },
    {
      id: "where-radford-aon-fit",
      heading: "Where Radford and Aon fit",
      blocks: [
        {
          type: "paragraph",
          text: "Aon publishes its job-architecture framing openly. The Radford McLagan Compensation Database uses a consistent architecture for job matching, benchmarking, custom peer groups, and executive regression. (See [src/aon-architecture] and [src/rmcd-features] in the methodology page.) That's why I anchored the toolkit on a public-source mental model rather than picking my own.",
        },
        {
          type: "callout",
          severity: "info",
          body: "This tool teaches the public framing. For the actual job matching, market pricing, peer-group construction, and executive comp regression that big companies need, you'll want licensed Radford or Aon resources. I'm not going to reproduce proprietary level descriptors or survey job content here, and you don't want a free tool pretending to be your survey provider.",
        },
      ],
    },
    {
      id: "quick-check",
      heading: "Quick check",
      blocks: [
        {
          type: "quiz",
          quizId: "architecture-101-evidence",
        },
      ],
    },
  ],
};

const levelingModule: LearnModule = {
  id: "leveling",
  title: "How Leveling Works",
  icon: "📐",
  minutes: 10,
  audience: "Managers preparing a level request or promotion case",
  blurb:
    "The six dimensions that decide whether a role is junior, mid, senior, principal, director, or executive.",
  lastReviewed: "2026-04",
  questions: [
    "Which dimension is doing the heaviest lifting in my case?",
    "Where's the spread? If two scores are far apart, what does that tell me?",
    "What would actually have to change in the job to push it up a level?",
    "Am I describing the job, or am I describing the person?",
  ],
  sections: [
    {
      id: "six-dimensions",
      heading: "The six dimensions, in one minute",
      blocks: [
        {
          type: "paragraph",
          text: "Most leveling models size jobs along the same handful of dimensions. The labels vary a little. The shape doesn't. I picked six because the ones below cover most of the practical ground without becoming a check-the-box exercise.",
        },
        {
          type: "table",
          caption: "The six core dimensions",
          headers: ["Dimension", "Question it answers", "Confused with"],
          rows: [
            ["Scope", "What does the role reliably own?", "Workload, hours, tenure"],
            ["Complexity", "How ambiguous are the problems?", "Volume of tasks"],
            ["Autonomy", "How independently does it operate?", "Lack of supervision"],
            ["Influence", "Whose decisions does it change?", "Likeability, network size"],
            ["Knowledge", "What depth of expertise is required?", "Years of experience"],
            ["Business impact", "How material is the impact?", "Visibility, prestige"],
          ],
        },
        {
          type: "callout",
          severity: "amber",
          title: "Volume and complexity are different signals",
          body: "A role that processes 80 invoices a week is busy. A role that designs the invoice-approval policy across three legal entities is complex. They look the same on a calendar. They're not the same job.",
        },
      ],
    },
    {
      id: "try-one-dimension",
      heading: "Try one dimension",
      blocks: [
        {
          type: "paragraph",
          text: "The dimensions sound abstract until you score one. Pick a real role you know well, then click through Scope.",
        },
        {
          type: "widget",
          widgetId: "DimensionTryOut",
          props: { dimensionId: "scope" },
        },
        {
          type: "callout",
          severity: "info",
          title: "Why score 1-7 instead of 1-5?",
          body: "A 7-point scale is wider than most companies need, but it gives the engine room to detect adjacent boundaries. The wizard maps your scores onto P-, M-, and E-track ranges automatically.",
        },
      ],
    },
    {
      id: "two-roles-side-by-side",
      heading: "Two roles, scored side by side",
      blocks: [
        {
          type: "paragraph",
          text: "Two roles can have the same title and end up at very different levels. The dimensions show why.",
        },
        {
          type: "worked-example",
          title: "Senior Product Manager A vs. Senior Product Manager B",
          lines: [
            "PM A: Scope 4, Complexity 4, Autonomy 4, Influence 3, Knowledge 4, Impact 4.",
            "Core average ≈ 3.83. Maps to P4 Advanced. Confidence: High.",
            "PM B: Scope 5, Complexity 5, Autonomy 5, Influence 5, Knowledge 5, Impact 5.",
            "Core average = 5.00. Maps to P5 Expert. Boundary fires at P5/P6 (the score is within 0.10 of the 4.9 threshold). Confidence: High.",
            "Same title. Different levels. The label was carrying weight the scope didn't earn.",
          ],
          footnote:
            "Math format and band ranges are documented in `leveling-engine-reference.md`.",
        },
        {
          type: "widget",
          widgetId: "TrackComparator",
          props: { mode: "score-pattern" },
        },
      ],
    },
    {
      id: "manager-and-exec-add-a-dimension",
      heading: "Manager and executive add a seventh dimension",
      blocks: [
        {
          type: "paragraph",
          text: "Manager-track roles add people leadership at 20% weight. Executive-track roles add strategy ownership at 30% weight. The math is in the engine reference. The takeaway: if the role doesn't have meaningful people leadership or strategy ownership, picking that track is going to fight your scores.",
        },
        {
          type: "callout",
          severity: "red",
          title: "Picking the wrong track",
          body: "An executive selection with strategy ownership at 1-3 will trigger a sanity flag. The result still comes back, but the flag is telling you something real: this might be a senior management role wearing an executive title.",
        },
      ],
    },
    {
      id: "what-the-engine-shows",
      heading: "What the engine actually shows you",
      blocks: [
        {
          type: "paragraph",
          text: "When the wizard finishes, you'll see a recommended level, a confidence rating, a possible boundary, and any sanity flags. Read all four. The level by itself is the smallest part of what the tool produces.",
        },
        {
          type: "table",
          caption: "Reading a leveling result",
          headers: ["Field", "What it tells you"],
          rows: [
            ["Level + name", "Where the math landed (e.g., P4 Advanced)"],
            ["Weighted score", "The number behind the level"],
            ["Confidence", "How tightly the dimensions agree"],
            ["Boundary", "Whether the role is sitting near an adjacent level"],
            ["Move-up / Move-down", "Which dimensions would shift the level"],
            ["Flags", "Inconsistencies worth a second look"],
            ["Calibration prompt", "A question to take into the calibration session"],
          ],
        },
      ],
    },
    {
      id: "quick-check",
      heading: "Quick check",
      blocks: [
        {
          type: "quiz",
          quizId: "leveling-spot-the-dimension",
        },
      ],
    },
  ],
};

const tracksModule: LearnModule = {
  id: "tracks",
  title: "IC, Manager, and Executive Tracks",
  icon: "🪜",
  minutes: 9,
  audience: "Managers designing teams and HRBPs running track conversations",
  blurb:
    "Three ways work scales: through expertise, through teams, and through strategy. Each ladder has its own rules.",
  lastReviewed: "2026-04",
  questions: [
    "Which track does this role's value actually flow through?",
    "If we removed the people-leadership piece, would the work still be a senior role?",
    "Is the executive title earned by strategy ownership or by org size?",
    "What does the dual-ladder look like at my company, and is it real or aspirational?",
  ],
  sections: [
    {
      id: "three-ladders",
      heading: "Three ladders, one architecture",
      blocks: [
        {
          type: "paragraph",
          text: "Companies grow people through three different mechanisms. Some get deeper as experts. Some get broader by leading teams. Some shape direction by owning strategy. Strong architectures let all three coexist without forcing one into the other's shape.",
        },
        {
          type: "widget",
          widgetId: "TrackComparator",
          props: { mode: "role-shape" },
        },
        {
          type: "table",
          caption: "What scales across the three tracks",
          headers: ["Track", "How value scales", "Typical accountability shift"],
          rows: [
            ["IC", "Expertise, problem-solving, domain influence", "Wider technical or functional ownership"],
            ["Manager", "People systems, coaching, team outcomes", "Larger team, more managers, broader operating area"],
            ["Executive", "Strategy, resource allocation, risk choices", "More of the business under one set of decisions"],
          ],
        },
      ],
    },
    {
      id: "ic-roles",
      heading: "IC roles done right",
      blocks: [
        {
          type: "paragraph",
          text: 'A common architecture failure I\'ve seen: companies that say they have a dual ladder but only promote people who manage. The deep experts plateau, get bored, and leave. Then someone realizes the "principal architect" title that was meant to keep them is empty.',
        },
        {
          type: "callout",
          severity: "amber",
          title: "If management is the only way up",
          body: "A real dual ladder shows up in promotion decisions, not just in title inventory. Audit the actual promotions in the last two years if you want to know which ladder is real.",
        },
        {
          type: "paragraph",
          text: "IC roles scale by widening the kind of problems they own. A P3 solves problems within a known domain. A P5 sets standards across a domain. A P7 is recognized outside the company for rare expertise. The seniority comes from breadth and influence, not seat time.",
        },
      ],
    },
    {
      id: "lead-vs-manager",
      heading: "Manager: the lead-vs-manager line",
      blocks: [
        {
          type: "paragraph",
          text: '"Team lead" and "manager" sound similar in everyday talk. They aren\'t. A team lead coordinates work and may give technical direction, but doesn\'t own people outcomes. A manager owns hiring input, coaching, performance routines, and the team operating system.',
        },
        {
          type: "callout",
          severity: "green",
          title: "Quick test",
          body: 'Does the role own the final people outcomes (performance, coaching, staffing, team health)? If yes, it\'s manager track. If "sort of, with the actual manager," it\'s lead.',
        },
      ],
    },
    {
      id: "senior-mgr-vs-exec",
      heading: "Executive: the senior-manager-vs-exec line",
      blocks: [
        {
          type: "paragraph",
          text: "This one trips people up the most. A senior director with 80 reports is impressive. A VP with 12 reports might still be the more senior role. Org size is real, and so is operating scale. They aren't the same as strategy ownership.",
        },
        {
          type: "paragraph",
          text: "Executive roles shape direction durably. They make portfolio choices, allocate resources across competing bets, and own risk that the function couldn't carry alone. If the role is mostly executing strategy that's been set above, that's senior management work, regardless of how the title reads.",
        },
        {
          type: "callout",
          severity: "red",
          title: "Title inflation watchpoint",
          body: 'Promoting from senior director to VP without a strategy-ownership change tends to bend the architecture. The next person who joins at "VP" expects the same scope. Then everyone above them needs a new title. (See module 5 on pay transparency for what this looks like once ranges go public.)',
        },
        {
          type: "widget",
          widgetId: "TitleVsLevelInsight",
        },
      ],
    },
    {
      id: "same-person-two-tracks",
      heading: "Same person, two tracks",
      blocks: [
        {
          type: "worked-example",
          title: "Mariam: P5 IC or M4 Manager?",
          lines: [
            "She's been a senior engineer for three years. The team needs a new manager.",
            "Path A: stay IC. P5 Expert. Standards-setter for the platform team. Mentors three engineers informally. Influences architecture decisions across the org.",
            "Path B: manager. M4 Senior Manager. Owns a team of 6, hires, runs the operating rhythm. Less individual code, more team outcomes.",
            "Both can be the same level of seniority. They're just different jobs. Pretending Path B is the only promotion punishes Mariam if her best work is in Path A.",
          ],
          footnote:
            "P5 and M4 may sit in similar pay-range neighborhoods when a company has intentionally mapped those levels as equivalent. Don't assume that without checking your own structure.",
        },
      ],
    },
    {
      id: "quick-check",
      heading: "Quick check",
      blocks: [
        {
          type: "quiz",
          quizId: "tracks-classify",
        },
      ],
    },
  ],
};

const calibrationModule: LearnModule = {
  id: "calibration",
  title: "Calibration",
  icon: "⚖️",
  minutes: 11,
  audience: "HRBPs and Total Rewards leaders running calibration sessions",
  blurb:
    "How to keep leveling consistent across teams, especially in the messy boundary cases that reveal what your company actually values.",
  lastReviewed: "2026-04",
  questions: [
    "What does our calibration process actually decide, and what does it just rubber-stamp?",
    "Are we comparing roles or comparing people?",
    "When was the last time we reversed a level decision because the calibration evidence didn't hold up?",
    "Where do exceptions go, and who reviews them?",
  ],
  sections: [
    {
      id: "shared-standard",
      heading: "Calibration builds a shared standard",
      blocks: [
        {
          type: "paragraph",
          text: "The best calibration sessions don't end with a tally. They end with a stronger shared mental model. The point of comparing roles is to make sure that next quarter's leveling questions get the same answer that this quarter's did.",
        },
        {
          type: "callout",
          severity: "amber",
          title: "What calibration is not",
          body: "1) A negotiation. Loudest manager doesn't win.\n2) A performance review. Performance and level are separate.\n3) A pay decision. Pay follows level. Don't reverse the order.\n4) A retention save. Retention is a different conversation, with different tools.",
        },
      ],
    },
    {
      id: "bring-two-roles",
      heading: "Bring two roles",
      blocks: [
        {
          type: "paragraph",
          text: "The single most useful calibration habit I've watched work: every manager who brings a role brings two more roles for context. One clearly below the proposed level, one clearly above. The conversation stops being about defending an answer and starts being about placing the role on a real ladder.",
        },
        {
          type: "widget",
          widgetId: "CalibrationCompare",
        },
        {
          type: "callout",
          severity: "green",
          title: "What good looks like in the room",
          body: 'Manager: "I think this is M4. Here\'s an M3 in a similar family that we set last quarter. Here\'s an M5 we set the year before. This role\'s scope and people-system ownership sit between them, closer to M4."',
        },
      ],
    },
    {
      id: "boundary-cases",
      heading: "Boundary cases reveal philosophy",
      blocks: [
        {
          type: "paragraph",
          text: "Borderline roles are the ones where your company's actual values show up. A role that's defensibly P4 or P5 forces a real conversation about how much weight you give influence versus complexity. The decision matters less than the rationale you record.",
        },
        {
          type: "paragraph",
          text: "I've kept the calibration write-ups from old projects on the way managers reasoned about boundary cases. Those notes are more useful than the levels themselves, because they tell future-me how this company tends to think.",
        },
        {
          type: "callout",
          severity: "info",
          title: "Document the why, not just the what",
          body: '"We placed this at P4" tells nobody anything. "We placed this at P4 because the role\'s influence is across a single product area and complexity is high but scoped" gives the next decision a precedent.',
        },
      ],
    },
    {
      id: "govern-exceptions",
      heading: "Govern exceptions",
      blocks: [
        {
          type: "paragraph",
          text: "Exceptions happen. Someone gets hired into a role at a level the architecture doesn't quite support, because the market is hot, or the team needs the hire fast, or there's a strategic moment. Hidden exceptions become precedent. Named exceptions stay manageable.",
        },
        {
          type: "table",
          caption: "Exception hygiene",
          headers: ["Field", "What to capture"],
          rows: [
            ["Role", "Function, family, current level, intended level"],
            ["Reason", "Hot market / strategic hire / interim / individual stretch"],
            ["Boundary expected", "Date or condition by which the gap should resolve"],
            ["Reviewer", "Who owns the next checkpoint"],
          ],
        },
        {
          type: "callout",
          severity: "amber",
          body: "Three exceptions in the same job family is no longer an exception. It's a sign the level needs revisiting.",
        },
      ],
    },
    {
      id: "worked-walk-through",
      heading: "Worked walk-through",
      blocks: [
        {
          type: "worked-example",
          title: "Calibration of an HRBP role",
          lines: [
            "The case: an HRBP supporting a 200-person business unit, advising the leadership team, owning talent reviews and engagement.",
            "Manager's ask: P5.",
            "Reference roles brought to the room: a P4 HRBP supporting a 90-person unit, a P5 HRBP supporting a 350-person unit with cross-region scope.",
            "The conversation: scope and influence sit between the two references. Knowledge and complexity look closer to P4.",
            "Decision: P4 with a P4/P5 boundary noted. Re-review in six months if the unit grows past 300.",
            "Documented rationale, not just the level.",
          ],
          footnote:
            "This is also one of the calibration scenarios in the practice lab. See §10.",
        },
      ],
    },
    {
      id: "quick-check",
      heading: "Quick check",
      blocks: [
        {
          type: "quiz",
          quizId: "calibration-evidence-vs-pressure",
        },
      ],
    },
  ],
};

const payTransparencyModule: LearnModule = {
  id: "pay-transparency",
  title: "Pay Transparency Readiness",
  icon: "🪟",
  minutes: 7,
  audience:
    "Senior HR and TR leaders preparing for posted ranges or open compensation",
  blurb:
    "Why clean architecture is the prerequisite for pay transparency that doesn't blow up in your face.",
  lastReviewed: "2026-04",
  questions: [
    "Could our employees explain how someone moves from one level to the next?",
    "Where does our title-to-level ratio drift the most?",
    "Are our pay ranges built on consistent leveling or on historical pay?",
    'What\'s our plan for the inevitable "why do they make more than me" conversation?',
  ],
  sections: [
    {
      id: "transparency-exposes-architecture",
      heading: "Transparency exposes architecture",
      blocks: [
        {
          type: "paragraph",
          text: "Once ranges are posted, every employee turns into a comp analyst. They compare titles, levels, and pay. If two people with the same title are two levels apart in the architecture, the math gets uncomfortable fast. Posted ranges don't cause the problem. They make an existing problem visible.",
        },
        {
          type: "callout",
          severity: "red",
          title: "Don't post ranges before this",
          body: 'A clean title-to-level mapping. If "Senior Engineer" lands at three different levels in your data, that\'s where the credibility break will happen.',
        },
      ],
    },
    {
      id: "pay-equity-needs-clean-groupings",
      heading: "Pay equity needs clean groupings",
      blocks: [
        {
          type: "paragraph",
          text: "Most pay equity analyses start by defining similarly situated groups, often using job family, level, geography, and other legitimate factors. If those groupings are noisy, the regression catches a lot of false positives, the remediation list grows, and the project takes longer than it should. Architecture cleanup is the cheapest pay equity work you can do.",
        },
        {
          type: "widget",
          widgetId: "RangeOverlapVisualizer",
        },
        {
          type: "paragraph",
          text: "I'd rather have an organization with five levels and clear differentiation than fifteen levels that all blur together. Density of levels signals nothing if employees can't tell them apart.",
        },
      ],
    },
    {
      id: "maintenance-is-the-system",
      heading: "Maintenance is the system",
      blocks: [
        {
          type: "paragraph",
          text: "New roles emerge. Markets shift. Acquisitions bring different architectures into the same company. A job architecture you never maintain becomes an artifact of when it was built. Bake in a quarterly cadence for new roles, exception reviews, and family additions, even if it's a 30-minute checkpoint.",
        },
        {
          type: "table",
          caption: "What to look at each quarter",
          headers: ["Topic", "Question"],
          rows: [
            ["New roles", "Were any roles created with no architecture mapping?"],
            ["Title exceptions", "Are exceptions resolving or compounding?"],
            ["Boundary cases", "Are the same kinds of cases coming back to calibration?"],
            ["Family changes", "Has any function reorganized in a way the families haven't caught?"],
          ],
        },
      ],
    },
    {
      id: "quick-check",
      heading: "Quick check",
      blocks: [
        {
          type: "quiz",
          quizId: "transparency-title-level-check",
        },
      ],
    },
  ],
};

export const modules: LearnModule[] = [
  architectureModule,
  levelingModule,
  tracksModule,
  calibrationModule,
  payTransparencyModule,
];
