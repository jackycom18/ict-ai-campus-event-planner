import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

import { buildPlan } from './plan-data.mjs';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');
const BUDGET_FILE = path.join(OUTPUT_DIR, '预算测算表.xlsx');
const RISK_FILE = path.join(OUTPUT_DIR, '风险评估预案.xlsx');
const FONT = 'Microsoft YaHei';
const INK = '#102A2A';
const ORANGE = '#D86D38';
const PAPER = '#F2EBDD';
const MINT = '#35B7A0';


/**
 * 功能：设置工作簿阅读区的基础样式。
 * 输入：workbook 为 Artifact Tool 工作簿对象。
 * 输出：无返回值。
 */
function applyWorkbookFont(workbook) {
  for (const sheet of workbook.worksheets.items) {
    sheet.showGridLines = false;
    sheet.tabColor = INK;
  }
}


/**
 * 功能：生成预算工作簿。
 * 输入：plan 为活动策划数据。
 * 输出：包含预算明细、公式和汇总的 Workbook。
 */
function buildBudgetWorkbook(plan) {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add('预算测算');
  sheet.showGridLines = false;

  sheet.mergeCells('A1:F1');
  sheet.getRange('A1').values = [[`${plan.brief.name} · 预算测算`]];
  sheet.getRange('A1:F1').format = {
    fill: INK,
    font: { name: FONT, size: 16, bold: true, color: '#FFFFFF' },
    verticalAlignment: 'center',
  };
  sheet.getRange('A1:F1').format.rowHeight = 34;

  sheet.mergeCells('A2:F2');
  sheet.getRange('A2').values = [[
    `主办：${plan.brief.organizer}  |  日期：${plan.brief.date}  |  预算上限：¥${plan.brief.budgetCap.toLocaleString('zh-CN')}`,
  ]];
  sheet.getRange('A2:F2').format = {
    font: { name: FONT, size: 11, italic: true, color: '#536B67' },
    verticalAlignment: 'center',
  };

  const headers = ['类别', '用途', '数量', '单价', '小计', '责任人'];
  const startRow = 4;
  sheet.getRange(`A${startRow}:F${startRow}`).values = [headers];
  sheet.getRange(`A${startRow}:F${startRow}`).format = {
    fill: INK,
    font: { name: FONT, size: 10, bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
  };
  const rows = plan.budget.items.map((item) => [
    item.category,
    item.purpose,
    item.quantity,
    item.unitPrice,
    null,
    item.owner,
  ]);
  const firstDataRow = startRow + 1;
  const lastDataRow = firstDataRow + rows.length - 1;
  sheet.getRange(`A${firstDataRow}:F${lastDataRow}`).values = rows;
  sheet.getRange(`E${firstDataRow}:E${lastDataRow}`).formulas = rows.map(
    (_, index) => [`=C${firstDataRow + index}*D${firstDataRow + index}`],
  );
  sheet.getRange(`C${firstDataRow}:D${lastDataRow}`).setNumberFormat('#,##0');
  sheet.getRange(`E${firstDataRow}:E${lastDataRow}`).setNumberFormat('"¥"#,##0');

  const totalRow = lastDataRow + 2;
  sheet.mergeCells(`A${totalRow}:D${totalRow}`);
  sheet.getRange(`A${totalRow}`).values = [['计划支出合计']];
  sheet.getRange(`E${totalRow}`).formulas = [[`=SUM(E${firstDataRow}:E${lastDataRow})`]];
  sheet.getRange(`A${totalRow}:F${totalRow}`).format = {
    fill: ORANGE,
    font: { name: FONT, size: 12, bold: true, color: '#FFFFFF' },
    verticalAlignment: 'center',
  };
  sheet.getRange(`E${totalRow}`).setNumberFormat('"¥"#,##0');

  sheet.getRange(`A${totalRow + 1}`).values = [['预算上限']];
  sheet.getRange(`E${totalRow + 1}`).values = [[plan.brief.budgetCap]];
  sheet.getRange(`A${totalRow + 2}`).values = [['预算余量']];
  sheet.getRange(`E${totalRow + 2}`).formulas = [[`=E${totalRow + 1}-E${totalRow}`]];
  sheet.getRange(`E${totalRow + 1}:E${totalRow + 2}`).setNumberFormat('"¥"#,##0');
  sheet.getRange(`A${totalRow + 1}:E${totalRow + 2}`).format.font = {
    name: FONT,
    size: 10,
    bold: true,
    color: INK,
  };

  sheet.getRange(`A${startRow}:F${lastDataRow}`).format = {
    font: { name: FONT, size: 10, color: INK },
    verticalAlignment: 'center',
  };
  sheet.getRange(`A${startRow}:F${lastDataRow}`).format.borders = {
    preset: 'all',
    style: 'thin',
    color: '#D6CCB9',
  };
  sheet.freezePanes.freezeRows(4);
  sheet.getRange('A:A').format.columnWidth = 16;
  sheet.getRange('B:B').format.columnWidth = 34;
  sheet.getRange('C:D').format.columnWidth = 11;
  sheet.getRange('E:E').format.columnWidth = 14;
  sheet.getRange('F:F').format.columnWidth = 14;
  sheet.getRange(`A${firstDataRow}:F${lastDataRow}`).format.rowHeight = 28;
  return workbook;
}


/**
 * 功能：生成风险工作簿。
 * 输入：plan 为活动策划数据。
 * 输出：包含风险明细、自动等级公式和汇总的 Workbook。
 */
function buildRiskWorkbook(plan) {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add('风险预案');
  sheet.showGridLines = false;

  sheet.mergeCells('A1:I1');
  sheet.getRange('A1').values = [[`${plan.brief.name} · 风险评估与预案`]];
  sheet.getRange('A1:I1').format = {
    fill: INK,
    font: { name: FONT, size: 16, bold: true, color: '#FFFFFF' },
    verticalAlignment: 'center',
  };
  sheet.getRange('A1:I1').format.rowHeight = 34;

  sheet.mergeCells('A2:I2');
  sheet.getRange('A2').values = [['评分口径：概率 1-5 × 影响 1-5；高风险 ≥15，中风险 ≥8，其余为低风险。']];
  sheet.getRange('A2:I2').format.font = {
    name: FONT,
    size: 10,
    italic: true,
    color: '#536B67',
  };

  const headers = ['ID', '类别', '风险描述', '概率', '影响', '分数', '等级', '责任人', '响应预案'];
  const headerRow = 4;
  sheet.getRange(`A${headerRow}:I${headerRow}`).values = [headers];
  sheet.getRange(`A${headerRow}:I${headerRow}`).format = {
    fill: INK,
    font: { name: FONT, size: 10, bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'center',
  };
  const rows = plan.risks.map((risk) => [
    risk.id,
    risk.category,
    risk.risk,
    risk.probability,
    risk.impact,
    null,
    null,
    risk.owner,
    risk.response,
  ]);
  const firstDataRow = headerRow + 1;
  const lastDataRow = firstDataRow + rows.length - 1;
  sheet.getRange(`A${firstDataRow}:I${lastDataRow}`).values = rows;
  sheet.getRange(`F${firstDataRow}:F${lastDataRow}`).formulas = rows.map(
    (_, index) => [`=D${firstDataRow + index}*E${firstDataRow + index}`],
  );
  sheet.getRange(`G${firstDataRow}:G${lastDataRow}`).formulas = rows.map(
    (_, index) => [
      `=IF(F${firstDataRow + index}>=15,"high",IF(F${firstDataRow + index}>=8,"medium","low"))`,
    ],
  );

  const levelRange = sheet.getRange(`G${firstDataRow}:G${lastDataRow}`);
  levelRange.conditionalFormats.add('containsText', {
    text: 'high',
    format: { fill: '#F4CCCC', font: { bold: true, color: '#9C0006' } },
  });
  levelRange.conditionalFormats.add('containsText', {
    text: 'medium',
    format: { fill: '#FCE5CD', font: { bold: true, color: '#8A4B08' } },
  });
  levelRange.conditionalFormats.add('containsText', {
    text: 'low',
    format: { fill: '#D9EAD3', font: { bold: true, color: '#274E13' } },
  });

  const summaryRow = lastDataRow + 2;
  sheet.getRange(`A${summaryRow}:C${summaryRow}`).values = [['高风险数量', '中风险数量', '低风险数量']];
  sheet.getRange(`A${summaryRow + 1}:C${summaryRow + 1}`).formulas = [[
    `=COUNTIF(G${firstDataRow}:G${lastDataRow},"high")`,
    `=COUNTIF(G${firstDataRow}:G${lastDataRow},"medium")`,
    `=COUNTIF(G${firstDataRow}:G${lastDataRow},"low")`,
  ]];
  sheet.getRange(`A${summaryRow}:C${summaryRow + 1}`).format = {
    fill: MINT,
    font: { name: FONT, size: 11, bold: true, color: INK },
    horizontalAlignment: 'center',
  };

  sheet.getRange(`A${headerRow}:I${lastDataRow}`).format = {
    font: { name: FONT, size: 10, color: INK },
    verticalAlignment: 'top',
  };
  sheet.getRange(`A${headerRow}:I${lastDataRow}`).format.borders = {
    preset: 'all',
    style: 'thin',
    color: '#D6CCB9',
  };
  sheet.freezePanes.freezeRows(4);
  sheet.getRange('A:A').format.columnWidth = 9;
  sheet.getRange('B:B').format.columnWidth = 12;
  sheet.getRange('C:C').format.columnWidth = 28;
  sheet.getRange('D:G').format.columnWidth = 8;
  sheet.getRange('H:H').format.columnWidth = 12;
  sheet.getRange('I:I').format.columnWidth = 42;
  sheet.getRange(`A${firstDataRow}:I${lastDataRow}`).format.rowHeight = 36;
  return workbook;
}


/**
 * 功能：验证工作簿关键区域并输出紧凑摘要。
 * 输入：workbook、sheetName 和检查范围。
 * 输出：无返回值；检查结果写入标准输出。
 */
async function inspectWorkbook(workbook, sheetName, range) {
  const result = await workbook.inspect({
    kind: 'table',
    sheetName,
    range,
    include: 'values,formulas',
    tableMaxRows: 8,
    tableMaxCols: 10,
    maxChars: 3500,
  });
  console.log(`${sheetName}: ${result.ndjson.split('\n').length} inspection records`);
}


/**
 * 功能：生成并导出预算与风险工作簿。
 * 输入：无。
 * 输出：输出文件路径数组。
 */
async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const plan = buildPlan();
  const budgetWorkbook = buildBudgetWorkbook(plan);
  const riskWorkbook = buildRiskWorkbook(plan);
  applyWorkbookFont(budgetWorkbook);
  applyWorkbookFont(riskWorkbook);
  budgetWorkbook.recalculate();
  riskWorkbook.recalculate();

  await inspectWorkbook(budgetWorkbook, '预算测算', 'A1:F20');
  await inspectWorkbook(riskWorkbook, '风险预案', 'A1:I20');

  const budgetOutput = await SpreadsheetFile.exportXlsx(budgetWorkbook);
  await budgetOutput.save(BUDGET_FILE);
  const riskOutput = await SpreadsheetFile.exportXlsx(riskWorkbook);
  await riskOutput.save(RISK_FILE);
  console.log(BUDGET_FILE);
  console.log(RISK_FILE);
}


main().catch((error) => {
  console.error(`工作簿生成失败：${error.stack || error.message}`);
  process.exitCode = 1;
});
