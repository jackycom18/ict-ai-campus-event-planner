import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  FileBlob,
  Presentation,
  PresentationFile,
} from '@oai/artifact-tool';

import { buildPlan } from './plan-data.mjs';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');
const FINAL_PPTX = path.join(OUTPUT_DIR, '校园篮球迎新杯宣传方案.pptx');
const REPORT_DIR = path.join(ROOT, 'reports');
const BUILD_DIR = path.join(ROOT, '.deck-build');
const SKILL_DIR = 'C:/Users/Xzj13/.codex/plugins/cache/openai-primary-runtime/presentations/26.1013.11914/skills/presentations';
const RUNTIME_NODE_MODULES = 'C:/Users/Xzj13/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const FONT_BODY = 'Microsoft YaHei UI';
const FONT_DISPLAY = 'Bahnschrift Condensed';
const INK = '#102A2A';
const ORANGE = '#D86D38';
const PAPER = '#F2EBDD';
const MINT = '#35B7A0';


/**
 * 功能：添加一个可编辑文本框。
 * 输入：slide 为幻灯片，text 为文本，position 为位置尺寸，style 为可选文字样式。
 * 输出：创建的文本框对象。
 */
function addText(slide, text, position, style = {}) {
  const box = slide.shapes.add({
    geometry: 'textbox',
    position,
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 },
  });
  box.text = text;
  box.text.style = { typeface: FONT_BODY, color: INK, ...style };
  return box;
}


/**
 * 功能：设置幻灯片背景色。
 * 输入：slide 为幻灯片，fill 为 CSS 颜色。
 * 输出：无返回值。
 */
function setBackground(slide, fill) {
  slide.background.fill = fill;
}


/**
 * 功能：在幻灯片上创建统一样式表格。
 * 输入：slide、位置尺寸、表头和行数据。
 * 输出：创建的表格对象。
 */
function addTable(slide, { left, top, width, height, values, widths }) {
  const table = slide.tables.add({
    rows: values.length,
    columns: values[0].length,
    left,
    top,
    width,
    height,
    values,
    columnWidths: widths,
  });
  table.styleOptions = { headerRow: true, bandedRows: false };
  table.getRange?.(0, 0, 0, values[0].length - 1);
  for (let column = 0; column < values[0].length; column += 1) {
    table.getCell(0, column).fill = INK;
    table.getCell(0, column).text.style = {
      typeface: FONT_BODY,
      fontSize: 18,
      bold: true,
      color: '#FFFFFF',
    };
  }
  for (let row = 1; row < values.length; row += 1) {
    for (let column = 0; column < values[0].length; column += 1) {
      table.getCell(row, column).fill = row % 2 === 0 ? '#E5DDCC' : PAPER;
      table.getCell(row, column).text.style = {
        typeface: FONT_BODY,
        fontSize: 17,
        color: INK,
      };
    }
  }
  table.borders.assign({ style: 'solid', fill: '#B8AD99', width: 1 });
  return table;
}


/**
 * 功能：构建宣传演示文稿。
 * 输入：plan 为活动策划数据。
 * 输出：包含六页幻灯片的 Presentation。
 */
