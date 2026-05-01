# Job Architecture Toolkit — Build Spec

Live build spec for `jobarchitecture.arminoorata.com`. Drives the next development push and serves as the single source of truth once shipped.

**Companion docs:**
- [`leveling-engine-reference.md`](./leveling-engine-reference.md) — code-truth math, dimensions, level codes, scoring formulas, output format. **All scoring math defers to this file.**
- [`/srv/projects/SIBLING_TOOL_PATTERN.md`](../SIBLING_TOOL_PATTERN.md) — sibling-tool visual + behavior pattern for `*.arminoorata.com` subdomains.
- [`/srv/.claude/writing_rules.md`](../../.claude/writing_rules.md) — voice rules every line of user-facing copy must pass.

**Tool one-liner:** A free public web tool that teaches HRBPs, managers, and Total Rewards leaders how job architecture works, runs a 3-minute directional leveling wizard, and gives calibration scenario practice. Education first, scoring second.

---

## 0. Purpose, posture, audience

### 0.1 Why this exists

Most leveling conversations break in the same place. Someone asks "should this person be promoted?" before anyone has agreed on what the job actually is. Performance gets confused with scope. Tenure gets confused with impact. Pay pressure gets confused with size. The result is title inflation, broken pay ranges, and pay equity work that's harder than it needs to be.

This tool is the conversation-starter that should happen before any of that. It teaches the architecture, it sizes the job (not the person), and it produces a directional answer in three minutes.

### 0.2 Audience (in priority order)

1. **HRBPs and Total Rewards partners** — running calibration sessions, advising managers, fielding promotion requests.
2. **People managers** — preparing leveling intake, defending or revising a level request, building team structure.
3. **Senior HR and TR leaders** — using it as an educational asset for management training, pay transparency rollouts, or pre-IPO architecture cleanup.

Secondary: comp consultants, founders, and ops leaders without dedicated TR support.

### 0.3 What it does

- Teaches the six layers of job architecture (function, family, track, level, title, market match).
- Explains what each leveling dimension actually means, with worked examples.
- Runs a directional 3-minute leveling wizard with explanation, confidence, boundary detection, and sanity flags.
- Lets users practice calibration on four realistic boundary scenarios (predict-then-reveal).
- Produces a downloadable text summary they can paste into a calibration deck.

### 0.4 What it explicitly is not

- Not a final pay or compensation decision tool.
- Not a substitute for licensed survey data (Radford McLagan, Mercer, WTW).
- Not a job description generator.
- Not an org-chart visualizer.
- Not an HRIS integration.
- Not a place to enter real employee names or PII.

### 0.5 Radford / Aon positioning

Aon publishes its job-architecture mental model openly. This tool uses that public framing (function → family → job → career level → title → market match) as the positive example, then points users toward licensed Radford/Aon resources for actual job matching, market pricing, peer groups, and governance. The tool **does not reproduce** proprietary Radford, Mercer, or WTW level descriptors, point-factor methods, survey job descriptions, or job codes.

Source attribution rules live in §14.

---

## 1. Voice and copy rules

### 1.1 Voice authority

Every line of user-facing copy passes [`/srv/.claude/writing_rules.md`](../../.claude/writing_rules.md). The full pattern detector lives there. The list below is the quick-reference ban list — if you can't remember the rule, default to deleting the suspect line and re-stating the actual point.

### 1.2 The ban list

- **No em dashes.** Hard rule. Use a comma, a period, or a parenthetical aside.
- **No contrast framing.** Don't write "It's not X, it's Y" or "This isn't about X — it's about Y." State the truth directly.
- **No throat-clearing.** Drop "Here's the thing," "The reality is," "Let me be clear," "At the end of the day."
- **No AI crutches.** Drop "Let's dive deep," "Let's unpack," "In today's evolving landscape," "quietly building."
- **No suspense bait.** Drop "The catch?", "The kicker?", "The brutal truth?", begging-the-question rhetorical setups.
- **No corporate jargon.** Strip "leverage," "utilize," "robust," "synergy," "stakeholders," "pressure-test."
- **No fake parallelism.** Don't list three of everything. Vary to two, four, five.
- **No staccato openers.** "Bold. Brave. Different." → merge into a real sentence.

### 1.3 What to do instead

- First person where it lands naturally ("I built this so HRBPs can...").
- Contractions always. *I'm, don't, can't, won't, it's.*
- Vary sentence length on purpose. Mix five-word punches with twenty-five-word ramblers.
- Parenthetical asides are fine and welcome (one or two per page, structural rather than decorative).
- Concrete words. *Test, check, work out, take apart.* Not "stress-test."
- One actual opinion per long-form section, even if it's mild.
- Direct calls to action. *"Try the wizard."* Not "Feel free to explore."

### 1.4 Calibration example

This is the voice. From Armi's LinkedIn About:

> "I aim to bring serious experience and a light-hearted perspective to every challenge I manage. HR might not always be fancy, but it doesn't mean it can't be fun!"

Match that warmth, that dryness, that confidence-without-puffery. Don't impersonate it. Match it.

### 1.5 When to break voice

The methodology page (§12) and the engine reference are technical reference material. They can read closer to documentation than to LinkedIn. They still avoid the patterns in §1.2, but they don't need contractions or asides.

---

## 2. Visual and interaction system

### 2.1 Sibling pattern compliance (must-follow)

This tool is part of the `*.arminoorata.com` family. The header, footer, palette, typography, theme behavior, and 9-dot nav must match `[/srv/projects/SIBLING_TOOL_PATTERN.md](../SIBLING_TOOL_PATTERN.md)`. Inlining the load-bearing rules below for self-containment.

**Color palette ("Gilt") — defined as CSS custom properties.**

Dark (default):
```
--bg: #090b0f
--bg-alt: #0d1015
--surface: #11151b
--surface-alt: #151a21
--text: #f1ece3
--muted: #b2aba0
--line: rgba(255, 255, 255, 0.08)
--accent: #c4a44a
--accent-strong: #d6b85f
--accent-soft: rgba(196, 164, 74, 0.14)
```

Light:
```
--bg: #f3efe7
--bg-alt: #ede8dd
--surface: #f7f3eb
--surface-alt: #efe9dd
--text: #15181d
--muted: #666056
--line: rgba(21, 24, 29, 0.1)
--accent: #9b7b24
--accent-strong: #b8902f
--accent-soft: rgba(155, 123, 36, 0.14)
```

**Typography.** Outfit (400/500/600/700) for body. JetBrains Mono for numbers, level codes (P4, M3, etc.), score displays. Base 16px, line-height 1.6 body / 1.5 UI.

**Theme.** Dark default. localStorage key `theme`. Bootstrap script in `<head>` to avoid flash. Toggle in header.

**Header.** Sticky, blurred, bottom border `var(--line)`. Eyebrow brand text *"JOB ARCHITECTURE TOOLKIT"* — 12px, 500 weight, 0.32em tracking, uppercase, accent color, links to `/`. Right cluster: 9-dot NavMenu first, ThemeToggle second, 12-14px gap.

**Footer.** Two-column on desktop. Left: "Built by [Armi Noorata](https://arminoorata.com)." plus one-line tagline. Right: domain badge `jobarchitecture.arminoorata.com` (uppercase, 0.24em tracking, muted). Optional bottom strip with disclaimer (see §19) — italic, 11.5px, 0.85 opacity.

**What not to do.** Different accent color (gold only). Hero/headline images. Logos or decorative dots on the brand. Different fonts. Top-of-page disclaimer banner.

### 2.2 Layout

- Main content container: `max-width: 1152px` (Tailwind `max-w-6xl`), horizontal padding 24-40px.
- Reading-narrow container for module bodies: `max-width: 720px` to keep line length comfortable.
- Cards: `var(--surface)` background, `var(--line)` border, 10px radius, subtle shadow.
- Vertical rhythm: 16px / 24px / 48px / 96px scale.

### 2.3 Motion and accessibility baselines

- Respect `prefers-reduced-motion`. Every transition that exceeds 200ms gates on it.
- WCAG AA contrast minimum, including `var(--muted)` against `var(--bg)`.
- Every interactive element keyboard-navigable. Visible focus ring (`outline: 2px solid var(--accent)`).
- Tap targets: 44 × 44px minimum on touch.
- All widgets: `aria-live="polite"` on result regions, descriptive `aria-label` on score buttons, `<fieldset>` + `<legend>` on dimension picker groups.
- Tables degrade to stacked rows below 640px. Each row gets a leading caption that names the comparison axis.
- Charts and visualizations include a text summary equivalent (`<figcaption>` or `aria-describedby`).

### 2.4 Iconography

- No external icon library. Inline SVGs only, sized to the text they sit beside (`1em` square).
- Status colors (only where needed): semantic green / amber / red, dark- and light-mode variants. Don't reuse the brand accent for status.

---

## 3. Information architecture

### 3.1 Routes

| Path | Purpose | Primary components | Data source |
|---|---|---|---|
| `/` | Landing + Architecture Explorer + 3 CTAs + path selector + Radford framing | `ArchitectureExplorer`, `PathSelector`, `ModuleCards`, `RadfordPositioning` | `data/architecture.ts`, `data/learning-paths.ts` (new) |
| `/learn` | Module index + path selector | `PathSelector`, `LearnModuleGrid` | `data/modules.ts` (new — block-typed; replaces current sparse `educationModules`) |
| `/learn/[id]` | Single module page (block-rendered) | `ModuleRenderer`, block components, `Quiz`, widget components | `data/modules.ts` |
| `/leveling` | Directional leveling wizard | `LevelingWizard` (existing, plus result-rendering rules per §9) | `data/leveling.ts`, `lib/leveling.ts` |
| `/calibration` | Predict-then-reveal scenario lab | `CalibrationLab` (existing — needs interactive rebuild per §10) | `data/scenarios.ts` |
| `/glossary` | Term list + usage examples | `GlossaryList`, `GlossaryEntry` | `data/architecture.ts` (`glossaryTerms`, expanded per §11) |
| `/methodology` | Sources, scoring summary, limitations, disclaimer | `MethodologyPage` | `data/architecture.ts` (`sourceNotes`), `leveling-engine-reference.md` excerpts |

### 3.2 Per-route acceptance criteria

#### `/` Home

