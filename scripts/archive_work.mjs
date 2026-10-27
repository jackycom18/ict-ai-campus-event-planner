import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPlan } from './plan-data.mjs';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');


/**
 * 功能：生成 AgentTeam 对话与执行记录。
 * 输入：plan 为完整活动策划数据。
 * 输出：Markdown 字符串。
 */
function renderConversation(plan) {
  const budgetSummary = plan.budget.items
    .map((item) => `- ${item.category}：¥${item.subtotal.toLocaleString('zh-CN')}，${item.purpose}`)
    .join('\n');
  const riskSummary = plan.risks
    .slice(0, 6)
    .map((item) => `- ${item.id} ${item.risk}：${item.level}，${item.owner}，${item.response}`)
    .join('\n');
  return `# Agent办公实践AI校园活动策划团队实践

## 用户任务

帮我策划${plan.brief.name}。

## Leader 任务拆分

1. 策划分析师：确定赛制、赛程和人员安排。
2. 预算分析师：在 ¥${plan.brief.budgetCap.toLocaleString('zh-CN')} 上限内完成预算。
3. 风险管理员：识别风险并生成可执行预案。
4. 宣传文案师：形成主题和传播节奏。
5. 文档设计师：整合 HTML、XLSX 和 PPTX。

## 策划分析师

- 赛制：${plan.format.format}
- 半决赛：${plan.format.semifinal}
- 比赛规则：${plan.format.gameRule}
- 全天共 ${plan.schedule.length} 个执行环节。

## 预算分析师

计划支出：¥${plan.budget.total.toLocaleString('zh-CN')}

预算余量：¥${plan.budget.remaining.toLocaleString('zh-CN')}

${budgetSummary}

## 风险管理员

共识别 ${plan.risks.length} 项风险，其中高风险 ${plan.risks.filter((item) => item.level === 'high').length} 项。

${riskSummary}

## 宣传文案师

- 主题：${plan.promotion.theme}
- 主文案：${plan.promotion.tagline}
- 活动公告：${plan.promotion.announcement}

## 文档设计师

已生成并归档：

- 校园篮球迎新杯活动策划方案.html
- 预算测算表.xlsx
- 风险评估预案.xlsx
- 校园篮球迎新杯宣传方案.pptx
- Agent办公实践AI校园活动策划团队实践.md
- readme.md
`;
}


/**
 * 功能：生成作品目录下的精简 README。
 * 输入：plan 为完整活动策划数据。
 * 输出：Markdown 字符串。
 */
function renderReadme(plan) {
  return `# readme

## 作品目录

${OUTPUT_DIR}

## 作品名称

Agent办公实践AI校园活动策划团队实践

## 作品简介

AI 校园活动策划团队是一个多 Agent 协同的校园活动自动策划系统。用户只需提供活动基本信息（名称、类型、规模、日期、场地），系统即可并行完成活动方案撰写、预算测算、风险评估、宣传文案自动生成，适配学生会、社团、校园管委会各类场景，支持自定义知识库与智能体分工，并最终整合为一份完整的 HTML 策划方案，同时输出预算 Excel、风险预案 Excel 和宣传 PPTX 三份附件，支持二次开发。

本作品以“${plan.brief.name}”为实例，生成日期为 ${plan.brief.date}。
`;
}


/**
 * 功能：写入对话记录和作品 README。
 * 输入：无。
 * 输出：无返回值。
 */
async function main() {
  const plan = buildPlan();
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(OUTPUT_DIR, 'Agent办公实践AI校园活动策划团队实践.md'),
      renderConversation(plan),
      'utf8',
    ),
    fs.writeFile(path.join(OUTPUT_DIR, 'readme.md'), renderReadme(plan), 'utf8'),
  ]);
  console.log('Conversation and README archived.');
}


main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
