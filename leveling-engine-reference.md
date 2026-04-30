# Leveling Engine Reference

Code-truth documentation for the directional leveling engine. Source files:

- `src/lib/leveling.ts` — scoring, confidence, boundary detection, flags, output
- `src/data/leveling.ts` — role types, dimensions, level codes, level names

This file documents the engine **as currently implemented**. If the code changes, update this file in the same commit. The toolkit spec (`job-architecture-education-tool-spec.md`) defers to this document for math, level codes, dimension wording, and result fields.

---

## 1. Type model

From `src/data/leveling.ts`:

```ts
type RoleType = "ic" | "manager" | "executive";

type DimensionId =
  | "scope"
  | "complexity"
  | "autonomy"
  | "influence"
  | "knowledge"
  | "businessImpact"
  | "peopleLeadership"
  | "strategyOwnership";

type DimensionOption = {
  score: number;        // 1..7
  label: string;        // user-facing short option
  description: string;  // user-facing detail
};

type Dimension = {
  id: DimensionId;
  title: string;        // long form ("Scope of Impact")
  shortLabel: string;   // result-row label ("Scope")
  prompt: string;       // wizard question
  options: DimensionOption[];   // exactly 7, score 1..7
  appliesTo: "all" | "manager" | "executive";
};
```

From `src/lib/leveling.ts`:

```ts
type LevelRange = {
  code: keyof typeof levelNames;
  min: number;
  max: number;
};

type LevelingScores = Partial<Record<DimensionId, number>>;

type LevelingResult = {
  roleType: RoleType;
  coreAverage: number;            // rounded to 2dp
  weightedScore: number;          // rounded to 2dp
  levelCode: keyof typeof levelNames;  // "P4", "M3", "E2", etc.
  levelName: string;              // human-readable name
  confidence: "High" | "Medium" | "Low";
  standardDeviation: number;      // rounded to 2dp
  boundary: string | null;        // e.g. "P3/P4" or null
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
```

---

## 2. Role types

User picks from four cards on wizard step 1. The fourth (`unsure`) is a router only — it never reaches the scoring engine.

| `id` | Title | Body |
|---|---|---|
| `ic` | Individual Contributor | The role creates leverage through expertise, problem-solving, and influence without formal people leadership. |
| `manager` | People Manager | The role creates leverage through people systems, coaching, staffing, and accountable team outcomes. |
| `executive` | Executive | The role creates leverage through enterprise, regional, business unit, or functional strategy. |
| `unsure` | Not Sure | Use a two-question helper to decide whether the role is mostly expertise, management, or strategy. |

### "Not sure" helper *(wizard responsibility, not engine)*

`RoleType` in code is one of `"ic" | "manager" | "executive"`. The fourth card (`"unsure"`) lives only in the wizard's role-picker view (`roleTypeOptions`); it is not a value the engine accepts.

The wizard resolves an "unsure" pick to one of the three real role types using two yes/no questions before calling `calculateLevelingResult`:

1. **Does this role manage people?** Yes → manager track. No → continue.
2. **Does this role define strategy?** Yes → executive track. No → IC track.

The helper does not store its own answers. It just sets `roleType` before the dimension wizard begins.

---

## 3. Dimensions

Every role evaluates the **six core dimensions**. Manager track adds `peopleLeadership`. Executive track adds `strategyOwnership`. All options use a 7-point scale with score equal to position.

### 3.1 Scope of Impact (`scope`) — applies to all

Prompt: *What does the role reliably own?*

| Score | Option label | Description |
|---|---|---|
| 1 | Owns assigned tasks | Delivers defined work with close direction. |
| 2 | Owns a small workstream | Manages repeatable tasks or a narrow project area. |
| 3 | Owns projects | Delivers complete projects or a meaningful book of work. |
| 4 | Owns a product, process, or team outcome | Accountable for an ongoing area with visible business users. |
| 5 | Owns a function or major domain | Sets direction for a broad domain or operating area. |
| 6 | Owns multiple functions or regions | Connects outcomes across departments, regions, or business lines. |
| 7 | Owns enterprise-wide outcomes | Shapes outcomes that matter across the company. |

### 3.2 Problem Complexity (`complexity`) — applies to all

Prompt: *How ambiguous are the problems?*