- **Above the fold:** brand chrome, eyebrow tagline (one line, voice-matched), Architecture Explorer.
- **Primary CTAs:** three cards — Classify a role / Teach the model / Practice calibration. The "Classify" card uses `var(--accent-soft)` background; the others use `var(--surface)`.
- **Path selector** below the CTAs with the question "What brings you here?" — picks reorder the module grid (see §7).
- **Module grid:** five module cards in path-driven order.
- **Radford positioning** card at the bottom.
- **Empty state:** N/A (always renders the same content for first-time visitors).
- **Loading:** N/A — entirely static client-rendered.
- **Mobile:** CTAs stack full-width; Architecture Explorer collapses to vertical accordion.
- **SEO:** title `"Job Architecture Toolkit"`, description per §15.

#### `/learn`

- **Layout:** path selector + module grid.
- **Empty state:** if path is unset, modules render in canonical order.
- **Mobile:** grid → single column.
- **SEO:** title `"Learn · Job Architecture Toolkit"`, description per §15.

#### `/learn/[id]`

- **Layout:** breadcrumb (`Home > Learn > <module>`), title, audience tag, minutes-to-read, blurb, then block-rendered sections, then "Questions to take to your team" closing card, then `lastReviewed` date.
- **Empty state:** if `id` is unknown, render `not-found.tsx`.
- **Mobile:** widgets degrade gracefully (see §13). Tables stack.
- **SEO:** dynamic title `"<module title> · Job Architecture Toolkit"`, description from module `blurb`.

#### `/leveling`

- **Layout:** Step indicator + step body (role pick → dimension cards → review → result → download).
- **Empty state:** step 1 visible on first load.
- **Loading:** N/A; calculation is synchronous and instant.
- **Error states:** if a dimension is unanswered when user clicks "Next," highlight the row and block step advance.
- **Mobile:** dimension options stack as full-width radio cards.
- **SEO:** title `"Leveling Wizard · Job Architecture Toolkit"`.

#### `/calibration`

- **Layout:** scenario selector strip (4 cards) → active scenario → predict step → reveal step → "next scenario" prompt.
- **Empty state:** first scenario expanded by default.
- **Mobile:** scenario picker becomes horizontal scroll-snap.
- **SEO:** title `"Calibration Lab · Job Architecture Toolkit"`.

#### `/glossary`

- **Layout:** searchable term list with anchor links per term.
- **Empty state:** if search returns 0, show "No matches. Try fewer letters." Voice-matched.
- **Mobile:** term cards stack.
- **SEO:** title `"Glossary · Job Architecture Toolkit"`.

#### `/methodology`

- **Layout:** sections for scoring model, confidence, boundary detection, sanity flags, sources, limitations, disclaimer.
- **Mobile:** sections stack with anchor TOC at top.
- **SEO:** title `"Methodology · Job Architecture Toolkit"`.

---

## 4. State handling

### 4.1 Persistence policy

The tool stores **almost nothing**. The only `localStorage` write is the `theme` key for dark/light preference. No user inputs persist. No analytics cookies. No user identifiers.

### 4.2 Wizard state

- In-memory only. Lives in component state (or a tiny `useReducer` if preferable). Never written to storage.
- Refresh the page = lose progress. The wizard's compact 3-minute design makes that acceptable.
- "Reset" button on the result step clears state and returns to step 1.
- Browser-back returns to the previous wizard step (keep step index in URL search param: `?step=2`, `?step=dimension-scope`, etc.). This makes shareable mid-flow URLs unnecessary but accessible-back-button-friendly.

### 4.3 Calibration state

- In-memory only. The "predicted band" the user selects per scenario lives in component state until they navigate away.
- Aggregate session score (e.g., "3 of 4 close calls") shows on the lab page header but does not persist across sessions.

### 4.4 Path selector state

- In-memory only. Picked path lives in `useState`. Refresh resets to canonical module order. Acceptable cost for the privacy posture.

### 4.5 Glossary search

- In-memory only. URL query param `?q=` is OK if it's free.

### 4.6 No analytics

- No `@vercel/analytics`, no `@vercel/speed-insights`, no third-party trackers. Vercel's free request-level analytics is the only allowed signal.

---

## 5. Content and widget data model

This section defines the contract for every educational block, widget, and quiz. Module subsections (§8.1-§8.5) reference these types without redefining them.

### 5.1 Block types

Modules are arrays of typed `Block` objects rendered by a `<ModuleRenderer>` component. The full type:

```ts
type Block =
  | { type: "paragraph"; text: string }
  | { type: "callout"; severity: "info" | "amber" | "red" | "green"; title?: string; body: string; notAdvice?: boolean }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "worked-example"; title: string; lines: string[]; footnote?: string }
  | { type: "widget"; widgetId: WidgetId; props?: Record<string, unknown> }
  | { type: "quiz"; quizId: string }
  | { type: "questions"; title: string; items: string[] };
```

**`paragraph`.** Plain prose. Renders inline glossary tooltips automatically — any term that matches a `GlossaryTerm.term` (case-insensitive) gets a dotted underline + hover/focus reveal.

**`callout`.** Severity colors:
- `info` — accent-soft background, accent border. For framing or context.
- `green` — semantic green. For "do this" guidance.
- `amber` — semantic amber. For watch-outs.
- `red` — semantic red. For hard rules ("don't store PII in this tool").

`notAdvice: true` adds a visible "Educational guidance, not legal/comp advice" footer to the callout. Used for anything that touches pay equity, regulatory, or compliance topics.

**`table`.** Fixed-width on desktop. On mobile (<640px) each row stacks vertically with the column header repeated as a label.

**`worked-example`.** Monospace number column for arithmetic; `lines` is an array because line breaks matter. `footnote` renders smaller and muted.

**`widget`.** Embeds an interactive component by id. Widgets are catalogued in §13. Every widget has a non-interactive fallback for `prefers-reduced-motion: reduce` and for SSR.

**`quiz`.** Single-question multiple-choice with reveal. Quiz definitions live in `data/quizzes.ts`. Format:

```ts
type Quiz = {
  id: string;
  question: string;
  options: Array<{ id: string; label: string; correct: boolean; explanation: string }>;
  closing?: string;
};
```

User picks → reveals correctness on every option → "closing" line summarizes the lesson.

**`questions`.** Closing card: "Take these to your next 1:1 / calibration / leadership review." Renders as a list of italicized prompts.

### 5.2 Module shape

```ts
type LearnModule = {
  id: string;             // URL slug
  title: string;
  icon: string;           // single emoji or SVG id
  minutes: number;        // estimated read time
  audience: string;       // who it's for, one line
  blurb: string;          // 1-2 sentences for the index card
  sections: ModuleSection[];
  lastReviewed: string;   // YYYY-MM, surfaced at the bottom of the page
  questions: string[];    // 3-5 closing-card prompts
};

type ModuleSection = {
  id: string;             // anchor slug
  heading: string;
  blocks: Block[];
};
```

### 5.3 Widget contract

Every widget exports:

- A React component that takes `props` from the block plus a `prefersReducedMotion: boolean` inferred from the parent.
- A static `getFallback(props)` function that returns JSX usable on the server (no animation, no interaction). Used for SSR and reduced-motion users.
- A docstring at the top of the file mapping inputs → outputs in plain English.

Widgets must:

- Work without keyboard alternatives blocked. Every interactive element is `<button>` or `<input>`, never bare `<div onClick>`.
- Announce results in a `role="status" aria-live="polite"` region.
- Render a meaningful state when no input has been provided yet (empty hint, not blank).
- Stay under 200 lines. If a widget needs more, it probably needs to be two widgets.

### 5.4 Source-note attachment

Source-note references appear via inline footnote markers. The `sourceNotes` array in `data/architecture.ts` is the canonical list. A block can reference a source note by adding `(see [src/aon-architecture])` inline; the renderer turns that into a footnote link to `/methodology#sources`.

Rule: any factual claim about Aon, Radford, or the public market frame must reference a source note. Voice-y commentary doesn't.

### 5.5 Glossary linking

