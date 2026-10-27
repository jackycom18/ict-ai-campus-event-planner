import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_BRIEF,
  buildBudget,
  buildFormat,
  buildPlan,
  buildRisks,
  buildSchedule,
  riskLevel,
} from '../scripts/plan-data.mjs';


test('eight teams produce two groups and a four-team knockout', () => {
  const format = buildFormat(DEFAULT_BRIEF);
  assert.equal(format.groups.length, 2);
  assert.equal(format.groupSize, 4);
  assert.match(format.semifinal, /A1/);
});


test('schedule covers setup through cleanup', () => {
  const schedule = buildSchedule();
  assert.equal(schedule[0].item, '签到与场地布置');
  assert.equal(schedule.at(-1).item, '清点与撤场');
  assert.ok(schedule.length >= 8);
});


test('budget total remains below the cap and includes contingency', () => {
  const budget = buildBudget();
  assert.ok(budget.total <= DEFAULT_BRIEF.budgetCap);
  assert.ok(budget.remaining >= 0);
  assert.ok(budget.items.some((item) => item.category === '应急预备金'));
});


test('risk levels follow the documented score thresholds', () => {
  assert.equal(riskLevel(4, 4), 'high');
  assert.equal(riskLevel(3, 3), 'medium');
  assert.equal(riskLevel(1, 2), 'low');
  assert.ok(buildRisks().length >= 10);
});


test('combined plan contains all five agent outputs', () => {
  const plan = buildPlan();
  assert.ok(plan.schedule.length > 0);
  assert.ok(plan.format.teamCount === 8);
  assert.ok(plan.staffing.length > 0);
  assert.ok(plan.budget.items.length > 0);
  assert.ok(plan.risks.length > 0);
  assert.ok(plan.promotion.messages.length > 0);
});
