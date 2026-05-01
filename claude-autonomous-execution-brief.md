# Claude Autonomous Execution Brief

## Assignment

You are the autonomous implementation lead for `/srv/projects/jobarchitecture`.

Execute the full improvement plan for `jobarchitecture.arminoorata.com` without pausing for user review. The product is a public Job Architecture Toolkit: an education-first, directional leveling and calibration tool for managers, HRBPs, and Total Rewards leaders.

You must preserve and improve the current working functionality. Do not break routes, scoring, export, metadata, theme behavior, navigation, or existing content that is already working well.

You may involve Armi only when he physically needs to do something outside the repo, such as creating a GitHub project, connecting a Vercel domain, providing credentials, or approving a legal/business decision that cannot be responsibly inferred.

---

## Required Operating Mode

Act like an implementation lead, not a brainstorming partner.

- Make decisions.
- Execute all phases.
- Keep the app working at every checkpoint.
- Use the existing app as the base. Improve it, do not replace it.
- Do not ask Armi preference questions during execution.
- Do not stop after planning.
- Do not leave TODO placeholders when the work can be completed.
- Do not remove current functionality unless a replacement is already implemented and verified.
- Do not use proprietary Radford, Mercer, WTW, or other licensed survey-provider content.
- Do not imply Radford/Aon endorsement or affiliation.

If a choice is ambiguous, choose the option that best supports: manager learning, Total Rewards credibility, privacy, and non-regression.

---

## Current Product Frame

The site should feel like:

> A free public education and directional leveling toolkit for managers, HRBPs, and Total Rewards leaders.

The hierarchy is:

1. Education first.
2. Leveling wizard second.
3. Calibration practice third.
4. Methodology and source transparency always available.

Equity teaches users by helping them understand their own grant. Job Architecture should teach users by helping them understand their own role decision.

---

## Source Of Truth

Read these before editing:

1. `/srv/projects/jobarchitecture/CLAUDE.md`
2. `/srv/projects/jobarchitecture/job-architecture-education-tool-spec.md`
3. `/srv/projects/jobarchitecture/leveling-engine-reference.md`
4. `/srv/projects/SIBLING_TOOL_PATTERN.md`
5. `/srv/.claude/writing_rules.md`

Update the relevant docs if implementation changes the product behavior, route structure, scoring model, or source posture.

---

## Codex Plugin Requirement

Use the Codex plugin as a mandatory peer review and alignment partner at natural phase gates.

Claude owns execution. Codex is a reviewer, implementation critic, and second set of eyes. Do not treat Codex feedback as optional when it identifies a real defect or regression.

At each gate:

1. Send Codex the current phase goal, changed files, and specific risks to inspect.
2. Ask Codex to review for product fit, non-regression, accessibility, code quality, and alignment with the spec.
3. If Codex identifies critical or high-confidence issues, fix them.
4. Re-run the relevant verification.
5. Re-consult Codex when the fix materially changes the implementation.
6. Continue only when Claude and Codex align that the phase is ready.

Do not ask Armi to arbitrate normal implementation disagreements. Resolve them by reading the code, spec, and tests. Escalate only if the decision requires external business authority.

---

## Non-Regression Contract

Before changing behavior, establish a baseline.

Verify and preserve:

- `/`
- `/learn`
- `/learn/[id]`
- `/leveling`
- `/calibration`
- `/glossary`
- `/methodology`
- `/robots.txt`
- `/sitemap.xml`
- Theme toggle
- Header navigation
- Footer domain and disclaimer
- Leveling wizard role selection
- Dimension scoring
- Review step
- Result generation
- Boundary detection
- Confidence calculation
- Sanity flags
- Text summary export
- Radford/Aon source attribution and non-affiliation posture

Do not finish unless:

- `npm run lint` passes.
- `npm run build` passes.
- Any existing tests pass.
- Newly added tests pass.
- Key routes return 200 locally.
- The leveling wizard still completes from role selection to result.

---

## Improvement Strategy

The current product should move from “polished reference manual” toward “guided manager training.” Keep the enterprise credibility. Make the learning easier, faster, and more appealing.

### Learning Design Principles

Implement these across the product:

- Start with the user’s situation, not with theory.
- Teach through small decisions.
- Keep language manager-safe.
- Use simple visual anchors for abstract concepts.
- Make the wizard feel like applied learning.
- Add confidence-building moments.
- Make calibration predict-then-reveal.
- Keep methodology serious and source-backed.