The renderer auto-links any prose match against `glossaryTerms[].term`. Manual override: prefix with `\` to skip linking (e.g., `\Level` when "Level" is being used in non-architecture sense). Match is case-insensitive, whole-word, longest match wins.

---

## 6. Architecture Explorer (home)

The Architecture Explorer is the single most important interactive on the site. It teaches the six-layer model in 90 seconds without anyone reading a single paragraph.

### 6.1 Behavior

- Six horizontal "layer" cards stacked vertically: Function → Job family → Career track → Level → Title → Market match.
- An "Anchor role" picker at the top with three sample roles. Picking a role populates each layer's example field with role-specific text.
- Each layer card shows: layer name (eyebrow style), plain-language definition, the populated example for the active anchor role, and a manager calibration question.
- Clicking a layer expands it for a subtle ~6px push and a slight `accent-soft` glow (skipped for reduced-motion users).
- Default state: anchor role picker shows "Pick a sample role to see how the layers connect" placeholder; layers render with generic examples (the current static text).

### 6.2 Anchor roles (sample data)

Three roles to pick between. Each ships a populated value for every layer:

```ts
const anchorRoles = [
  {
    id: "platform-eng",
    title: "Senior Platform Engineer",
    function: "Engineering",
    family: "Software Engineering, Platform",
    track: "Individual contributor",
    level: "P5 Expert",
    titleExample: "Senior Platform Engineer",
    marketMatch: "Radford SWE - Platform / Senior",
  },
  {
    id: "fpa-mgr",
    title: "Senior Manager, FP&A",
    function: "Finance",
    family: "Financial Planning & Analysis",
    track: "People manager",
    level: "M4 Senior Manager",
    titleExample: "Senior Manager, Financial Planning",
    marketMatch: "Radford Finance - FP&A / Senior Manager",
  },
  {
    id: "regional-vp",
    title: "Regional VP, Sales",
    function: "Sales",
    family: "Sales Leadership",
    track: "Executive",
    level: "E2 Regional VP",
    titleExample: "Regional Vice President, Americas",
    marketMatch: "Radford Sales Leadership - Regional VP",
  },
];
```

### 6.3 Drafted user-facing copy

**Eyebrow tagline (rendered above the explorer):**

> The six layers most leveling conversations skip past.

**Layer copy.** Definition + manager question are reused from `data/architecture.ts` (already voice-acceptable). Examples below get **swapped in** when the user picks an anchor role.

| Layer | Definition (kept) | Manager question (kept) |
|---|---|---|
| Function | The broad area of work. Functions help leaders see how work clusters across the enterprise. | Which business capability does this role primarily strengthen? |
| Job family | A group of related jobs that use similar skills and career paths. Families keep job matching and career movement clean. | What work would this role benchmark against in the market? |
| Career track | The path by which work increases in value. Strong architectures let experts grow without forcing them into management. | Does the role create leverage through expertise, people leadership, or enterprise strategy? |
| Level | The relative size of the role based on scope, complexity, autonomy, influence, knowledge, and impact. | What is the size of the job, independent of the current employee? |
| Title | The business-facing label. Titles should be consistent, but they shouldn't be the primary evidence for level. | Would this title mean the same thing in a different business unit? |
| Market match | The external comparison point used for market pricing. This is where licensed survey tools are strongest. | Which external survey role is closest in work, level, and talent market? |

**CTA copy below the explorer (replaces current text):**

| Card | Heading | Body |
|---|---|---|
| Primary | Classify a role | Run the wizard. Three minutes. Six dimensions. A directional answer plus the things worth checking. |
| Secondary | Teach the model | Five short modules for managers, HRBPs, and TR partners. Read one before your next leveling conversation. |
| Secondary | Practice calibration | Four real boundary cases. Predict the level, then see what evidence actually mattered. |

### 6.4 Widget reference

This whole section is rendered by widget `ArchitectureExplorer`. See §13 for the contract.

---

## 7. Path selector

A small interactive that re-orders modules based on the user's **task**, not role. Most managers, HRBPs, and TR partners show up because they have a specific job to do. The selector picks the situation that matches that job and leads with the most useful module first. Defaults are sensible, so picking is optional.

### 7.1 Question

> **What are you here to do?**

### 7.2 Options (situation-based)

| `id` | Label | Blurb | Re-orders modules to lead with |
|---|---|---|---|
| `level-new-role` | Level a new role | Sizing a job that hasn't existed before, or a job that just changed shape. | How Leveling Works → Tracks → Architecture 101 → Calibration → Pay Transparency |
| `prepare-promotion` | Prepare a promotion request | Building the case for an internal promotion before HR reviews it. | How Leveling Works → Calibration → Tracks → Architecture 101 → Pay Transparency |
| `explain-architecture` | Explain job architecture to a manager | Walking a leader through the model before any calibration or pay conversation. | Architecture 101 → Tracks → How Leveling Works → Pay Transparency → Calibration |
| `calibrate-boundary` | Calibrate a boundary case | Working a role that sits between two levels and needs a defensible call. | Calibration → How Leveling Works → Tracks → Architecture 101 → Pay Transparency |
| `clean-up-titles` | Clean up titles or career paths | Tightening a job family before posting ranges or running pay equity work. | Pay Transparency → Architecture 101 → Tracks → How Leveling Works → Calibration |
| `just-looking` | Just looking around | Read the modules in their default order. | (canonical order, no re-ordering) |

### 7.3 Behavior

- Six buttons. On desktop, two or three columns; on mobile, single column.
- Selection state: `accent-soft` background, `var(--accent)` border, bold label.
- Order changes animate via a 200ms opacity replay (CSS keyframe on the grid wrapper, keyed by order signature). Reduced-motion users skip the animation.
- Clear button inline: "Clear selection."

### 7.4 Drafted user-facing copy

Section heading on `/learn` page:

> **Pick a starting point.**
> Modules adapt to who's reading. You can ignore this and read in order if you'd rather.

Re-order callout on the home page (smaller version):

> Pick the role that fits and the module grid will lead with what you'll need first.

---

## 8. Education modules

Five modules, all block-typed per §5.1. Each subsection below contains the full drafted copy in Armi's voice. All copy is user-facing and assumes voice rules in §1 are passed.

**Lifecycle.** Modules ship with `lastReviewed` set at release. Anything that touches market practice, regulatory framing, or proprietary-content guardrails gets a re-review check at least once a year (or sooner if Aon publishes new public material).

### 8.1 Module — Job Architecture 101

**Meta:**

| Field | Value |
|---|---|
| `id` | `architecture` |
| `title` | "Job Architecture 101" |
| `icon` | 🧱 |
| `minutes` | 8 |
| `audience` | "New and experienced people leaders" |
| `blurb` | "A working model for how roles fit together before pay, titles, or promotions enter the conversation." |
| `lastReviewed` | `2026-04` |

**Closing questions (`questions[]`):**

1. Can I describe this role without naming the person currently in it?
2. Could another HRBP run my logic and reach the same answer?
3. Where does my company's job architecture live, and who owns it?
4. When was the last time we cleaned up a job family or sunset a stale level?

**Section 1 — Start with the work, not the person**

- **paragraph:** Most of the toughest comp conversations I've sat through started with the person, not the job. The conversation was really about retention, performance, or pay pressure. Each of those matters. They're separate decisions, with separate evidence, and they'll go better if you keep them apart.
- **callout (info, title: "What this module gives you"):** A quick mental model for how roles get organized in a company, why that organization matters before any pay or title discussion, and the vocabulary you'll need for the rest of the toolkit.
- **paragraph:** Job architecture is the system that organizes work. Function, family, career track, level, title, market match. Six layers. Once they're clean, every downstream Total Rewards program (pay ranges, equity bands, promotion criteria, pay equity analysis) gets noticeably easier to defend.
- **worked-example (title: "Same person, two different decisions"):**
  - Lines:
    - "Sara is a senior product designer. She's done excellent work for two years."
    - "Question 1: Has the job changed? (Same scope, same complexity, same influence pattern.)"
    - "Question 2: Has Sara's performance changed? (Yes, she's now setting design standards across two product areas.)"
    - "If only the answer to Q1 is yes, this is a leveling decision."
    - "If only the answer to Q2 is yes, this is a performance decision."
    - "If both are yes, you have two decisions to make in sequence, not one."
  - Footnote: "Performance, tenure, retention risk, and pay pressure are real. They just aren't the level."

**Section 2 — The six layers**

- **paragraph:** This toolkit uses a six-part working model inspired by public Aon framing and common survey practice. It holds up across messy private-company structures, big-company multi-country structures, and almost everything in between.
- **widget:** `ArchitectureLadder` — clickable visual ladder. Each layer expands to show definition + example + manager question. Default-open state shows all six collapsed; click to expand. Reduced-motion fallback: all six rendered as static stacked cards.
- **table (caption: "The six layers, top-down"):**
  - Headers: ["Layer", "What it answers", "Where it shows up"]
  - Rows:
    - ["Function", "Which broad area of work?", "Reporting structure, leadership orgs"]
    - ["Job family", "Which related group of jobs?", "Career ladders, market match"]
    - ["Career track", "How does this role scale value?", "IC vs. manager vs. exec ladders"]
    - ["Level", "How big is the job?", "Pay ranges, equity bands, promo criteria"]
    - ["Title", "What do we call it externally?", "Business cards, signatures, LinkedIn"]
    - ["Market match", "What benchmark applies?", "Survey participation, market pricing"]
- **callout (amber, title: "Titles and levels answer different questions"):** Titles drift. A "Senior Product Manager" at one company is a different size of job than a "Senior Product Manager" three blocks away. The level is what travels.

**Section 3 — Architecture is the spine of Total Rewards**

- **paragraph:** When architecture is clean, Total Rewards programs line up. Pay ranges connect to levels. Equity grants follow guidelines. Promotions move people between known bands. Pay equity work groups people into comparable cohorts. None of that is glamorous, all of it is load-bearing.
- **paragraph:** When architecture is vague, the same questions keep coming up. Why does this role pay more than that one? Why does this title exist at three different levels? Why doesn't our equity guideline match what we just paid the new hire? Every answer that starts with "well, it's complicated" is usually an architecture problem in disguise.
- **callout (green, title: "What clean architecture buys you"):**
  - Rendered as a list inside the callout body:
  - 1) Faster, more defensible promotion decisions.
  - 2) Pay ranges that don't have to be argued every time.
  - 3) Pay equity analysis you can actually act on.
  - 4) Career conversations that stop being about title and start being about scope.

**Section 4 — Where Radford and Aon fit**

- **paragraph:** Aon publishes its job-architecture framing openly. The Radford McLagan Compensation Database uses a consistent architecture for job matching, benchmarking, custom peer groups, and executive regression. (See [src/aon-architecture] and [src/rmcd-features] in the methodology page.) That's why I anchored the toolkit on a public-source mental model rather than picking my own.
- **callout (info):** This tool teaches the public framing. For the actual job matching, market pricing, peer-group construction, and executive comp regression that big companies need, you'll want licensed Radford or Aon resources. I'm not going to reproduce proprietary level descriptors or survey job content here, and you don't want a free tool pretending to be your survey provider.

**Section 5 — Quick check**

- **quiz:** `architecture-101-evidence`

**Closing card:** auto-renders the four `questions[]` above.

---

### 8.2 Module — How Leveling Works

**Meta:**

| Field | Value |
|---|---|
| `id` | `leveling` |
| `title` | "How Leveling Works" |
| `icon` | 📐 |
| `minutes` | 10 |
| `audience` | "Managers preparing a level request or promotion case" |
| `blurb` | "The six dimensions that decide whether a role is junior, mid, senior, principal, director, or executive." |
| `lastReviewed` | `2026-04` |

**Closing questions:**

1. Which dimension is doing the heaviest lifting in my case?
2. Where's the spread? If two scores are far apart, what does that tell me?
3. What would actually have to change in the job to push it up a level?
4. Am I describing the job, or am I describing the person?

**Section 1 — The six dimensions, in one minute**

- **paragraph:** Most leveling models size jobs along the same handful of dimensions. The labels vary a little. The shape doesn't. I picked six because the ones below cover most of the practical ground without becoming a check-the-box exercise.
- **table (caption: "The six core dimensions"):**
  - Headers: ["Dimension", "Question it answers", "Confused with"]
  - Rows:
    - ["Scope", "What does the role reliably own?", "Workload, hours, tenure"]
    - ["Complexity", "How ambiguous are the problems?", "Volume of tasks"]
    - ["Autonomy", "How independently does it operate?", "Lack of supervision"]
    - ["Influence", "Whose decisions does it change?", "Likeability, network size"]
    - ["Knowledge", "What depth of expertise is required?", "Years of experience"]
    - ["Business impact", "How material is the impact?", "Visibility, prestige"]
- **callout (amber, title: "Volume and complexity are different signals"):** A role that processes 80 invoices a week is busy. A role that designs the invoice-approval policy across three legal entities is complex. They look the same on a calendar. They're not the same job.

**Section 2 — Try one dimension**

- **paragraph:** The dimensions sound abstract until you score one. Pick a real role you know well, then click through Scope.
- **widget:** `DimensionTryOut` — single-dimension picker for `scope`. User picks an option (1-7), the widget shows the option's description plus a one-sentence "what this typically looks like" example. Reduced-motion fallback: static list of all seven options with descriptions, no animation, no selected-state.
- **callout (info, title: "Why score 1-7 instead of 1-5?"):** A 7-point scale is wider than most companies need, but it gives the engine room to detect adjacent boundaries. The wizard maps your scores onto P-, M-, and E-track ranges automatically.

**Section 3 — Two roles, scored side by side**

- **paragraph:** Two roles can have the same title and end up at very different levels. The dimensions show why.
- **worked-example (title: "Senior Product Manager A vs. Senior Product Manager B"):**
  - Lines:
    - "PM A: Scope 4, Complexity 4, Autonomy 4, Influence 3, Knowledge 4, Impact 4."
    - "Core average ≈ 3.83. Maps to P4 Advanced. Confidence: High."
    - "PM B: Scope 5, Complexity 5, Autonomy 5, Influence 5, Knowledge 5, Impact 5."
    - "Core average = 5.00. Maps to P5 Expert. Boundary fires at P5/P6 (the score is within 0.10 of the 4.9 threshold). Confidence: High."
    - "Same title. Different levels. The label was carrying weight the scope didn't earn."
  - Footnote: "Math format and band ranges are documented in `leveling-engine-reference.md`."
- **widget:** `TrackComparator` — pick a role pattern (low scope/high complexity, balanced, high scope/low complexity) and watch the recommended level shift in real time. Helps people see how the weighting actually behaves. Reduced-motion fallback: three pre-rendered scenarios in a static table.

**Section 4 — Manager and executive add a seventh dimension**

- **paragraph:** Manager-track roles add **people leadership** at 20% weight. Executive-track roles add **strategy ownership** at 30% weight. The math is in the engine reference. The takeaway: if the role doesn't have meaningful people leadership or strategy ownership, picking that track is going to fight your scores.
- **callout (red, title: "Picking the wrong track"):** An executive selection with strategy ownership at 1-3 will trigger a sanity flag. The result still comes back, but the flag is telling you something real: this might be a senior management role wearing an executive title.

**Section 5 — What the engine actually shows you**

- **paragraph:** When the wizard finishes, you'll see a recommended level, a confidence rating, a possible boundary, and any sanity flags. Read all four. The level by itself is the smallest part of what the tool produces.
- **table (caption: "Reading a leveling result"):**
  - Headers: ["Field", "What it tells you"]
  - Rows:
    - ["Level + name", "Where the math landed (e.g., P4 Advanced)"]
    - ["Weighted score", "The number behind the level"]
    - ["Confidence", "How tightly the dimensions agree"]
    - ["Boundary", "Whether the role is sitting near an adjacent level"]
    - ["Move-up / Move-down", "Which dimensions would shift the level"]
    - ["Flags", "Inconsistencies worth a second look"]
    - ["Calibration prompt", "A question to take into the calibration session"]

**Section 6 — Quick check**

- **quiz:** `leveling-spot-the-dimension`

**Closing card:** auto-renders.

---

### 8.3 Module — IC, Manager, and Executive Tracks

**Meta:**

| Field | Value |
|---|---|
| `id` | `tracks` |
| `title` | "IC, Manager, and Executive Tracks" |
| `icon` | 🪜 |
| `minutes` | 9 |
| `audience` | "Managers designing teams and HRBPs running track conversations" |
| `blurb` | "Three ways work scales: through expertise, through teams, and through strategy. Each ladder has its own rules." |
| `lastReviewed` | `2026-04` |

**Closing questions:**

1. Which track does this role's value actually flow through?
2. If we removed the people-leadership piece, would the work still be a senior role?
3. Is the executive title earned by strategy ownership or by org size?
4. What does the dual-ladder look like at my company, and is it real or aspirational?

**Section 1 — Three ladders, one architecture**

- **paragraph:** Companies grow people through three different mechanisms. Some get deeper as experts. Some get broader by leading teams. Some shape direction by owning strategy. Strong architectures let all three coexist without forcing one into the other's shape.
- **widget:** `TrackComparator` — pick a sample role (Senior Engineer, Senior Manager, VP) and see the three tracks visualized side by side. What changes between them is what makes the role bigger, not the seniority.
- **table (caption: "What scales across the three tracks"):**
  - Headers: ["Track", "How value scales", "Typical accountability shift"]
  - Rows:
    - ["IC", "Expertise, problem-solving, domain influence", "Wider technical or functional ownership"]
    - ["Manager", "People systems, coaching, team outcomes", "Larger team, more managers, broader operating area"]
    - ["Executive", "Strategy, resource allocation, risk choices", "More of the business under one set of decisions"]

**Section 2 — IC roles done right**

- **paragraph:** A common architecture failure I've seen: companies that say they have a dual ladder but only promote people who manage. The deep experts plateau, get bored, and leave. Then someone realizes the "principal architect" title that was meant to keep them is empty.
- **callout (amber, title: "If management is the only way up"):** A real dual ladder shows up in promotion decisions, not just in title inventory. Audit the actual promotions in the last two years if you want to know which ladder is real.
- **paragraph:** IC roles scale by widening the kind of problems they own. A P3 solves problems within a known domain. A P5 sets standards across a domain. A P7 is recognized outside the company for rare expertise. The seniority comes from breadth and influence, not seat time.

**Section 3 — Manager: the lead-vs-manager line**

- **paragraph:** "Team lead" and "manager" sound similar in everyday talk. They aren't. A team lead coordinates work and may give technical direction, but doesn't own people outcomes. A manager owns hiring input, coaching, performance routines, and the team operating system.
- **callout (green, title: "Quick test"):** Does the role own the final people outcomes (performance, coaching, staffing, team health)? If yes, it's manager track. If "sort of, with the actual manager," it's lead.

**Section 4 — Executive: the senior-manager-vs-exec line**

- **paragraph:** This one trips people up the most. A senior director with 80 reports is impressive. A VP with 12 reports might still be the more senior role. Org size is real, and so is operating scale. They aren't the same as strategy ownership.
- **paragraph:** Executive roles shape direction durably. They make portfolio choices, allocate resources across competing bets, and own risk that the function couldn't carry alone. If the role is mostly executing strategy that's been set above, that's senior management work, regardless of how the title reads.
- **callout (red, title: "Title inflation watchpoint"):** Promoting from senior director to VP without a strategy-ownership change tends to bend the architecture. The next person who joins at "VP" expects the same scope. Then everyone above them needs a new title. (See module 5 on pay transparency for what this looks like once ranges go public.)
- **widget:** `TitleVsLevelInsight` — given a sample title, shows the level distribution that title typically carries across the public market frame. Helps managers see how widely titles like "Director" or "VP" actually span. Static fallback: bar chart screenshot equivalent rendered as a text summary.

**Section 5 — Same person, two tracks**

- **worked-example (title: "Mariam: P5 IC or M4 Manager?"):**
  - Lines:
    - "She's been a senior engineer for three years. The team needs a new manager."
    - "Path A: stay IC. P5 Expert. Standards-setter for the platform team. Mentors three engineers informally. Influences architecture decisions across the org."
    - "Path B: manager. M4 Senior Manager. Owns a team of 6, hires, runs the operating rhythm. Less individual code, more team outcomes."
    - "Both can be the same level of seniority. They're just different jobs. Pretending Path B is the only promotion punishes Mariam if her best work is in Path A."
  - Footnote: "P5 and M4 may sit in similar pay-range neighborhoods when a company has intentionally mapped those levels as equivalent. Don't assume that without checking your own structure."

**Section 6 — Quick check**

- **quiz:** `tracks-classify`

**Closing card:** auto-renders.

---

### 8.4 Module — Calibration

**Meta:**

| Field | Value |
|---|---|
| `id` | `calibration` |
| `title` | "Calibration" |
| `icon` | ⚖️ |
| `minutes` | 11 |
| `audience` | "HRBPs and Total Rewards leaders running calibration sessions" |
| `blurb` | "How to keep leveling consistent across teams, especially in the messy boundary cases that reveal what your company actually values." |
| `lastReviewed` | `2026-04` |

**Closing questions:**

1. What does our calibration process actually decide, and what does it just rubber-stamp?
2. Are we comparing roles or comparing people?
3. When was the last time we reversed a level decision because the calibration evidence didn't hold up?
4. Where do exceptions go, and who reviews them?

**Section 1 — Calibration builds a shared standard**

- **paragraph:** The best calibration sessions don't end with a tally. They end with a stronger shared mental model. The point of comparing roles is to make sure that next quarter's leveling questions get the same answer that this quarter's did.
- **callout (amber, title: "What calibration is not"):**
  - Rendered as a list:
  - 1) A negotiation. Loudest manager doesn't win.
  - 2) A performance review. Performance and level are separate.
  - 3) A pay decision. Pay follows level. Don't reverse the order.
  - 4) A retention save. Retention is a different conversation, with different tools.

**Section 2 — Bring two roles**

- **paragraph:** The single most useful calibration habit I've watched work: every manager who brings a role brings two more roles for context. One clearly below the proposed level, one clearly above. The conversation stops being about defending an answer and starts being about placing the role on a real ladder.
- **widget:** `CalibrationCompare` — drop two roles in (with their dimension scores) and see the deltas highlighted. Where the bigger role beats the smaller, where they're tied, and any flags either one trips. Use it to practice the comparison muscle. Reduced-motion fallback: side-by-side static dimension table.
- **callout (green, title: "What good looks like in the room"):** Manager: "I think this is M4. Here's an M3 in a similar family that we set last quarter. Here's an M5 we set the year before. This role's scope and people-system ownership sit between them, closer to M4."

**Section 3 — Boundary cases reveal philosophy**

- **paragraph:** Borderline roles are the ones where your company's actual values show up. A role that's defensibly P4 or P5 forces a real conversation about how much weight you give influence versus complexity. The decision matters less than the rationale you record.
- **paragraph:** I've kept the calibration write-ups from old projects on the way managers reasoned about boundary cases. Those notes are more useful than the levels themselves, because they tell future-me how this company tends to think.
- **callout (info, title: "Document the why, not just the what"):** "We placed this at P4" tells nobody anything. "We placed this at P4 because the role's influence is across a single product area and complexity is high but scoped" gives the next decision a precedent.

**Section 4 — Govern exceptions**

- **paragraph:** Exceptions happen. Someone gets hired into a role at a level the architecture doesn't quite support, because the market is hot, or the team needs the hire fast, or there's a strategic moment. Hidden exceptions become precedent. Named exceptions stay manageable.
- **table (caption: "Exception hygiene"):**
  - Headers: ["Field", "What to capture"]
  - Rows:
    - ["Role", "Function, family, current level, intended level"]
    - ["Reason", "Hot market / strategic hire / interim / individual stretch"]
    - ["Boundary expected", "Date or condition by which the gap should resolve"]
    - ["Reviewer", "Who owns the next checkpoint"]
- **callout (amber):** Three exceptions in the same job family is no longer an exception. It's a sign the level needs revisiting.

**Section 5 — Worked walk-through**

- **worked-example (title: "Calibration of an HRBP role"):**
  - Lines:
    - "The case: an HRBP supporting a 200-person business unit, advising the leadership team, owning talent reviews and engagement."
    - "Manager's ask: P5."
    - "Reference roles brought to the room: a P4 HRBP supporting a 90-person unit, a P5 HRBP supporting a 350-person unit with cross-region scope."
    - "The conversation: scope and influence sit between the two references. Knowledge and complexity look closer to P4."
    - "Decision: P4 with a P4/P5 boundary noted. Re-review in six months if the unit grows past 300."
    - "Documented rationale, not just the level."
  - Footnote: "This is also one of the calibration scenarios in the practice lab. See §10."

**Section 6 — Quick check**

- **quiz:** `calibration-evidence-vs-pressure`

**Closing card:** auto-renders.

---

### 8.5 Module — Pay Transparency Readiness

**Meta:**

| Field | Value |
|---|---|
| `id` | `pay-transparency` |
| `title` | "Pay Transparency Readiness" |
| `icon` | 🪟 |
| `minutes` | 7 |
| `audience` | "Senior HR and TR leaders preparing for posted ranges or open compensation" |
| `blurb` | "Why clean architecture is the prerequisite for pay transparency that doesn't blow up in your face." |
| `lastReviewed` | `2026-04` |

**Closing questions:**

1. Could our employees explain how someone moves from one level to the next?
2. Where does our title-to-level ratio drift the most?
3. Are our pay ranges built on consistent leveling or on historical pay?
4. What's our plan for the inevitable "why do they make more than me" conversation?

**Section 1 — Transparency exposes architecture**

- **paragraph:** Once ranges are posted, every employee turns into a comp analyst. They compare titles, levels, and pay. If two people with the same title are two levels apart in the architecture, the math gets uncomfortable fast. Posted ranges don't cause the problem. They make an existing problem visible.
- **callout (red, title: "Don't post ranges before this"):** A clean title-to-level mapping. If "Senior Engineer" lands at three different levels in your data, that's where the credibility break will happen.

**Section 2 — Pay equity needs clean groupings**

- **paragraph:** Most pay equity analyses start by defining similarly situated groups, often using job family, level, geography, and other legitimate factors. If those groupings are noisy, the regression catches a lot of false positives, the remediation list grows, and the project takes longer than it should. Architecture cleanup is the cheapest pay equity work you can do.
- **widget:** `RangeOverlapVisualizer` — toggle between "tight architecture" and "messy architecture" to see how range overlap behaves. Clean architecture makes overlap intentional and explainable. Messy architecture makes overlap hard to defend, and employees notice. Static fallback: two pre-rendered charts.
- **paragraph:** I'd rather have an organization with five levels and clear differentiation than fifteen levels that all blur together. Density of levels signals nothing if employees can't tell them apart.

**Section 3 — Maintenance is the system**

- **paragraph:** New roles emerge. Markets shift. Acquisitions bring different architectures into the same company. A job architecture you never maintain becomes an artifact of when it was built. Bake in a quarterly cadence for new roles, exception reviews, and family additions, even if it's a 30-minute checkpoint.
- **table (caption: "What to look at each quarter"):**
  - Headers: ["Topic", "Question"]
  - Rows:
    - ["New roles", "Were any roles created with no architecture mapping?"]
    - ["Title exceptions", "Are exceptions resolving or compounding?"]
    - ["Boundary cases", "Are the same kinds of cases coming back to calibration?"]
    - ["Family changes", "Has any function reorganized in a way the families haven't caught?"]

**Section 4 — Quick check**

- **quiz:** `transparency-title-level-check`

**Closing card:** auto-renders.

---

### 8.6 Quizzes (full bank)

Each quiz has one question, three to four options, and a closing line. Quiz answers reveal full explanations on every option (correct and incorrect).

**`architecture-101-evidence`**

> **Question:** A manager says, "She's been here four years and is the most reliable person on the team. She deserves the next level."
>
> Which of these is the manager mostly describing?

- **A. Performance and tenure** *(correct):* "Reliability and time-in-role are real. They're inputs to a performance or retention conversation, not a leveling one. The level is about the size of the job."
- **B. Scope and complexity** *(incorrect):* "Neither was mentioned. The case never described what the role actually owns or how ambiguous the work is."
- **C. Influence and impact** *(incorrect):* "Possibly true, but the manager hasn't shown evidence of it. Without that evidence, you're guessing."
- **D. All of the above** *(incorrect):* "Tempting, but bundling these together is exactly what causes the leveling/performance confusion this module is about."

> **Closing:** Performance, tenure, and reliability are valuable signals. They feed a different decision than leveling.

**`leveling-spot-the-dimension`**

> **Question:** Which dimension does this evidence most strongly support?
>
> *"This role coordinates with three engineering directors who don't report to it, builds alignment across their teams on technical standards, and gets cited as the tiebreaker when those teams disagree."*

- **A. Scope** *(incorrect):* "Scope is implied, but the leading signal is who the role is moving and how."
- **B. Influence** *(correct):* "Coordinating with directors who don't report to the role, building alignment, and being the tiebreaker is influence. It's what separates senior IC roles from simply experienced ones."
- **C. Complexity** *(incorrect):* "Standards and tiebreakers can involve complex tradeoffs, but the evidence here emphasizes who is being aligned, not how ambiguous the problem is."
- **D. Knowledge** *(incorrect):* "Knowledge depth is implied but not the leading signal."

> **Closing:** Most evidence touches multiple dimensions. The skill is naming the strongest one.

**`tracks-classify`**

> **Question:** A senior director runs a 60-person operations function. They make day-to-day staffing and budget calls. The functional strategy is set by the COO each year. Which track does this role most clearly belong to?

- **A. IC** *(incorrect):* "Sixty reports rules out IC, even at high seniority."
- **B. Manager** *(correct):* "Manager track. Significant org size, real operating accountability, but strategy is owned above. That's senior management."
- **C. Executive** *(incorrect):* "An executive track classification would need evidence that the role owns operations strategy, not just operating execution."
- **D. Could be either Manager or Executive** *(incorrect):* "It could become executive if the role started owning the operations strategy. Today, on the evidence given, it's manager track."

> **Closing:** Org size signals operating scale. Strategy ownership signals track.

**`calibration-evidence-vs-pressure`**

> **Question:** Which of these is calibration evidence (versus pay pressure or a retention concern)?

- **A. "She just turned down a competing offer at a higher level."** *(incorrect):* "That's a retention conversation. Real, but separate."
- **B. "He's been at the level for three years and the team expects he'll get promoted."** *(incorrect):* "That's tenure and expectation, not evidence about job size."
- **C. "Her role now influences engineering decisions in two adjacent product areas, and she sets the standards for our internal tooling."** *(correct):* "Scope and influence both expanded. That's leveling evidence."
- **D. "Their pay sits in the bottom third of the range."** *(incorrect):* "That's pay pressure. Pay sits low for many reasons (offer history, geography, internal equity gaps). Reaching for a level change to fix it bends the architecture."

> **Closing:** When in doubt, ask: did the job change, or did the situation around the job change?

**`transparency-title-level-check`**

> **Question:** You audit your company's "Senior Engineer" title. You find people at P3, P4, and P5 carrying the same title. What's the right first move?

- **A. Re-title everyone consistently right now.** *(incorrect):* "Mass re-titling without explanation is a bigger transparency mistake than the inconsistency itself. Communicate before you label."
- **B. Decide which level "Senior Engineer" should map to going forward and stop using it for the others.** *(correct):* "Lock the title to one level. Re-title the off-pattern roles into accurate titles. Communicate the change with rationale before any range posting."
- **C. Leave it alone. Titles drift everywhere.** *(incorrect):* "Leaving it makes the title meaningless. Once ranges are posted, employees will notice."
- **D. Add a sub-title qualifier (Senior Engineer I, II, III) to differentiate.** *(incorrect):* "This works only if the qualifiers map to real, governed levels with clear differentiation. Adding labels without level governance just makes the inconsistency more visible."

> **Closing:** Title consistency is a transparency prerequisite, not a transparency outcome.

---

## 9. Leveling Wizard — UX spec

The wizard is the tool's only interactive flow that produces a measured result. All scoring math is documented in [`leveling-engine-reference.md`](./leveling-engine-reference.md). This section covers UX, copy, and result rendering only.

### 9.1 Flow

| Step | Screen | Purpose |
|---|---|---|
| 0 | Role picker | Pick IC, Manager, Executive, or Not sure (with two-question helper) |
| 1..N | Dimension cards | One card per required dimension, 7 options each |
| N+1 | Review | Edit any answer before submission |
| N+2 | Result | Recommended level, confidence, boundary, explanation, move-up/down, flags, calibration prompt, summary download, reset |

`N` is six for IC, seven for Manager, seven for Executive.

### 9.2 Step indicator

- Horizontal segmented bar at the top of every step.
- Each segment is a labeled chip ("Role," "Scope," "Complexity," etc.).
- Completed segments are filled `var(--accent)`; current is outlined `var(--accent-strong)`; future are `var(--surface-alt)`.
- Mobile: collapses to "Step 3 of 8" text plus a thin progress bar.

### 9.3 Role picker step

- Four cards in a 2×2 grid on desktop, single column on mobile.
- Each card: title (Outfit 600), short body, no icon.
- "Not sure" expands to a small two-question helper inline (per engine reference §2). Resolving the two questions auto-advances to the next step with `roleType` set.

**Drafted intro copy (above the cards):**

> **Pick the kind of role you're sizing.**
> The tool weights people-leadership and strategy slightly differently for manager and executive tracks. If you're not sure, "Not sure" works just fine.

### 9.4 Dimension card step

- One dimension at a time. Title + the dimension's `prompt` (already drafted in `data/leveling.ts`).
- Seven options stacked as radio cards. Each card shows: option label, the description below it in `var(--muted)`, and a small score chip (1..7) on the right.
- Clicking a card selects + advances after a 200ms beat (gated on `prefers-reduced-motion: reduce` — reduced-motion users get an explicit "Continue" button).
- Below the cards: `< Back` button on the left, optional `Skip to review →` once at least three dimensions are answered.

**Drafted footer line (under each dimension card screen):**

> Pick the option that fits the role most of the time, not the rare extreme. Boundary cases work themselves out at the end.

### 9.5 Review step

- Single page list of every required dimension with its selected score, score chip, and an inline `Edit` link.
- Bottom-right button: `See the level`.

**Drafted intro copy:**

> **Look this over.**
> Edit anything that doesn't match how the role actually works. The math runs the second you click through.

### 9.6 Result rendering

The result screen shows every field on `LevelingResult` (per engine reference §10). Visual layout:

```
┌──────────────────────────────────────────────────┐
│ [LEVEL CODE]  [Level name]                      │  Big. Outfit 700 + JetBrains Mono for code.
│ Confidence: <badge>   Boundary: <pair or none>  │  Inline meta row.
├──────────────────────────────────────────────────┤
│ Why this level                                   │
│ <explanation>                                    │
├──────────────────────────────────────────────────┤
│ What would move it up                            │
│ <moveUp>                                         │
│                                                  │
│ What would move it down                          │
│ <moveDown>                                       │
├──────────────────────────────────────────────────┤
│ Watch-outs                                       │
│ <flags as a list, or empty state>               │
├──────────────────────────────────────────────────┤
│ Take this into the calibration session           │
│ <calibrationPrompt>                              │
├──────────────────────────────────────────────────┤
│ Dimension scores                                 │
│ <dimensionRows as small bar chart + numbers>    │
├──────────────────────────────────────────────────┤
│ [Download summary]   [Start over]               │
└──────────────────────────────────────────────────┘
```

### 9.7 Result rendering rules

**Level code + name.** Code in JetBrains Mono, accent color, bigger than name. Name in Outfit 700, regular text color. Both on the same baseline.

**Confidence badge.** Three states with color and text. High → green chip "High confidence." Medium → amber "Medium confidence." Low → red "Low confidence."

**Boundary.** If `boundary` is null, render *"This sits comfortably inside the band."* If non-null, render *"Sitting close to the {pair} boundary."* Add a one-line explainer below: *"That means small evidence shifts could move the level. Worth a calibration check."*

**Why this level.** Render `explanation` verbatim from the engine. The engine produces voice-acceptable copy already.

**Move-up / move-down.** Render `moveUp` and `moveDown` verbatim from the engine. **Wizard override required** for the empty-join edge cases documented in engine reference §12: if either string contains a double space (`Broader  would make`), replace with a "ceiling reached" / "floor reached" message:

- All-high override: *"This already sits at the top of the dimensions. Moving higher means more of the same dimensions still scoring strongly across a broader scope."*
- All-low override: *"This already sits low across the dimensions. Moving down would mean reducing scope, complexity, or autonomy further than this role typically does."*

**Watch-outs (flags).** Render each flag as a row with a leading amber chip. If `flags` is empty, render *"No inconsistencies in the inputs. The dimensions agree with each other."*

**Calibration prompt.** Render verbatim. Add a small "Copy" button that copies the prompt to clipboard for pasting into the calibration deck.

**Dimension scores.** Render as a horizontal bar list: dimension `shortLabel`, the score number (JetBrains Mono), and a 1..7 bar filled to the score. Sort in `requiredDimensionIds` order, not by score, so users can compare to the order they answered in.

**Disclaimer footer.** Inline at the bottom of the result screen, italic, muted: *"Directional guidance. Use it alongside calibration and licensed market data."*

### 9.8 Download

- "Download summary" button calls `buildSummaryText(result)` (engine reference §13) and saves a `.txt` file.
- Filename: `joblevel-summary-<roleType>-<levelCode>-<timestamp>.txt`. Example: `joblevel-summary-ic-P4-20260601.txt`.
- MIME: `text/plain`.
- Trigger via Blob + ObjectURL. No server.

### 9.9 Reset

- "Start over" wipes wizard state and returns to step 0.
- No confirmation dialog. The wizard takes three minutes; the cost of an accidental reset is low.

### 9.10 Error and validation states

- A dimension with no selection blocks "Next." Highlight the unanswered dimension's step indicator chip in red, scroll to the missing card.
- The engine throws on missing scores. The wizard must prevent that from ever firing in production by validating before calling `calculateLevelingResult`.
- Out-of-range scores aren't possible from the option-pick UI. If they ever happen via URL hacking or bug, fall back to step 0 with a one-line muted notice: *"Couldn't read those answers. Starting fresh."*

---

## 10. Calibration Lab — interaction spec

Four scenarios, each with the same predict-then-reveal flow. The educational goal: train the muscle of holding evidence at arm's length before committing to a level.

### 10.1 Layout

- **Top strip:** four scenario cards as a horizontal selector. Active card is `accent-soft`. Inactive cards show title, family, track in muted text. Mobile: scroll-snap horizontally.
- **Active scenario panel:** scenario title, family, track, then a two-step body (Predict → Reveal).
- **Session stats (optional, top-right):** "Predicted: 2 of 4 · Reset session." Updates as the user works through scenarios. In-memory only.

### 10.2 Predict step (Step 1)

The user reads the scenario facts and predicts a band.

**Drafted intro copy:**

> **What level would you give this role?**
> Read the facts. Pick the band you'd argue for in a calibration session, then see how your reasoning lines up with the recommended answer. There's no scoring. You're building the muscle.

**Inputs:**

1. **Predicted band picker** — radio cards matching the scenario's track:
   - IC scenarios show P1..P7 + "On a boundary" + "Not enough info."
   - Manager scenarios show M2..M6 + same suffixes.
   - Executive scenarios show E1..E5 + same suffixes.
2. **One-line reason** — single text input, optional, max 120 chars. Placeholder: *"Why? (Optional, 120 chars.)"* Useful for users running this with their team.

**Action:** "See the recommended answer."

### 10.3 Reveal step (Step 2)

Five blocks render after the user clicks reveal:

1. **Strongest evidence** — `strongestEvidence` from `data/scenarios.ts`. Bullet list with green leading chip.
2. **Watch-outs** — `watchOuts`. Bullet list with amber leading chip.
3. **Recommended band** — `recommendedBand`. Big, JetBrains Mono, accent color. Below it: *"Your prediction: {band}"* if the user picked one, with a small "matched" or "different" indicator. **No scoring**, just the comparison.
4. **Calibration question** — `calibrationQuestion`. Italic. With copy-to-clipboard button.
5. **Reflect prompt** — drafted: *"What single piece of evidence in this scenario would change the band? Hold that up against the role you actually had in mind when you read this."*

**Actions:** *"Try the next scenario →"* (advances to the next un-revealed scenario), *"Back to predict"* (resets the active scenario).

### 10.4 Drafted lab intro (top of the page)

> **Practice calibration on real boundary cases.**
> Each one is a role I've actually leveled. Read the facts, pick a band, then compare your reasoning against the recommended answer. The watch-outs are where most calibration sessions land in practice.

### 10.5 Scenarios — content adjustments

The four scenarios already exist in [`/src/data/scenarios.ts`](./src/data/scenarios.ts). They are voice-acceptable as written. Three small tightenings:

- **`senior-engineer`** — change `recommendedBand` from `"P4/P5 boundary"` to `"P4 (boundary P4/P5)"` so it matches the engine's output convention.
- **`finance-manager`** — same: `"M3/M4 boundary"` → `"M3 (boundary M3/M4)"`.
- **`regional-sales-vp`** — same: `"E1/E2 boundary"` → `"E1 (boundary E1/E2)"`.
- **`hrbp`** — already in the correct format (`"P4"`).

No copy changes to facts, evidence, or watch-outs.

### 10.6 Empty / first-visit state

Default scenario on load: `senior-engineer`. The first scenario card opens with the predict step expanded. Other scenario cards are dimmed.

### 10.7 Accessibility specifics

- Predict-step radio cards: `<fieldset>` + `<legend>` ("Predicted level"). Radio cards are `<label>` wrappers around `<input type="radio">`.
- Reveal step: announce arrival with `aria-live="polite"` on the recommended-band region.
- Tab order: scenario picker → predict radios → reason input → reveal button → reveal blocks → next button.

---

## 11. Glossary

A standalone page (`/glossary`) and an inline tooltip system that auto-links matching terms in module prose.

### 11.1 Page layout

- Search input at the top: live filter, case-insensitive. Placeholder: *"Search the glossary."*
- Term list below, alphabetical. Each term renders as a small card: term name (Outfit 600), plain-language definition, and a "Use it when" line in muted text.
- Anchor link per term: `/glossary#<term-slug>`. Inline glossary tooltips link here.

