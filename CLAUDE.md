# Job Architecture Toolkit

A standalone Next.js app for job architecture education and directional job
leveling. It is designed for HRBPs, managers, and Total Rewards leaders who
need a credible way to explain job architecture, prepare better leveling
intake, and run calibration conversations.

## Spec (source of truth — read in order)

1. [`job-architecture-education-tool-spec.md`](./job-architecture-education-tool-spec.md) — primary build spec. Sections cover purpose, voice, visual system, IA, state, content/widget data model, architecture explorer, path selector, education modules, wizard UX, calibration lab, glossary, methodology, widget catalog, source attribution, SEO, implementation mapping, and disclaimer.
2. [`leveling-engine-reference.md`](./leveling-engine-reference.md) — code-truth doc for `src/lib/leveling.ts` and `src/data/leveling.ts`. Math, level codes, scoring formulas, edge cases, worked examples. Update this in the same commit as any engine code change.
3. [`/srv/projects/SIBLING_TOOL_PATTERN.md`](../SIBLING_TOOL_PATTERN.md) — chrome and visual baseline shared across `*.arminoorata.com` tools.
4. [`/srv/.claude/writing_rules.md`](../../.claude/writing_rules.md) — voice rules every line of user-facing copy must pass.

## Product posture

- Use public Aon/Radford job architecture concepts as the positive market
  example.
- Do not copy proprietary Radford, Mercer, WTW, or other survey-provider level
  guides, job descriptions, point-factor methods, or licensed content.
- Position Radford/Aon as the recommended licensed source for production job
  matching, market pricing, peer groups, and formal methodology.
- Keep the leveling tool directional. It is not a compensation or final decision
  engine.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Static, client-side calculations
- No backend and no login

## Key routes

- `/` - overview and architecture explorer
- `/learn` - manager education modules
- `/leveling` - directional level classification wizard
- `/calibration` - scenario-based calibration lab
- `/glossary` - plain-language architecture terms
- `/methodology` - sources, scoring model, and limitations

## Visual system

This is a sibling tool for `*.arminoorata.com`. Follow
`/srv/projects/SIBLING_TOOL_PATTERN.md`:

- Gilt palette
- Outfit and JetBrains Mono
- dark default theme
- eyebrow brand header
- 9-dot nav menu
- footer attribution and disclaimer
