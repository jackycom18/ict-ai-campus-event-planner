import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildPlan } from '../scripts/plan-data.mjs';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');


/**
 * 功能：列出 ZIP 包中的文件路径。
 * 输入：filePath 为 XLSX 或 PPTX 路径。
 * 输出：规范的 POSIX 路径数组。
 */
function listZipEntries(filePath) {
  return execFileSync('tar', ['-tf', filePath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .map((entry) => entry.replaceAll('\\', '/'));
}


test('submission archive contains all six required deliverables', () => {
  const required = [
    'Agent办公实践AI校园活动策划团队实践.md',
    'readme.md',
    '校园篮球迎新杯活动策划方案.html',
    '预算测算表.xlsx',
    '风险评估预案.xlsx',
    '校园篮球迎新杯宣传方案.pptx',
  ];
  for (const name of required) {
    const filePath = path.join(OUTPUT_DIR, name);
    assert.ok(fs.existsSync(filePath), `${name} should exist`);
    assert.ok(fs.statSync(filePath).size > 500, `${name} should not be empty`);
  }
});


test('HTML contains schedule, budget and risk sections', () => {
  const html = fs.readFileSync(path.join(OUTPUT_DIR, '校园篮球迎新杯活动策划方案.html'), 'utf8');
  assert.match(html, /当天流程/);
  assert.match(html, /预算测算/);
  assert.match(html, /风险预案/);
  assert.ok(buildPlan().budget.total <= 30000);
});


test('workbooks contain expected worksheet payloads', () => {
  const budgetEntries = listZipEntries(path.join(OUTPUT_DIR, '预算测算表.xlsx'));
  const riskEntries = listZipEntries(path.join(OUTPUT_DIR, '风险评估预案.xlsx'));
  assert.ok(budgetEntries.some((entry) => entry.endsWith('/sheet1.xml')));
  assert.ok(riskEntries.some((entry) => entry.endsWith('/sheet1.xml')));
});


test('presentation contains six slides', () => {
  const entries = listZipEntries(path.join(OUTPUT_DIR, '校园篮球迎新杯宣传方案.pptx'));
  const slides = entries.filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry));
  assert.equal(slides.length, 6);
});