### 11.2 Search empty state

If the filter returns zero results: *"No matches. Try fewer letters."* Render in muted text with a "Clear search" button.

### 11.3 Drafted page intro

> **Plain-language definitions for the words this tool throws around.**
> If something in a module is fuzzy, this is the page for it. Most of these terms get used differently across companies. The definitions here are the ones the tool uses.

### 11.4 Glossary entries

The 10 entries in [`/src/data/architecture.ts`](./src/data/architecture.ts) (`glossaryTerms`) are voice-acceptable as drafted. Five additions (drafted below) to support module references:

| Term | Plain definition | Use it when |
|---|---|---|
| Calibration evidence | A description of the job, not the person, that supports placing the role at a level. | Use it during calibration sessions when separating leveling from performance, retention, or pay pressure. |
| Boundary case | A role whose evidence sits within ±0.2 of an adjacent level threshold. | Use it when documenting why a role landed on one side of a level edge so future calibrations can reference the rationale. |
| Track | The career path by which a role scales: individual contributor, people manager, or executive. | Use it when deciding whether a role's growth comes through expertise, teams, or strategy. |
| Dual ladder | An architecture that gives parallel growth paths for IC and manager roles, with comparable seniority at equivalent levels. | Use it when a deep expert shouldn't be forced into management to keep advancing. |
| Title inflation | The drift of titles upward without a corresponding change in scope, complexity, or impact. | Use it when explaining why a posted range or a new hire title looks off relative to the architecture. |