| Score | Option label | Description |
|---|---|---|
| 1 | Clear and repeatable | Uses established instructions and known answers. |
| 2 | Mostly known | Applies existing playbooks with occasional judgment. |
| 3 | Varied but familiar | Adapts known approaches to different situations. |
| 4 | Ambiguous within a domain | Solves problems where tradeoffs and root causes are not obvious. |
| 5 | Cross-functional and uncertain | Balances competing goals across teams or systems. |
| 6 | Novel or high-risk | Creates new approaches where precedent is limited. |
| 7 | Enterprise-defining | Solves strategic problems with long-term or company-wide consequences. |

### 3.3 Autonomy (`autonomy`) — applies to all

Prompt: *How independently does the role operate?*

| Score | Option label | Description |
|---|---|---|
| 1 | Needs regular direction | Manager defines priorities, methods, and checkpoints. |
| 2 | Works with frequent guidance | Owns tasks but needs help choosing approach. |
| 3 | Works independently on known work | Needs guidance for new or sensitive situations. |
| 4 | Sets approach for a domain | Translates goals into plans with periodic alignment. |
| 5 | Sets priorities within broad goals | Operates with broad direction and handles tradeoffs. |
| 6 | Defines direction for others | Creates operating plans and standards for multiple teams. |
| 7 | Sets enterprise direction | Shapes goals, choices, and risk posture with limited precedent. |

### 3.4 Influence (`influence`) — applies to all

Prompt: *Whose decisions does the role change?*

| Score | Option label | Description |
|---|---|---|
| 1 | Immediate team | Influences day-to-day work with close peers. |
| 2 | Adjacent partners | Coordinates with common partners or internal customers. |
| 3 | Project stakeholders | Builds alignment across several teams for project outcomes. |
| 4 | Cross-functional leaders | Shapes decisions across functions without direct authority. |
| 5 | Senior leaders in a domain | Influences investment, standards, or operating choices. |
| 6 | Business unit or regional leaders | Aligns leaders across major parts of the business. |
| 7 | Enterprise, board, or external market | Influences company direction, external partners, or governance bodies. |

### 3.5 Knowledge Depth (`knowledge`) — applies to all

Prompt: *What depth of expertise does the role require?*

| Score | Option label | Description |
|---|---|---|
| 1 | Basic job knowledge | Learns core tools, processes, and terminology. |
| 2 | Working knowledge | Applies common methods with guidance. |
| 3 | Solid professional knowledge | Handles common situations independently. |
| 4 | Advanced domain knowledge | Solves difficult problems and coaches others. |
| 5 | Deep subject-matter expertise | Sets standards and is sought out for judgment. |
| 6 | Recognized functional authority | Defines practices across a broad domain or company area. |
| 7 | Market-shaping expertise | Recognized inside and outside the company for rare expertise. |

### 3.6 Business Impact (`businessImpact`) — applies to all

Prompt: *How direct and material is the business impact?*

| Score | Option label | Description |
|---|---|---|
| 1 | Limited direct impact | Impact is mainly on individual task quality. |
| 2 | Team operating impact | Improves team throughput, quality, or service. |
| 3 | Project or customer impact | Affects project delivery, customer experience, or process quality. |
| 4 | Domain results | Impacts a product, function, budget, or operating metric. |
| 5 | Major business outcomes | Influences revenue, cost, risk, scale, or talent outcomes. |
| 6 | Multi-function or regional outcomes | Material impact across major business areas. |
| 7 | Enterprise value or risk | Direct impact on company strategy, enterprise risk, or long-term value. |

### 3.7 People Leadership (`peopleLeadership`) — manager track only

Prompt: *What people system does the role own?*

| Score | Option label | Description |
|---|---|---|
| 1 | Coordinates work only | May guide tasks but does not own people outcomes. |
| 2 | Leads a small team informally | Provides daily guidance with limited formal accountability. |
| 3 | Manages a team | Owns hiring input, coaching, goals, and performance routines. |
| 4 | Manages managers or a large team | Builds team systems and handles resource tradeoffs. |
| 5 | Leads a function area | Owns talent strategy, succession, and operating rhythm for a major area. |
| 6 | Leads multiple functions or regions | Builds leadership capacity across broad organizations. |
| 7 | Shapes enterprise leadership system | Defines executive-level organization, talent, and culture choices. |