Avoid corporate jargon flagged in `/srv/.claude/writing_rules.md`, especially “leverage,” “robust,” “stakeholders,” “pressure-test,” and “landscape.”

---

## Execution Phases

### Phase 0: Baseline And Risk Review

Goal: understand the current app and protect working behavior.

Actions:

- Run `npm run lint`.
- Run `npm run build`.
- Run existing tests if present.
- Inspect current routes and major components.
- Review `src/lib/leveling.ts`, `src/data/leveling.ts`, `leveling-engine-reference.md`, and the wizard UI.
- Record any existing gaps in the implementation notes you maintain during execution.

Codex gate:

- Ask Codex to review the current product against the brief and identify high-risk areas before edits.
- Align on the first implementation slice before modifying production behavior.

### Phase 1: Spec And IA Alignment

Goal: make the spec and app information architecture reflect the education-first product.

Actions:

- Update the spec if needed so it clearly prioritizes learning, then leveling, then calibration.
- Ensure `/` is the education-first front door.
- Ensure `/learn` supports guided paths based on user intent.
- Ensure `/leveling` is framed as applied learning, not a verdict.
- Ensure `/calibration` is framed as practice for real committee conversations.
- Update `CLAUDE.md` if new implementation rules are added.

Codex gate:

- Ask Codex whether the revised IA matches the equity-style education portal standard and preserves the current product frame.
- Fix any mismatch before coding deeper changes.

### Phase 2: Learning Experience Upgrade

Goal: make the learning content easier and more appealing for busy managers.

Actions:

- Add or improve a path selector using user situations, such as:
  - Level a new role
  - Prepare a promotion request
  - Explain job architecture to a manager
  - Calibrate a boundary case
  - Clean up titles or career paths
- Reorder modules based on the selected situation.
- Add small decision-based interactions inside learning modules where useful.
- Add or improve visual anchors:
  - Architecture stack
  - IC vs Manager vs Executive track comparison
  - Title vs level distinction
  - Adjacent-level boundary example
  - Pay range overlap or pay transparency readiness visual
- Preserve existing modules and routes unless replacing them with better complete versions.
- Keep copy short, practical, and human.

Codex gate:

- Ask Codex to review the learning flow for clarity, ease, voice, and non-regression.
- Iterate until the learning path feels easier than the current implementation.

### Phase 3: Leveling Wizard As Applied Learning

Goal: make the wizard teach while it scores.

Actions:

- Preserve the existing scoring engine unless the spec explicitly requires a change.
- Add brief “what this means” and “common mistake” guidance to dimensions where helpful.
- Improve the review step so users can understand their scoring pattern before submission.
- Improve results so they read as coaching:
  - Recommended level
  - Confidence
  - Boundary insight
  - Explanation
  - What would move it up
  - What would move it down
  - Questions HR will likely ask
  - Flags
  - Download summary
- Preserve the under-3-minute completion goal.
- Preserve text export.
- Do not add persistence for user inputs.

Codex gate:

- Ask Codex to review the wizard for scoring integrity, usability, result clarity, and accessibility.
- Fix any regression in wizard completion or output.

### Phase 4: Calibration Lab Upgrade

Goal: turn static cases into interactive practice.

Actions:

- Rebuild or improve calibration cases as predict-then-reveal.
- Let users choose a likely band before seeing the rationale.
- Show why the role is a boundary case.
- Add “what evidence would change the answer” prompts.
- Keep examples generic and non-proprietary.
- Avoid employee names and confidential org details.

Codex gate:

- Ask Codex to review whether the calibration lab teaches judgment rather than simply displaying examples.
- Iterate until Codex and Claude align.

### Phase 5: Methodology, Privacy, And Source Posture

Goal: make the site credible and safe for enterprise users.

Actions:

- Ensure methodology clearly explains:
  - Scoring
  - Confidence
  - Boundary detection
  - Flags
  - Limitations
  - Source attribution
  - Radford/Aon-friendly use
- Add explicit privacy guidance:
  - Do not enter employee names.
  - Do not enter compensation details.
  - Do not enter protected-class information.
  - Do not enter confidential reorg plans.
  - Inputs do not persist beyond the session.
