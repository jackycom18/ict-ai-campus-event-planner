import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');
const REPORT_DIR = path.join(ROOT, 'reports');


/**
 * 功能：打开并重新计算一个 XLSX 文件。
 * 输入：filePath 为 XLSX 路径。
 * 输出：已重新计算的工作簿对象。
 */
async function openWorkbook(filePath) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
  workbook.recalculate();
  return workbook;
}


/**
 * 功能：扫描工作簿中的公式错误。
 * 输入：workbook 为已打开的工作簿。
 * 输出：无返回值；发现错误时抛出异常。
 */
async function assertNoFormulaErrors(workbook) {
  const result = await workbook.inspect({
    kind: 'match',
    searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',
    options: { useRegex: true, maxResults: 50 },
    maxChars: 2000,
  });
  if (/\"match\"|#REF!|#DIV\/0!|#VALUE!|#NAME\?|#N\/A|#NUM!|#NULL!|#SPILL!|#CALC!/.test(result.ndjson)) {
    throw new Error(`发现公式错误：${result.ndjson.slice(0, 800)}`);
  }
}


/**
 * 功能：渲染指定工作表为 PNG 预览。
 * 输入：workbook、sheetName 和输出路径。
 * 输出：无返回值。
 */
async function renderSheet(workbook, sheetName, outputPath) {
  const blob = await workbook.render({
    sheetName,
    autoCrop: 'all',
    scale: 1,
    format: 'png',
  });
  await fs.writeFile(outputPath, new Uint8Array(await blob.arrayBuffer()));
}


/**
 * 功能：验证预算与风险工作簿并生成预览。
 * 输入：无。
 * 输出：无返回值；失败时抛异常。
 */
async function main() {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const budgetWorkbook = await openWorkbook(path.join(OUTPUT_DIR, '预算测算表.xlsx'));
  const riskWorkbook = await openWorkbook(path.join(OUTPUT_DIR, '风险评估预案.xlsx'));
  await assertNoFormulaErrors(budgetWorkbook);
  await assertNoFormulaErrors(riskWorkbook);
  await renderSheet(budgetWorkbook, '预算测算', path.join(REPORT_DIR, 'budget-preview.png'));
  await renderSheet(riskWorkbook, '风险预案', path.join(REPORT_DIR, 'risk-preview.png'));
  console.log('Workbook formula scans passed; previews written.');
}


main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