### 3.8 Strategy Ownership (`strategyOwnership`) — executive track only

Prompt: *What strategy does the role own?*

| Score | Option label | Description |
|---|---|---|
| 1 | Executes strategy | Turns defined strategy into plans. |
| 2 | Influences local strategy | Provides input to a function or market plan. |
| 3 | Owns a narrow strategy area | Sets direction for a product, segment, or region area. |
| 4 | Owns functional strategy | Defines strategy for a major function or business domain. |
| 5 | Owns business unit strategy | Sets strategy across major revenue, region, or portfolio outcomes. |
| 6 | Owns multi-business strategy | Connects strategy across regions, functions, or business lines. |
| 7 | Owns enterprise strategy | Shapes company direction, portfolio choices, and long-term risk. |

---

## 4. Level structure

17 level codes total. Names come from `levelNames` in `src/data/leveling.ts`.

### IC track — P1 to P7

| Code | Name |
|---|---|
| P1 | Entry |
| P2 | Developing |
| P3 | Proficient |
| P4 | Advanced |
| P5 | Expert |
| P6 | Principal |
| P7 | Distinguished |

### Manager track — M2 to M6

There is no M1 by design. Companies that need a "team lead" tier use M2.

| Code | Name |
|---|---|
| M2 | Team Lead |
| M3 | Manager |
| M4 | Senior Manager |
| M5 | Director |
| M6 | Senior Director |

### Executive track — E1 to E5

| Code | Name |
|---|---|
| E1 | VP |
| E2 | Regional VP |
| E3 | SVP |
| E4 | EVP |
| E5 | C-Level |

---

## 5. Score-to-level mapping

Implemented as `levelMaps` in `src/lib/leveling.ts`. Mapping uses the **rounded** weighted score (1 decimal place) and is inclusive on both ends.

### IC mapping

| Weighted score | Level |
|---|---|
| 1.0 — 1.7 | P1 Entry |
| 1.8 — 2.4 | P2 Developing |
| 2.5 — 3.2 | P3 Proficient |
| 3.3 — 4.0 | P4 Advanced |
| 4.1 — 4.8 | P5 Expert |
| 4.9 — 5.6 | P6 Principal |
| 5.7 — 7.0 | P7 Distinguished |

### Manager mapping

| Weighted score | Level |
|---|---|
| 1.0 — 2.2 | M2 Team Lead |
| 2.3 — 3.4 | M3 Manager |
| 3.5 — 4.6 | M4 Senior Manager |
| 4.7 — 5.8 | M5 Director |
| 5.9 — 7.0 | M6 Senior Director |

### Executive mapping

| Weighted score | Level |
|---|---|
| 1.0 — 2.2 | E1 VP |
| 2.3 — 3.4 | E2 Regional VP |
| 3.5 — 4.6 | E3 SVP |
| 4.7 — 5.8 | E4 EVP |
| 5.9 — 7.0 | E5 C-Level |

---

## 6. Scoring formulas

Step 1: **Core average** is the unweighted mean of the six core dimensions.

```text
coreAverage = mean(scope, complexity, autonomy, influence, knowledge, businessImpact)
```

Step 2: **Weighted score** depends on track.

```text
IC:         weightedScore = coreAverage
Manager:    weightedScore = (coreAverage * 0.8) + (peopleLeadership   * 0.2)
Executive:  weightedScore = (coreAverage * 0.7) + (strategyOwnership * 0.3)
```

Step 3: Round to 1 decimal place, then look up the level using the table above.

---

## 7. Confidence model

Computed from the **standard deviation** of every required dimension score (six for IC, seven for manager / executive). Population standard deviation, not sample.

| Std dev | Confidence |
|---|---|
| ≤ 0.5 | High |
| 0.5 < σ ≤ 1.2 | Medium |
| > 1.2 | Low |

The result rounds the std dev to 2 decimal places when displayed.

---

## 8. Boundary detection

If the unrounded weighted score is within **±0.2** of any adjacent-level threshold, the result returns the adjacent pair as `boundary`. Format is `"P3/P4"`, `"M3/M4"`, etc. If no threshold is within range, `boundary` is `null`.

The boundary is informational. The primary `levelCode` is still the band the score actually falls into.

---

## 9. Sanity flags

Flags are informational. They never block a result. The engine evaluates them in this order and pushes any matches into `flags[]`:

