export type QuizOption = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type Quiz = {
  id: string;
  question: string;
  options: QuizOption[];
  closing?: string;
};

export const quizzes: Quiz[] = [
  {
    id: "architecture-101-evidence",
    question:
      'A manager says, "She\'s been here four years and is the most reliable person on the team. She deserves the next level." Which of these is the manager mostly describing?',
    options: [
      {
        id: "a",
        label: "Performance and tenure",
        correct: true,
        explanation:
          "Reliability and time-in-role are real. They're inputs to a performance or retention conversation, not a leveling one. The level is about the size of the job.",
      },
      {
        id: "b",
        label: "Scope and complexity",
        correct: false,
        explanation:
          "Neither was mentioned. The case never described what the role actually owns or how ambiguous the work is.",
      },
      {
        id: "c",
        label: "Influence and impact",
        correct: false,
        explanation:
          "Possibly true, but the manager hasn't shown evidence of it. Without that evidence, you're guessing.",
      },
      {
        id: "d",
        label: "All of the above",
        correct: false,
        explanation:
          "Tempting, but bundling these together is exactly what causes the leveling/performance confusion this module is about.",
      },
    ],
    closing:
      "Performance, tenure, and reliability are valuable signals. They feed a different decision than leveling.",
  },
  {
    id: "leveling-spot-the-dimension",
    question:
      'Which dimension does this evidence most strongly support? "This role coordinates with three engineering directors who don\'t report to it, builds alignment across their teams on technical standards, and gets cited as the tiebreaker when those teams disagree."',
    options: [
      {
        id: "a",
        label: "Scope",
        correct: false,
        explanation:
          "Scope is implied, but the leading signal is who the role is moving and how.",
      },
      {
        id: "b",
        label: "Influence",
        correct: true,
        explanation:
          "Coordinating with directors who don't report to the role, building alignment, and being the tiebreaker is influence. It's what separates senior IC roles from simply experienced ones.",
      },
      {
        id: "c",
        label: "Complexity",
        correct: false,
        explanation:
          "Standards and tiebreakers can involve complex tradeoffs, but the evidence here emphasizes who is being aligned, not how ambiguous the problem is.",
      },
      {
        id: "d",
        label: "Knowledge",
        correct: false,
        explanation: "Knowledge depth is implied but not the leading signal.",
      },
    ],
    closing:
      "Most evidence touches multiple dimensions. The skill is naming the strongest one.",
  },
  {
    id: "tracks-classify",
    question:
      "A senior director runs a 60-person operations function. They make day-to-day staffing and budget calls. The functional strategy is set by the COO each year. Which track does this role most clearly belong to?",
    options: [
      {
        id: "a",
        label: "IC",
        correct: false,
        explanation: "Sixty reports rules out IC, even at high seniority.",
      },
      {
        id: "b",
        label: "Manager",
        correct: true,
        explanation:
          "Manager track. Significant org size, real operating accountability, but strategy is owned above. That's senior management.",
      },
      {
        id: "c",
        label: "Executive",
        correct: false,
        explanation:
          "An executive track classification would need evidence that the role owns operations strategy, not just operating execution.",
      },
      {
        id: "d",
        label: "Could be either Manager or Executive",
        correct: false,
        explanation:
          "It could become executive if the role started owning the operations strategy. Today, on the evidence given, it's manager track.",
      },
    ],
    closing:
      "Org size signals operating scale. Strategy ownership signals track.",
  },
  {
    id: "calibration-evidence-vs-pressure",
    question:
      "Which of these is calibration evidence (versus pay pressure or a retention concern)?",
    options: [
      {
        id: "a",
        label: '"She just turned down a competing offer at a higher level."',
        correct: false,
        explanation:
          "That's a retention conversation. Real, but separate.",
      },
      {
        id: "b",
        label:
          '"He\'s been at the level for three years and the team expects he\'ll get promoted."',
        correct: false,
        explanation:
          "That's tenure and expectation, not evidence about job size.",
      },
      {
        id: "c",
        label:
          '"Her role now influences engineering decisions in two adjacent product areas, and she sets the standards for our internal tooling."',
        correct: true,
        explanation:
          "Scope and influence both expanded. That's leveling evidence.",
      },
      {
        id: "d",
        label: '"Their pay sits in the bottom third of the range."',
        correct: false,
        explanation:
          "That's pay pressure. Pay sits low for many reasons (offer history, geography, internal equity gaps). Reaching for a level change to fix it bends the architecture.",
      },
    ],
    closing:
      "When in doubt, ask: did the job change, or did the situation around the job change?",
  },
  {
    id: "transparency-title-level-check",
    question:
      'You audit your company\'s "Senior Engineer" title. You find people at P3, P4, and P5 carrying the same title. What\'s the right first move?',
    options: [
      {
        id: "a",
        label: "Re-title everyone consistently right now.",
        correct: false,
        explanation:
          "Mass re-titling without explanation is a bigger transparency mistake than the inconsistency itself. Communicate before you label.",
      },
      {
        id: "b",
        label:
          'Decide which level "Senior Engineer" should map to going forward and stop using it for the others.',
        correct: true,
        explanation:
          "Lock the title to one level. Re-title the off-pattern roles into accurate titles. Communicate the change with rationale before any range posting.",
      },
      {
        id: "c",
        label: "Leave it alone. Titles drift everywhere.",
        correct: false,
        explanation:
          "Leaving it makes the title meaningless. Once ranges are posted, employees will notice.",
      },
      {
        id: "d",
        label:
          "Add a sub-title qualifier (Senior Engineer I, II, III) to differentiate.",
        correct: false,
        explanation:
          "This works only if the qualifiers map to real, governed levels with clear differentiation. Adding labels without level governance just makes the inconsistency more visible.",
      },
    ],
    closing:
      "Title consistency is a transparency prerequisite, not a transparency outcome.",
  },
];