function buildPresentation(plan) {
  const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  deck.theme.defaultFont = FONT_BODY;

  const cover = deck.slides.add();
  setBackground(cover, INK);
  addText(cover, '2026 / NEW STUDENT CUP', { left: 74, top: 56, width: 500, height: 34 }, {
    typeface: FONT_DISPLAY,
    fontSize: 22,
    color: ORANGE,
  });
  addText(cover, plan.brief.theme, { left: 68, top: 112, width: 700, height: 270 }, {
    typeface: FONT_DISPLAY,
    fontSize: 118,
    bold: true,
    color: PAPER,
  });
  addText(cover, plan.brief.name, { left: 74, top: 422, width: 780, height: 70 }, {
    fontSize: 35,
    bold: true,
    color: PAPER,
  });
  addText(cover, `${plan.brief.date}  ${plan.brief.startTime}-${plan.brief.endTime}\n${plan.brief.venue}`, {
    left: 74,
    top: 530,
    width: 760,
    height: 90,
  }, { fontSize: 20, color: '#BED3CB' });
  addText(cover, '8 支队伍\n120 名新生', { left: 970, top: 480, width: 250, height: 120 }, {
    typeface: FONT_DISPLAY,
    fontSize: 42,
    bold: true,
    color: MINT,
  });

  const facts = deck.slides.add();
  setBackground(facts, PAPER);
  addText(facts, '活动基本信息', { left: 64, top: 54, width: 700, height: 64 }, {
    typeface: FONT_DISPLAY,
    fontSize: 49,
    bold: true,
  });
  addTable(facts, {
    left: 64,
    top: 150,
    width: 1120,
    height: 400,
    widths: [230, 890],
    values: [
      ['项目', '内容'],
      ['主办方', plan.brief.organizer],
      ['时间', `${plan.brief.date}  ${plan.brief.startTime}-${plan.brief.endTime}`],
      ['地点', plan.brief.venue],
      ['规模', `${plan.brief.teamCount} 支队伍，约 ${plan.brief.participantCount} 人`],
      ['费用目标', `不超过 ¥${plan.brief.budgetCap.toLocaleString('zh-CN')}`],
    ],
  });

  const schedule = deck.slides.add();
  setBackground(schedule, PAPER);
  addText(schedule, '一天的比赛节奏', { left: 64, top: 48, width: 760, height: 64 }, {
    typeface: FONT_DISPLAY,
    fontSize: 46,
    bold: true,
  });
  addTable(schedule, {
    left: 64,
    top: 136,
    width: 1152,
    height: 480,
    widths: [180, 760, 212],
    values: [
      ['时间', '环节', '负责'],
      ['08:00', '签到与场地布置', '后勤组'],
      ['09:00', '开幕式与规则说明', '主持组'],
      ['09:30', '小组循环赛', '竞赛组'],
      ['13:30', '半决赛', '竞赛组'],
      ['15:30', '决赛与季军赛', '竞赛组'],
      ['16:30', '颁奖、合影与撤场', '宣传组 / 后勤组'],
    ],
  });

  const formatSlide = deck.slides.add();
  setBackground(formatSlide, MINT);
  addText(formatSlide, '赛制与观赛看点', { left: 64, top: 48, width: 760, height: 64 }, {
    typeface: FONT_DISPLAY,
    fontSize: 46,
    bold: true,
  });
  addText(formatSlide, 'A 组', { left: 82, top: 182, width: 210, height: 70 }, {
    typeface: FONT_DISPLAY,
    fontSize: 60,
    bold: true,
  });
  addText(formatSlide, '4 支队伍\n单循环', { left: 82, top: 262, width: 250, height: 100 }, {
    fontSize: 24,
  });
  addText(formatSlide, 'B 组', { left: 498, top: 182, width: 210, height: 70 }, {
    typeface: FONT_DISPLAY,
    fontSize: 60,
    bold: true,
  });
  addText(formatSlide, '4 支队伍\n单循环', { left: 498, top: 262, width: 250, height: 100 }, {
    fontSize: 24,
  });
  addText(formatSlide, '半决赛', { left: 914, top: 182, width: 210, height: 70 }, {
    typeface: FONT_DISPLAY,
    fontSize: 60,
    bold: true,
  });
  addText(formatSlide, 'A1-B2\nB1-A2', { left: 914, top: 262, width: 230, height: 100 }, {
    fontSize: 24,
  });
  addText(formatSlide, '小组前两名晋级。决赛与季军赛在下午连续进行，现场设置双人记录台处理比分与判罚争议。', {
    left: 82,
    top: 470,
    width: 1050,
    height: 100,
  }, { fontSize: 24, bold: true });

  const promotion = deck.slides.add();
  setBackground(promotion, PAPER);
  addText(promotion, '宣传节奏', { left: 64, top: 48, width: 760, height: 64 }, {
    typeface: FONT_DISPLAY,
    fontSize: 46,
    bold: true,
  });
  addTable(promotion, {
    left: 64,
    top: 138,
    width: 1150,
    height: 405,
    widths: [245, 280, 625],
    values: [
      ['时间', '渠道', '内容'],
      ...plan.promotion.messages.map((item) => [item.timing, item.channel, item.message]),
    ],
  });

  const callToAction = deck.slides.add();
  setBackground(callToAction, INK);
  addText(callToAction, '11.14', { left: 66, top: 88, width: 560, height: 210 }, {
    typeface: FONT_DISPLAY,
    fontSize: 142,
    bold: true,
    color: ORANGE,
  });
  addText(callToAction, '南区篮球场', { left: 72, top: 300, width: 600, height: 80 }, {
    fontFamily: FONT_DISPLAY,
    fontSize: 54,
    bold: true,
    color: PAPER,
  });
  addText(callToAction, plan.promotion.tagline, { left: 72, top: 428, width: 700, height: 80 }, {
    fontSize: 34,
    bold: true,
    color: MINT,
  });
  addText(callToAction, '报名请联系班级文体委员\n每队 10 名球员，另设替补名额', {
    left: 820,
    top: 220,
    width: 380,
    height: 160,
  }, { fontSize: 24, color: PAPER });

  return deck;
}