1. **Autonomy ≥ 6 and complexity ≤ 3** → "Autonomy is very high while complexity is low. Confirm whether the role is truly independent or simply lightly supervised."
2. **People leadership ≥ 6 and scope ≤ 3** → "People leadership is very high while scope is narrow. Confirm team scale and organizational reach."
3. **Executive selected and strategy ownership ≤ 3** → "Executive track was selected, but strategy ownership is low. Confirm whether this is an executive role or a senior management role."
4. **Score spread ≥ 3 across required dimensions** → "Scores vary widely across dimensions. The role may be a hybrid, a stretch assignment, or a boundary case."
5. Else if **std dev > 1.2** → "Scores vary widely across dimensions. Review the highest and lowest scores before using the recommendation."

Flags 4 and 5 are mutually exclusive; the wider-spread message wins when both would fire.

**Implementation note:** Flag 2 (people leadership) reads `scores.peopleLeadership` directly without checking `roleType`. If the wizard accidentally passes a `peopleLeadership` score on an IC or executive track, this flag can still fire. The wizard is responsible for only sending scores for the dimensions returned by `requiredDimensionIds(roleType)`.

---

## 10. Result fields

The `LevelingResult` object returned by `calculateLevelingResult(roleType, scores)`:

| Field | Source | Notes |
|---|---|---|
| `roleType` | input | "ic", "manager", or "executive" |
| `coreAverage` | computed | rounded to 2dp |
| `weightedScore` | computed | rounded to 2dp |
| `levelCode` | mapped | "P4", "M3", "E2", etc. |
| `levelName` | `levelNames[code]` | "Advanced", etc. |
| `confidence` | std-dev-derived | "High" / "Medium" / "Low" |
| `standardDeviation` | computed | rounded to 2dp |
| `boundary` | computed | e.g. "P3/P4" or null |
| `flags` | rule-based | up to four strings if extraneous dimension scores are passed; up to three when input is well-formed |
| `explanation` | template-driven | see §11 |
| `moveUp` | template-driven | see §12 |
| `moveDown` | template-driven | see §12 |
| `calibrationPrompt` | constant | the same sentence for every result |
| `dimensionRows` | from scores | list of `{ id, label, score }` |

Constant `calibrationPrompt`:

> Compare this role to two known roles in your organization: one clearly below this level and one clearly above it. Does the scope, independence, and impact still line up?

---

## 11. Explanation generation

The engine sorts `dimensionRows` by score, takes the top two as `strengths`, the bottom two as `constraints`, then picks one of three templates based on `confidence`:

- **High confidence:** "The pattern points cleanly to ${level}. The strongest evidence is ${strengths}, and the other dimensions are reasonably aligned."
- **Medium confidence:** "The pattern points to ${level}, with the strongest evidence in ${strengths}. The main calibration tension is ${constraints}, so compare this role to adjacent levels before finalizing."
- **Low confidence:** "The pattern points directionally to ${level}, but the score spread is wide. The role shows high ${strengths} while ${constraints} are materially lower, which makes this a calibration case."

`strengths` and `constraints` are joined with " and " using the dimension's `shortLabel` lowercased.

---

## 12. Move-up / move-down generation

### Move up

Filters dimension rows to those scoring `< 6`, sorts ascending, takes the bottom two.

- **Manager track and one of the bottom two is `peopleLeadership`** → "Clearer ownership of people outcomes, larger team scale, and broader cross-functional operating impact."
- **Executive track and one of the bottom two is `strategyOwnership`** → "Durable ownership of business or enterprise strategy, including resource choices and measurable outcomes."
- **Otherwise** → "Broader ${dimA} and ${dimB} would make the next level more credible."

### Move down

Filters dimension rows to those scoring `> 2`, sorts descending, takes the top two.

> "Reduced ${dimA} and ${dimB} would point to a lower level."

### Sort and edge-case behavior

- **Tie order.** `Array.prototype.sort` is stable in modern JavaScript, so when two dimensions tie on score, the relative order from `dimensionRows` (which follows `requiredDimensionIds`) is preserved. The `requiredDimensionIds` order is: scope, complexity, autonomy, influence, knowledge, businessImpact, then peopleLeadership or strategyOwnership.
- **All scores ≥ 6.** Move-up filter is empty. Output renders as `"Broader  would make the next level more credible."` with the empty join. Treat this as a "ceiling reached" signal and rewrite the copy in the wizard rather than relying on the engine string.
- **All scores ≤ 2.** Move-down filter is empty. Same empty-string outcome. Same fix.
- **Single qualifying row.** The join produces a single label without "and" — for example `"Reduced influence would point to a lower level."` This is intentional and reads naturally.

