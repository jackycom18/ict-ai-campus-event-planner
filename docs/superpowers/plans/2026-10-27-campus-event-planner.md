# AI Campus Event Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a reproducible six-agent campus event planning package with HTML, XLSX, PPTX and evidence files.

**Architecture:** A deterministic planner reads one event brief and produces structured plan, budget, risk and promotion data. Artifact builders render those data into final files and a validator checks totals, structure and required content.

**Tech Stack:** Node.js, `@oai/artifact-tool`, Python `reportlab`, Node test runner.

## Global Constraints

- Activity budget must not exceed CNY 30,000.
- All final outputs live in `Agent办公实践AI校园活动策划团队实践作品`.
- No external model calls or paid cloud resources are required.
- Final repository is reproducible with local commands.
- Every custom function has 功能、输入、输出 documentation.

---

### Task 1: Event Brief and Agent Team

**Files:**
- Create: `data/event-brief.json`
- Create: `agents/team.yaml`
- Create: five files under `agents/skills/*/SKILL.md`
- Test: `tests/validate_event_data.mjs`

**Interfaces:**
- Brief contains event identity, date, venue, capacity, budget cap and goals.
- Team YAML maps each agent to one deliverable.

- [ ] Write the event brief and team roles.
- [ ] Test that every agent output is declared and the budget cap is positive.
- [ ] Commit `feat: define event brief and agent team`.

### Task 2: Planning Data Builders

**Files:**
- Create: `scripts/plan-data.mjs`
- Create: `tests/plan-data.test.mjs`

**Interfaces:**
- `buildPlan(brief)` returns `{ schedule, format, staffing, promotions }`.
- `buildBudget(brief)` returns categories and computed totals.
- `buildRisks(brief)` returns at least ten ranked risks.

- [ ] Write tests for 8-team brackets, required schedule blocks, budget cap and risk count.
- [ ] Run `node --test tests/plan-data.test.mjs` and observe missing module failure.
- [ ] Implement pure functions in `scripts/plan-data.mjs`.
- [ ] Run tests; expect pass.
- [ ] Commit `feat: add event planning data builders`.

### Task 3: HTML Event Plan

**Files:**
- Create: `scripts/build-html.mjs`
- Create: `tests/build-html.test.mjs`
- Output: `Agent办公实践AI校园活动策划团队实践作品/校园篮球迎新杯活动策划方案.html`

**Interfaces:**
- Consumes `buildPlan`, `buildBudget`, `buildRisks`.
- Produces one self-contained HTML file with inline CSS.

- [ ] Test that output contains event title, schedule table, budget total and risk table.
- [ ] Implement the self-contained event brief page.
- [ ] Run tests and browser screenshot.
- [ ] Commit `feat: generate event plan HTML`.

### Task 4: Budget and Risk Workbooks

**Files:**
- Create: `scripts/build-workbooks.mjs`
- Output: `预算测算表.xlsx`
- Output: `风险评估预案.xlsx`

**Interfaces:**
- Budget sheet uses typed currency values and a total formula.
- Risk sheet contains risk ID, category, probability, impact, level, owner and response.

- [ ] Create a workspace `node_modules` junction to the bundled artifact runtime.
- [ ] Run the required artifact-operation marker for two XLSX outputs.
- [ ] Build both workbooks with explicit formats and formulas.
- [ ] Recalculate, inspect key ranges, scan errors and render previews.
- [ ] Commit `feat: generate budget and risk workbooks`.

### Task 5: Promotion Deck

**Files:**
- Create: `scripts/build-deck.mjs`
- Output: `校园篮球迎新杯宣传方案.pptx`

- [ ] Build six editable slides covering hook, event facts, schedule, teams, promotion and call to action.
- [ ] Use the field-scoreboard visual system and native text/table/chart objects.
- [ ] Render every slide and fix clipping or overlap.
- [ ] Finalize and validate the PPTX.
- [ ] Commit `feat: generate event promotion deck`.

### Task 6: Knowledge PDFs and Archive

**Files:**
- Create: `scripts/build_pdfs.py`
- Create: `scripts/archive_work.py`
- Output: four PDF files under `knowledge/`
- Output: conversation Markdown and `readme.md` under the final work folder.

- [ ] Generate four concise knowledge documents with reportlab.
- [ ] Render every PDF page to PNG and inspect.
- [ ] Assemble the six-file submission archive.
- [ ] Commit `docs: add knowledge base and submission archive`.

### Task 7: Final Validation and Submission

**Files:**
- Create: `tests/validate_outputs.mjs`
- Create: `reports/test-report.md`
- Create: `README.md`
- Create: `docs/PROJECT_MEMO.md`
- Create: `docs/CODE_MAP.md`

- [ ] Verify all six required deliverables exist and are non-empty.
- [ ] Verify budget total is within the limit.
- [ ] Verify PPTX slide count and XLSX worksheet presence.
- [ ] Run all tests and record results.
- [ ] Commit `docs: finalize campus event planner`.
- [ ] Create public GitHub repository and submit competition work.