These five entries get added to `data/architecture.ts` in the implementation pass.

### 11.5 Inline glossary linking

Per §5.5: any prose match against a glossary `term` (case-insensitive, whole-word, longest match wins) gets a dotted underline. Hover or focus reveals the plain definition in a tooltip with a "More" link to the glossary page. Manual override `\Term` skips linking.

---

## 12. Methodology page

Source-cited reference. Reads more like documentation than the modules. Voice rules in §1.2 still apply (no em dashes, no contrast framing). Voice in §1.3 is relaxed — the page can be more matter-of-fact.

### 12.1 Sections

1. What this tool is for (and isn't)
2. Scoring model (summary, link to engine reference for math)
3. Confidence rating
4. Boundary detection
5. Sanity flags
6. Sources
7. Limitations
8. Radford / Aon-friendly usage
9. Disclaimer (verbatim from §19)

### 12.2 Drafted page intro

> **How this tool produces an answer, and where it stops.**
> The summary below covers the model in plain English. The full math, edge cases, and worked examples live in the [engine reference](./leveling-engine-reference.md).

### 12.3 Drafted body — Scoring model

> The wizard asks about six core dimensions of a role: scope, complexity, autonomy, influence, knowledge, and business impact. Each dimension has a 7-point scale.
>
> The engine averages the six. Manager-track roles add a seventh dimension (people leadership) at 20% weight. Executive-track roles add a seventh (strategy ownership) at 30% weight. The weighted score maps to a level on the IC, manager, or executive ladder. Bands are documented in the engine reference.

### 12.4 Drafted body — Confidence

> Confidence is the standard deviation of your dimension scores. If your scores agree closely, confidence is high. If they're scattered, confidence is low. Low confidence usually means the role is a hybrid, a stretch, or a boundary case worth talking about in calibration.

### 12.5 Drafted body — Boundary detection

> If the weighted score sits within 0.2 of an adjacent level threshold, the result flags the boundary (e.g., "P4 (boundary P3/P4)"). The level you see is the band the score actually falls in. The boundary tells you that small shifts in evidence could move it.

### 12.6 Drafted body — Sanity flags

> Flags are informational. They don't block the result. They surface when something in the inputs looks inconsistent: an autonomy score far higher than complexity, a people-leadership score with a narrow scope, an executive selection with low strategy ownership, or scores that vary widely across dimensions. Each flag suggests something worth a second look in calibration.

### 12.7 Drafted body — Sources

The four `sourceNotes` in `data/architecture.ts` are voice-acceptable. Render as a list with the link, the note, and a small "Why I cite it" line per item. The current notes cover Aon Job Architecture, Radford McLagan reporting features, RMCD Job Offers Data, and Aon Compensation 101. No additions.

### 12.8 Drafted body — Limitations

> Limitations:
>
> 1. The dimensions are a working model. Your company's real architecture may use four dimensions, or eight, or different ones entirely.
> 2. The level bands reflect common-market shapes. P4 here is a directional pointer, and your company's P4 may sit somewhere else on the same shape.
> 3. The engine never sees your company's salary structure. Pay range design is a different decision and requires licensed market data.
> 4. Sanity flags catch obvious inconsistencies. They miss subtle ones. Calibration still beats automation for boundary cases.

### 12.9 Drafted body — Radford / Aon-friendly usage

> Use this tool to start the conversation. For the actual job matching, market pricing, peer-group construction, and pay range design that production Total Rewards work requires, you'll want licensed Radford or Aon resources (or your survey provider of choice). The tool intentionally does not reproduce proprietary level descriptors, point-factor methods, or survey job content.

---

## 13. Widget catalog

Every widget exports a React component plus a `getFallback(props)` static for SSR and reduced-motion users. Contract is in §5.3.

### 13.1 ArchitectureLadder

- **Where:** `/` and `/learn/architecture` (Section 2 of the Architecture 101 module).
- **Inputs (props):** `anchorRoleId?: string` (optional preselect from `anchorRoles`).
- **Behavior:** Six layer cards stacked vertically. Click expands; click again collapses. If `anchorRoleId` is provided, populates each layer's example with that role's value. If not, shows generic examples.
- **Fallback:** All six layer cards rendered open with generic examples. No animations.
- **Math:** none (pure presentation).
- **A11y:** Each layer is a `<button aria-expanded>`. Expanded content lives in a `<region>` with `aria-labelledby` pointing to the button. Keyboard navigation: arrow up/down moves between layers.

### 13.2 AnchorRolePicker

- **Where:** Inside `ArchitectureLadder` and on `/`.
- **Inputs:** `value: string | null`, `onChange: (id) => void`.
- **Behavior:** Three role cards (Senior Platform Engineer, Senior Manager FP&A, Regional VP Sales). Click selects. Selected card gets `accent-soft` background. Picking emits `onChange(id)`.
- **Fallback:** Same UI; no transitions.
- **Math:** none.
- **A11y:** `<fieldset>` + `<legend>`. Cards are `<label>` around `<input type="radio">`.

### 13.3 DimensionTryOut

- **Where:** Module 8.2 Section 2.
- **Inputs:** `dimensionId: DimensionId` (defaults to `scope`).
- **Behavior:** Renders the dimension's seven options as picker chips. Picking shows the option description plus a one-sentence "what this typically looks like" example. Re-picking updates instantly.
- **Fallback:** Static list of all seven options with descriptions, no animations, no selected-state.
- **Math:** none. Pulls from `dimensions[].options`.
- **A11y:** `<fieldset>` + `<legend>` with the dimension's `prompt`. Radio inputs.

### 13.4 TrackComparator

- **Where:** Modules 8.2 Section 3 and 8.3 Section 1.
- **Inputs:** `mode: "score-pattern" | "role-shape"` (controls preset behavior).
- **Behavior:**
  - `score-pattern` mode (used in 8.2): three score patterns (low-scope/high-complexity, balanced, high-scope/low-complexity) presented as cards. Picking one runs the engine and shows the resulting level for the chosen track.
  - `role-shape` mode (used in 8.3): three sample roles (Senior Engineer, Senior Manager, VP) shown side by side with their dimension profiles and resulting levels.
- **Fallback:** Three pre-rendered scenarios in a static comparison table.
- **Math:** Calls `calculateLevelingResult` with each preset's scores. Defers to engine reference.
- **A11y:** Compare tables get `<caption>` describing the comparison axis.

### 13.5 TitleVsLevelInsight

- **Where:** Module 8.3 Section 4.
- **Inputs:** `title: string` (one of: "Director", "VP", "Senior Engineer", "Senior Manager", "Principal").
- **Behavior:** For the selected title, shows a horizontal bar visualization of which levels that title typically maps to in the public market frame. Bar widths based on illustrative distributions, not survey data. Footnote labels the data as illustrative.
- **Fallback:** Static description: *"Across companies, titles like 'Senior Engineer' commonly span P3 to P5. The exact distribution matters less than the takeaway: title alone does not tell you the level."*
- **Math:** none. Static lookup table with illustrative percentages.
- **A11y:** Bars include text equivalents.

### 13.6 CalibrationCompare

- **Where:** Module 8.4 Section 2.
- **Inputs:** `roleA: { label: string; scores: LevelingScores }`, `roleB: { label: string; scores: LevelingScores }`.
- **Behavior:** Side-by-side dimension comparison. Highlights where one role beats the other (visual delta). Shows resulting level + flags for each.
- **Fallback:** Static side-by-side dimension table with no delta highlighting.
- **Math:** Calls `calculateLevelingResult` per role.
- **A11y:** Table with row scope on dimension names. Delta indicators include text labels ("higher" / "lower" / "tied").

### 13.7 RangeOverlapVisualizer

- **Where:** Module 8.5 Section 2.
- **Inputs:** `mode: "tight" | "messy"`.
- **Behavior:** Renders pay-range bars stacked vertically across levels. "Tight" mode shows clean overlap (intentional, explainable). "Messy" mode shows excessive overlap. Toggle button switches between them.
- **Fallback:** Two pre-rendered chart screenshots labeled "Tight architecture" and "Messy architecture."
- **Math:** none. Static range data.
- **A11y:** Charts include text summaries.

### 13.8 Quiz

- **Where:** Final section of every module.
- **Inputs:** `quizId: string`.
- **Behavior:** Renders the question + options. User picks → all options reveal correctness with explanations → closing line shows. "Try another" resets. Persists nothing.
- **Fallback:** Same UX without animations.
- **Math:** none.
- **A11y:** `<fieldset>` + `<legend>` for the question. Options as radio inputs. Correctness indicator uses both color and text ("Correct" / "Not quite").

---

## 14. Source attribution and proprietary-content guardrails

### 14.1 Where source notes appear

- **Methodology page (`/methodology`).** Canonical list. Every public source the tool relies on lives here, with a "why I cite it" line per source.
- **Footnote markers in modules.** Inline references like `(see [src/aon-architecture])` in a paragraph render as a numbered footnote linking to the methodology page.
- **Radford positioning card on `/`.** A short summary that points to the licensed Radford / Aon resources and explains why the tool stops where it stops.

### 14.2 What requires a source citation

- Any factual claim about Aon, Radford, or another named survey provider's public framing.
- Any specific number that originates from a public source (peer-group sizes, market data scope, etc.).
- Any link to an external page.

What does **not** require a citation:
- General statements about market practice ("most leveling models size jobs along similar dimensions").
- The author's voice or opinions.
- Internal references to the engine reference, glossary, or other modules.

### 14.3 Proprietary-content guardrails (hard rules)

- **No reproduced level descriptors.** The engine's option labels and descriptions are written from public framing and the author's experience. They do not copy Radford, Mercer, WTW, Hay, or other licensed level guides.
- **No reproduced job descriptions.** The toolkit does not include survey job descriptions, job codes, or job families lifted from a licensed database.
- **No point-factor methodology.** The toolkit does not implement Hay points, Mercer IPE, or other point-factor systems. The 7-point dimension scale and weights are the author's own working model.
- **No competitive analysis disguised as education.** Modules don't compare named competitors of Radford / Aon as a way to position one over another. They reference public framing only.

### 14.4 Source-note maintenance

- Source notes get reviewed at the same cadence as module `lastReviewed` dates (annually).
- If Aon or Radford updates their public materials, the citing modules get a `lastReviewed` bump and any wording updates.
- Sources that 404 or move get fixed within the same week. Defer to the author for new sources to add.

---

## 15. SEO and sitemap

### 15.1 Page metadata

| Route | Title | Description |
|---|---|---|
| `/` | Job Architecture Toolkit | Free directional leveling tool and education for HRBPs, managers, and Total Rewards leaders. Built by Armi Noorata. |
| `/learn` | Learn · Job Architecture Toolkit | Five short modules: architecture basics, leveling dimensions, IC/manager/exec tracks, calibration, pay transparency. |
| `/learn/[id]` | `<module title> · Job Architecture Toolkit` | Module's own `blurb` field. |
| `/leveling` | Leveling Wizard · Job Architecture Toolkit | Three-minute directional leveling wizard. Six dimensions, weighted score, confidence rating, boundary detection. |
| `/calibration` | Calibration Lab · Job Architecture Toolkit | Predict-then-reveal practice on four real boundary cases: IC, manager, executive, HRBP. |
| `/glossary` | Glossary · Job Architecture Toolkit | Plain-language definitions for the words this toolkit uses. |
| `/methodology` | Methodology · Job Architecture Toolkit | How the scoring works, what the confidence rating means, sources, and limitations. |

### 15.2 Open Graph

- `og:title` matches the page `<title>`.
- `og:description` matches the page description.
- `og:image` — single shared OG image: dark background, eyebrow-style "JOB ARCHITECTURE TOOLKIT" wordmark in accent gold, tagline below in muted text. 1200×630. Lives at `/og.png`. Same image across every route to keep the family signature consistent.
- `og:type` is `website` for the home page, `article` for module pages.

### 15.3 Robots and sitemap

- `robots.ts` already exists in the codebase. Confirm it allows all routes.
- `sitemap.ts` already exists. Add `/learn/[id]` entries for each of the five modules dynamically.

### 15.4 Indexable / non-indexable

All current routes are indexable. There are no PII pages, no auth pages, no per-user URLs.

---

## 16. Implementation mapping

What's already built, what changes, and what's new. Use this as the punch list for the next push.

### 16.1 Files that change

| File | Change |
|---|---|
| `src/data/architecture.ts` | Drop `educationModules` (moves to new `src/data/modules.ts`). Keep `architectureLayers`, `glossaryTerms`, `sourceNotes`. Add five new glossary entries per §11.4. |
| `src/data/scenarios.ts` | Update `recommendedBand` strings on three scenarios to match engine output convention (per §10.5). |
| `src/data/leveling.ts` | No changes. |
| `src/lib/leveling.ts` | No changes. |
| `src/components/education/ArchitectureExplorer.tsx` | Add anchor-role picker + per-layer example swap. |
| `src/components/education/ModuleCards.tsx` | Delete. Replaced by `src/components/learn/LearnModuleGrid.tsx`. |
| `src/components/leveling/LevelingWizard.tsx` | Apply result-rendering rules per §9.7 and the empty-join wizard overrides. State as a local `useReducer`; no Context. |
| `src/components/calibration/CalibrationLab.tsx` | Rebuild as predict-then-reveal flow per §10. |
| `src/app/page.tsx` | Add path selector beneath CTAs. Update CTA copy per §6.3. |
| `src/app/learn/page.tsx` | Add path selector at top, swap in the new `LearnModuleGrid`. |
| `src/app/methodology/page.tsx` | Replace body copy per §12. File path stays. |
| `src/app/layout.tsx` | If the OG image and shared meta defaults move into the root layout, update there. Otherwise per-page metadata is fine and layout stays. |

### 16.2 Files that are new

| File | Purpose |
|---|---|
| `src/data/modules.ts` | Block-typed module content (drafted in §8). Owns `LearnModule` and `Block` types. |
| `src/data/quizzes.ts` | Quiz definitions (drafted in §8.6). Owns `Quiz` type. |
| `src/data/learning-paths.ts` | Path-to-module-order mapping (per §7.2). |
| `src/data/anchor-roles.ts` | Three anchor roles for the architecture explorer (per §6.2). |
| `src/components/learn/LearnModuleGrid.tsx` | Path-aware module grid (replaces old `ModuleCards.tsx`). |
| `src/components/learn/PathSelector.tsx` | The "What brings you here?" picker. |
| `src/components/learn/ModuleRenderer.tsx` | Block-aware renderer for module pages. |
| `src/components/learn/Quiz.tsx` | Quiz component. Lives outside `widgets/` because it's a block type, not a widget; doesn't follow the widget contract in §5.3. |
| `src/components/learn/blocks/Paragraph.tsx` | Paragraph block with auto-glossary linking. |
| `src/components/learn/blocks/Callout.tsx` | Callout block with severity colors. |
| `src/components/learn/blocks/Table.tsx` | Table block with mobile stacking. |
| `src/components/learn/blocks/WorkedExample.tsx` | Worked-example block. |
| `src/components/learn/blocks/QuestionsCard.tsx` | Closing card with the module's `questions[]`. |
| `src/components/learn/widgets/WidgetFrame.tsx` | Shared wrapper for widgets (border, caption, footer, fallback rendering). |
| `src/components/learn/widgets/ArchitectureLadder.tsx` | §13.1. |
| `src/components/learn/widgets/AnchorRolePicker.tsx` | §13.2. |
| `src/components/learn/widgets/DimensionTryOut.tsx` | §13.3. |
| `src/components/learn/widgets/TrackComparator.tsx` | §13.4. |
| `src/components/learn/widgets/TitleVsLevelInsight.tsx` | §13.5. |
| `src/components/learn/widgets/CalibrationCompare.tsx` | §13.6. |
| `src/components/learn/widgets/RangeOverlapVisualizer.tsx` | §13.7. |
| `src/app/learn/[id]/page.tsx` | Dynamic module route. Implements `generateStaticParams` (one entry per module id), `generateMetadata` (title + description from the module record), and `notFound()` when `id` doesn't match. |
| `src/app/glossary/GlossaryEntry.tsx` | Single-term card with anchor link. |
| `src/app/glossary/GlossaryList.tsx` | Search + list. |
| `src/lib/glossary.ts` | Tooltip auto-link logic (per §5.5). |
| `public/og.png` | Single shared OG image. |

### 16.3 Files that stay untouched

- `src/components/SiteHeader.tsx`, `SiteFooter.tsx`, `ThemeToggle.tsx`, `NavMenu.tsx`
- `globals.css`
- `src/app/not-found.tsx`, `robots.ts`

### 16.4 Suggested build order

1. Data layer first: write `modules.ts`, `quizzes.ts`, `learning-paths.ts`, `anchor-roles.ts`, the five new glossary entries.
2. Block renderer + block components + `Quiz` (Quiz lives at `src/components/learn/Quiz.tsx`, not in `widgets/`).
3. Widgets in order of education-module dependency: ArchitectureLadder, AnchorRolePicker, DimensionTryOut, TrackComparator, CalibrationCompare, TitleVsLevelInsight, RangeOverlapVisualizer.
4. Module dynamic route (`/learn/[id]` with `generateStaticParams` + `generateMetadata` + `notFound()`) + path selector + new home grid.
5. Wizard result-rendering polish per §9.7.
6. Calibration Lab predict-then-reveal rebuild per §10.
7. Glossary page + tooltip logic.
8. Methodology page copy update per §12.
9. SEO meta + OG image.

Test on every step. Type checking and a build pass before moving on.

### 16.5 Build-readiness conventions

- **Wizard state.** Local `useReducer` inside `LevelingWizard.tsx`. No Context. No reducer in a separate file unless tests need it.
- **Widget max widths.** Widgets render inside the reading-narrow container (720px) by default. Widgets with side-by-side comparisons (TrackComparator role-shape mode, CalibrationCompare) may break out to the full 1152px container width using a `wide` prop on `WidgetFrame`.
- **Loading states.** None. The tool is fully static. Reduced-motion users get static fallbacks (per §5.3), not loading shells.
- **First-load performance budget.** Aim for sub-200KB JS on the home page after gzip. The wizard route may exceed slightly because of the score engine; that's acceptable.
- **Title separator convention.** Every page title uses ` · ` (middle dot) between the page name and the toolkit name. Codified in §15.1; do not vary.

---

## 17. Out of scope

Saying these out loud so they don't creep in:

- Org chart visualization or reporting-line modeling.
- HRIS or ATS integration of any kind.
- Real-time collaboration (multi-user calibration sessions).
- Saved sessions, accounts, or user-history.
- AI-generated job descriptions or AI chat.
- Pay range design or salary structure modeling.
- Promotion-process automation (workflows, approvals, notifications).
- Comparison against a specific company's internal architecture (no upload, no import).
- Competitor analysis of Radford vs. Mercer vs. WTW.
- Multi-language localization. (English only at launch. Revisit later if data shows demand.)
- Mobile native apps. The tool is web-first and works on mobile web; that's enough.

---

## 18. Build status (dated 2026-04-30)

### 18.1 Done

- Sibling-pattern chrome (Header, Footer, ThemeToggle, NavMenu) wired and verified against `SIBLING_TOOL_PATTERN.md`.
- All six routes scaffolded.
- Scoring engine in `src/lib/leveling.ts` working; output validated against `leveling-engine-reference.md`.
- Dimensions, role types, level codes in `src/data/leveling.ts`.
- Architecture layers, education modules (sparse), glossary terms (10), source notes (4) in `src/data/architecture.ts`.
- Four calibration scenarios in `src/data/scenarios.ts`.
- Existing `LevelingWizard`, `CalibrationLab`, `ArchitectureExplorer` components functional.
- Engine reference (this file's companion) accurate and reviewed.

### 18.2 Next push (driven by this spec)

- §6 Architecture Explorer interactive upgrade (anchor-role picker, layer expansion).
- §7 Path selector on `/` and `/learn`.
- §8 Module content rewrite as block-typed data + `ModuleRenderer`.
- §8.6 Quiz bank in `data/quizzes.ts`.
- §9.7 Wizard result-rendering polish + empty-join overrides.
- §10 Calibration Lab predict-then-reveal rebuild.
- §11 Glossary page + tooltip auto-linking + five new entries.
- §12 Methodology page copy refresh.
- §13 Widget catalog: build the seven widgets in the order in §16.4.
- §15 SEO meta + shared OG image.

### 18.3 Not yet decided

- Whether the home page CTA section should also include a "Read me a quick story" entry point that links to the Architecture 101 module. Defer until first user feedback.
- Whether the calibration session score (predicted vs. recommended counter) should persist across sessions in any form. Default for now: in-memory only.

---

## 19. Disclaimer (verbatim)

This text appears in two places: the footer's optional bottom strip on every page (italic, 11.5px, 0.85 opacity) and the methodology page (Section 9, plain rendering).

> This tool provides directional job architecture education and a directional level recommendation based on general market practices. It is intended for guidance only and should be used alongside internal calibration, licensed market data, and professional judgment. It does not reproduce proprietary Radford, Mercer, WTW, or other survey-provider methodology, and it is not a compensation, legal, compliance, or final decision engine.

---

*Last updated: 2026-04-30. This spec drives the next development push and replaces all earlier toolkit specs in this directory.*