Both copy templates use the dimension `shortLabel` lowercased.

---

## 13. Summary text format

`buildSummaryText(result)` returns a plain-text block as a single string with `\n` line separators. Order and labels are fixed. Numbers are interpolated via JavaScript template literals (no fixed decimal places — `4.0` prints as `4`, `3.83` prints as `3.83`):

```text
Job Architecture Toolkit - Leveling Summary

Recommended level: <code> - <name>
Role type: <Individual Contributor | People Manager | Executive>
Weighted score: <number>
Core average: <number>
Confidence: <High|Medium|Low>
Boundary: <pair or "None">

Dimension scores:
- <Label>: <score>
... one row per required dimension

Explanation:
<explanation>

What would move it up:
<moveUp>

What would move it down:
<moveDown>

Calibration prompt:
<calibrationPrompt>

Flags:
- <flag>
... or "- None" if there are none

Disclaimer:
This tool provides a directional job level recommendation based on general
market practices. It is intended for guidance only and should be used
alongside internal calibration and judgment. It does not reproduce
proprietary Radford, Mercer, WTW, or other survey-provider methodology.
```

`buildSummaryText` returns text only. Wrapping the string into a downloadable file (filename, MIME type, blob construction) is the wizard component's responsibility.

---

## 14. Constants and defaults

- **Score domain (intended).** Integer 1..7. The wizard only ever produces values in this range.
- **Score domain (engine actual).** The engine does **not** validate. It accepts any truthy `number` (decimals, negatives, values above 7) and only throws when a required dimension's score is falsy (`undefined`, `null`, `0`, `NaN`). Treat this as wizard-side validation responsibility, not engine responsibility.
- **Output rounding:** `roundTo(value, 2)` for surfaced numbers (`coreAverage`, `weightedScore`, `standardDeviation`); `roundTo(value, 1)` for the score used to look up the level band.
- **Standard deviation:** population formula (`sum((x - mean)^2) / n`, then sqrt), not sample.
- **Boundary tolerance:** ±0.2 (inclusive) on the **unrounded** weighted score, compared against the `min` of each non-first band.
- **Flag thresholds:** integers (≤3, ≥6, ≥3 spread). Not configurable.

---

## 15. Edge cases and tie-breaks

| Situation | Behavior |
|---|---|
| Weighted score below the lowest band's `min` | Returns the lowest band (P1, M2, or E1). No flag added. |
| Weighted score above the highest band's `max` | Returns the highest band (P7, M6, or E5). No flag added. |
| Score on a band edge (e.g. exactly 4.0 for IC) | Falls into the lower-numbered band per `>=` / `<=` inclusive logic. |
| Within ±0.2 of two thresholds at once | Returns the **first** boundary pair found in ascending order. |
| Required dimension missing from input | `calculateLevelingResult` throws. The wizard must validate before calling. |
| Score is `0`, `null`, or `undefined` | Engine throws `Missing score: <id>`. Treat 0 as missing — the engine does. |
| Score is a decimal, negative, or above 7 | Engine accepts it without validation. Wizard must clamp to integer 1..7. |
| Extra dimension scores passed (e.g. `peopleLeadership` on an IC) | Engine ignores them in scoring but flag 2 may still inspect them. Wizard should only send required dimensions. |
| `roleType === "unsure"` | Never reaches the engine. The wizard resolves to `ic` / `manager` / `executive` first. |
| Duplicate flags | Each flag rule fires at most once per result. Flags 4 and 5 are mutually exclusive (4 wins). |
| All dimension scores ≥ 6 | `moveUp` returns an empty-join string (`"Broader  would make..."`). Wizard should override with a "ceiling reached" message. |
| All dimension scores ≤ 2 | `moveDown` returns an empty-join string. Same wizard override. |

---

## 16. Worked examples

### 16.1 Clean IC

Inputs: scope 4, complexity 4, autonomy 4, influence 3, knowledge 4, businessImpact 4.