/**
 * 功能：生成、校验并导出宣传 PPTX。
 * 输入：无。
 * 输出：最终 PPTX 路径。
 */
async function main() {
  process.env.RUNTIME_NODE_MODULES = RUNTIME_NODE_MODULES;
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.mkdir(BUILD_DIR, { recursive: true });
  const deck = buildPresentation(buildPlan());
  const draftPath = path.join(BUILD_DIR, 'draft.pptx');
  await (await PresentationFile.exportPptx(deck)).save(draftPath);

  const { finalizePresentation } = await import(
    pathToFileURL(path.join(SKILL_DIR, 'container_tools/artifact_tool_utils.mjs')).href
  );
  const requirements = {
    explicitTotalSlideCount: 6,
    requiredNativeTableOwnerSlides: [2, 3, 5],
    requiredNativeChartOwnerSlides: [],
    fontPolicy: {
      basis: 'design',
      families: [FONT_BODY, FONT_DISPLAY],
    },
  };
  const receiptPath = path.join(BUILD_DIR, 'validation.json');
  await finalizePresentation({
    ...requirements,
    workspaceDir: ROOT,
    candidatePath: draftPath,
    finalPath: FINAL_PPTX,
    pythonExecutable: 'C:/Users/Xzj13/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
    integrityValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_package_integrity.py'),
    layoutValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_layout_geometry.py'),
    layoutArgs: [
      '--expected-slide-size-emu',
      '12192000,6858000',
      '--validate-bullet-geometry',
      '--validate-heading-fit',
      '--require-native-table-slide',
      '2',
      '--require-native-table-slide',
      '3',
      '--require-native-table-slide',
      '5',
    ],
    requiredNativeTableOwnerSlides: requirements.requiredNativeTableOwnerSlides,
    expectedSlideSizeEmu: '12192000,6858000',
    receiptPath,
    verifyArtifactToolImport: true,
  });

  const finalDeck = await PresentationFile.importPptx(await FileBlob.load(FINAL_PPTX));
  for (const [index, slide] of finalDeck.slides.items.entries()) {
    const blob = await finalDeck.export({ slide, format: 'png', scale: 1 });
    await fs.writeFile(
      path.join(REPORT_DIR, `deck-slide-${String(index + 1).padStart(2, '0')}.png`),
      new Uint8Array(await blob.arrayBuffer()),
    );
  }
  console.log(FINAL_PPTX);
}


main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