- Keep Radford/Aon positive and clear:
  - This tool prepares managers for better architecture conversations.
  - Licensed Radford/Aon tools are the right place for formal market pricing, job matching, peer groups, and governance.
- Do not imply affiliation, sponsorship, endorsement, or licensed methodology access.

Codex gate:

- Ask Codex to review the methodology and source posture for legal, brand, and trust risks.
- Fix any language that could imply endorsement or proprietary reproduction.

### Phase 6: Tests And Engine Guardrails

Goal: make the scoring engine as protected as equity’s tax and vesting logic.

Actions:

- Add Vitest coverage for `src/lib/leveling.ts`.
- Cover:
  - IC score-to-level mapping
  - Manager weighting
  - Executive weighting
  - Boundary detection
  - High, medium, and low confidence
  - Sanity flags
  - Missing score behavior
  - Summary text generation
- Ensure `leveling-engine-reference.md` matches code behavior.
- Update docs and tests together if behavior changes.

Codex gate:

- Ask Codex to review the tests for meaningful coverage and blind spots.
- Add missing cases Codex identifies unless clearly unnecessary.

### Phase 7: Accessibility, Responsive UX, And Polish

Goal: make the final app easier to use on desktop and mobile.

Actions:

- Verify keyboard navigation for interactive components.
- Add `fieldset`, `legend`, `aria-live`, and descriptive labels where appropriate.
- Ensure text fits in cards, buttons, and mobile layouts.
- Respect `prefers-reduced-motion`.
- Keep the sibling Gilt visual system intact.
- Do not add decorative images, hero art, logos, or brand colors outside the sibling pattern.

Codex gate:

- Ask Codex to review accessibility, responsive layout, and sibling-pattern compliance.
- Fix concrete issues.

### Phase 8: Final Verification And Launch Readiness

Goal: leave the repo in a clean, working state.

Actions:

- Run `npm run lint`.
- Run `npm run build`.
- Run `npm test` if configured.
- Start the dev server.
- Check major routes return 200.
- Complete at least one full leveling wizard flow manually or with browser automation if available.
- Search for stale names:
  - `job-level.arminoorata.com`
  - `/srv/projects/job-level`
  - `"name": "job-level"`
- Confirm only appropriate references to “job leveling” remain as product terminology.
- Summarize changed files, verification results, and any remaining external steps.

Codex final gate:

- Ask Codex for a final release-readiness review.
- Fix critical/high-confidence findings.
- Re-run verification after fixes.
- Finish only when Claude and Codex align that the implementation is ready.

---

## Done Criteria

The work is complete only when all of these are true:

- All phases above are executed.
- Existing working functionality is preserved or improved.
- The app teaches through user situations and small decisions.
- The wizard still completes in under 3 minutes.
- The calibration lab is interactive and useful.
- The methodology is clear, sourced, and Radford/Aon-safe.
- The privacy posture is explicit.
- The scoring engine has meaningful tests.
- Lint, build, and tests pass.
- Codex has reviewed the natural phase gates and final state.
- Claude and Codex align that the implementation is ready.

---

## Prompt To Give Claude

Copy and paste this prompt into Claude:

```text
You are the autonomous implementation lead for `/srv/projects/jobarchitecture`.

Read and follow `/srv/projects/jobarchitecture/claude-autonomous-execution-brief.md` exactly. Execute every phase in the brief. Do not stop after planning. Do not ask me for direction unless I physically need to do something outside the repo, such as creating a GitHub project, connecting a Vercel domain, providing credentials, or approving an external business/legal decision that cannot be inferred from the repo.

Use the Codex plugin as a required peer review and alignment partner at every natural phase gate listed in the brief. Consult Codex, fix legitimate issues, re-run verification, and continue only when you and Codex align that the phase is ready. Do not ask me to arbitrate normal implementation choices.

Your priorities are:
1. Preserve existing working functionality.
2. Improve the product into an education-first Job Architecture Toolkit.
3. Make the learning experience easy and appealing for busy managers.
4. Keep the leveling wizard directional, fast, and useful.
5. Make calibration interactive.
6. Keep Radford/Aon positioning positive, sourced, and non-proprietary.
7. Add meaningful tests and final verification.

Operate with implementation-lead discipline. Make decisions, execute, verify, iterate with Codex, and report only when the full plan is complete or when I physically need to take an external action.
```