- coreAverage = 23 / 6 ≈ 3.833
- weightedScore = 3.833 (IC)
- Boundary check uses the **unrounded** weightedScore. Thresholds are 1.8, 2.5, 3.3, 4.1, 4.9, 5.7. |3.833 − 4.1| = 0.267 → no boundary fires.
- Lookup uses `roundTo(weightedScore, 1)` = 3.8 → **P4 Advanced** (band 3.3..4.0).
- Std dev across the six required scores ≈ 0.37 → **High confidence**
- Flags: none
- Explanation template: "high confidence" path

### 16.2 Manager boundary

A boundary requires a weighted score within 0.2 of an M-track threshold (2.3, 3.5, 4.7, or 5.9). With six integer dimension scores, `coreAverage` is a multiple of 1/6 (so 3.0, 3.17, 3.33, 3.5, 3.67, 3.83, 4.0, ...). Add the manager-track weighting and the math gets exact.

Inputs: scope 3, complexity 3, autonomy 3, influence 4, knowledge 4, businessImpact 3, peopleLeadership 4.

- coreAverage = 20 / 6 ≈ 3.333
- weightedScore = (3.333 × 0.8) + (4 × 0.2) ≈ 2.667 + 0.8 = **3.467**
- Boundary check: |3.467 − 3.5| ≈ 0.033 → **boundary fires: M3/M4**.
- Lookup uses `roundTo(3.467, 1)` = 3.5 → **M4 Senior Manager** (band 3.5..4.6).
- Std dev across seven required scores ≈ 0.49 → **High confidence**
- Flags: none

### 16.3 Flag-trigger executive

Inputs: scope 6, complexity 5, autonomy 7, influence 6, knowledge 6, businessImpact 6, strategyOwnership 2.

- coreAverage = 36 / 6 = 6.000
- weightedScore = (6.000 × 0.7) + (2 × 0.3) = 4.20 + 0.60 = **4.80**
- Boundary check: |4.80 − 4.7| = 0.10 → **boundary fires: E3/E4**.
- Lookup uses `roundTo(4.80, 1)` = 4.8 → **E4 EVP** (band 4.7..5.8).
- Std dev across seven scores ≈ **1.50** → **Low confidence**
- Flags fire:
  - Executive selected and strategyOwnership ≤ 3 → fires.
  - Score spread = 7 − 2 = 5 ≥ 3 → fires.
  - Std dev > 1.2 → does **not** fire because flag 4 (spread) preempts flag 5.

Result: levelCode E4, levelName "EVP", boundary "E3/E4", confidence Low, two flags, explanation uses the low-confidence template.

---

## 17. Sample LevelingResult JSON

```json
{
  "roleType": "ic",
  "coreAverage": 3.83,
  "weightedScore": 3.83,
  "levelCode": "P4",
  "levelName": "Advanced",
  "confidence": "High",
  "standardDeviation": 0.37,
  "boundary": null,
  "flags": [],
  "explanation": "The pattern points cleanly to P4. The strongest evidence is scope and complexity, and the other dimensions are reasonably aligned.",
  "moveUp": "Broader influence and scope would make the next level more credible.",
  "moveDown": "Reduced scope and complexity would point to a lower level.",
  "calibrationPrompt": "Compare this role to two known roles in your organization: one clearly below this level and one clearly above it. Does the scope, independence, and impact still line up?",
  "dimensionRows": [
    { "id": "scope",          "label": "Scope",      "score": 4 },
    { "id": "complexity",     "label": "Complexity", "score": 4 },
    { "id": "autonomy",       "label": "Autonomy",   "score": 4 },
    { "id": "influence",      "label": "Influence",  "score": 3 },
    { "id": "knowledge",      "label": "Knowledge",  "score": 4 },
    { "id": "businessImpact", "label": "Impact",     "score": 4 }
  ]
}
```

---

## 18. Sync requirements

When the engine code or data changes, the same commit must update this file. The most common drift points:

- Adding a dimension or changing option labels → update §3 tables.
- Changing weights or formulas → update §6.
- Changing band ranges → update §5.
- Changing flag thresholds or wording → update §9.
- Renaming a result field → update §10 + §17.
- Changing the summary-text format → update §13.

Reviewers should check this file alongside any PR that touches `src/lib/leveling.ts` or `src/data/leveling.ts`.
