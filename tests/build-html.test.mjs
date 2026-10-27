import assert from 'node:assert/strict';
import test from 'node:test';

import { renderHtml } from '../scripts/build-html.mjs';
import { buildPlan } from '../scripts/plan-data.mjs';


test('HTML plan includes event, schedule, budget and risk evidence', () => {
  const plan = buildPlan();
  const html = renderHtml(plan);
  assert.match(html, /计算机学院2026级篮球迎新杯/);
  assert.match(html, /当天流程/);
  assert.match(html, new RegExp(`¥${plan.budget.total.toLocaleString('zh-CN')}`));
  assert.match(html, /风险预案/);
  assert.match(html, /新生第一场，从并肩开始/);
});


test('HTML escapes business text', () => {
  const plan = buildPlan();
  plan.brief.name = '<script>alert(1)</script>';
  const html = renderHtml(plan);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
