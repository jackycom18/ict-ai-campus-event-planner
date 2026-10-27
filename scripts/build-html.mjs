import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPlan } from './plan-data.mjs';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'Agent办公实践AI校园活动策划团队实践作品');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '校园篮球迎新杯活动策划方案.html');


/**
 * 功能：转义插入 HTML 的普通文本。
 * 输入：value 为任意待展示值。
 * 输出：可安全放入 HTML 文本节点的字符串。
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


/**
 * 功能：将结构化策划数据渲染为单文件 HTML。
 * 输入：plan 为 buildPlan 生成的活动策划对象。
 * 输出：包含内联样式的完整 HTML 字符串。
 */
export function renderHtml(plan) {
  const { brief, schedule, format, staffing, budget, risks, promotion } = plan;
  const scheduleRows = schedule.map((item) => `
    <tr>
      <td class="time">${escapeHtml(item.time)}</td>
      <td><strong>${escapeHtml(item.item)}</strong><span>${escapeHtml(item.note)}</span></td>
      <td>${escapeHtml(item.owner)}</td>
    </tr>`).join('');
  const staffingRows = staffing.map((item) => `
    <tr>
      <td>${escapeHtml(item.role)}</td>
      <td class="number">${item.count}</td>
      <td>${escapeHtml(item.duty)}</td>
    </tr>`).join('');
  const budgetRows = budget.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.purpose)}</td>
      <td class="number">${item.quantity}</td>
      <td class="number">¥${item.unitPrice.toLocaleString('zh-CN')}</td>
      <td class="number">¥${item.subtotal.toLocaleString('zh-CN')}</td>
    </tr>`).join('');
  const riskRows = risks.map((item) => `
    <tr data-level="${item.level}">
      <td class="mono">${escapeHtml(item.id)}</td>
      <td><strong>${escapeHtml(item.risk)}</strong><span>${escapeHtml(item.category)}</span></td>
      <td>${item.probability} × ${item.impact}</td>
      <td><span class="risk-tag">${item.level}</span></td>
      <td>${escapeHtml(item.owner)}</td>
      <td>${escapeHtml(item.response)}</td>
    </tr>`).join('');
  const promotionCards = promotion.messages.map((item) => `
    <article>
      <span>${escapeHtml(item.timing)}</span>
      <strong>${escapeHtml(item.channel)}</strong>
      <p>${escapeHtml(item.message)}</p>
    </article>`).join('');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(brief.name)} · 活动策划方案</title>
  <style>
    :root{--ink:#102a2a;--orange:#d86d38;--paper:#f2ebdd;--mint:#35b7a0;--red:#b93c35;--line:rgba(16,42,42,.18)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Microsoft YaHei UI","Segoe UI",sans-serif;line-height:1.65}
    body::before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(16,42,42,.035) 1px,transparent 1px) 0 0/32px 32px;z-index:-1}
    .page{max-width:1180px;margin:auto;padding:32px 34px 80px}
    .topline{display:flex;justify-content:space-between;border-bottom:2px solid var(--ink);padding-bottom:12px;font-size:12px;letter-spacing:.08em}
    .hero{display:grid;grid-template-columns:1.2fr .8fr;gap:36px;padding:52px 0 42px;align-items:end}
    .hero small{display:block;color:var(--orange);font-weight:700;letter-spacing:.16em}.hero h1{font-family:"Bahnschrift Condensed","Microsoft YaHei UI",sans-serif;font-size:clamp(54px,9vw,112px);line-height:.86;margin:16px 0;letter-spacing:-.055em}
    .hero p{max-width:58ch;font-size:17px}.scoreboard{border:3px solid var(--ink);background:var(--ink);color:var(--paper);padding:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:1px;box-shadow:12px 12px 0 var(--orange)}
    .scoreboard div{background:var(--ink);padding:16px}.scoreboard span{display:block;color:#a8c8bf;font-size:11px}.scoreboard strong{display:block;font-family:"Bahnschrift Condensed",sans-serif;font-size:48px;line-height:1}
    .notice{display:flex;gap:16px;padding:18px;background:var(--orange);color:#fff;margin-bottom:46px}.notice strong{white-space:nowrap}
    section{padding:42px 0;border-top:1px solid var(--line)}.section-head{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:20px}.section-head h2{margin:0;font-family:"Bahnschrift Condensed","Microsoft YaHei UI",sans-serif;font-size:46px}.section-head span{font-size:12px;color:#536b67}
    .format{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line)}.format div{padding:20px;border-right:1px solid var(--line)}.format div:last-child{border:0}.format span{display:block;font-size:11px;color:#657d78}.format strong{display:block;margin-top:8px;font-size:19px}
    table{width:100%;border-collapse:collapse;background:rgba(255,255,255,.34)}th,td{padding:12px 10px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}th{background:var(--ink);color:#fff;font-size:12px}td span{display:block;color:#667a76;font-size:12px}.time,.mono{font-family:"Cascadia Mono",monospace;white-space:nowrap}.number{text-align:right;font-variant-numeric:tabular-nums}
    .budget-total{display:flex;justify-content:flex-end;gap:36px;padding:20px;background:var(--ink);color:#fff}.budget-total strong{font-size:30px;color:var(--orange)}
    .risk-layout{display:grid;grid-template-columns:1fr 250px;gap:28px}.risk-side{background:var(--orange);color:#fff;padding:22px;align-self:start}.risk-side strong{display:block;font-size:52px;line-height:1}.risk-side p{margin:16px 0 0}.risk-tag{display:inline-block;padding:3px 7px;color:#fff;background:var(--orange);font-size:10px}.risk-tag:where([data-level="low"]){background:var(--mint)}tr[data-level="high"] .risk-tag{background:var(--red)}tr[data-level="low"] .risk-tag{background:var(--mint)}
    .promo{background:var(--mint);color:var(--ink);margin:20px -34px -80px;padding:52px 34px 66px}.promo h2{font-family:"Bahnschrift Condensed","Microsoft YaHei UI",sans-serif;font-size:clamp(48px,8vw,94px);line-height:.9;margin:0;max-width:760px}.promo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(16,42,42,.25);margin-top:32px}.promo-grid article{background:var(--mint);padding:18px}.promo-grid span{font-size:11px}.promo-grid strong{display:block;margin:8px 0}.promo-grid p{margin:0;font-size:13px}
    .footer{display:flex;justify-content:space-between;margin-top:34px;font-size:11px;color:#617773}
    @media(max-width:850px){.hero,.risk-layout{grid-template-columns:1fr}.format,.promo-grid{grid-template-columns:1fr 1fr}.page{padding:24px 18px 60px}.promo{margin:20px -18px -60px;padding:42px 18px}}
    @media(max-width:560px){.scoreboard,.format,.promo-grid{grid-template-columns:1fr}.format div{border-right:0;border-bottom:1px solid var(--line)}table{font-size:12px}th:nth-child(3),td:nth-child(3){display:none}}
    @media print{body{background:#fff}.page{max-width:none}.promo{margin:20px 0 0}.notice{break-inside:avoid}section{break-inside:avoid}}
  </style>
</head>
<body>
  <div class="page">
    <div class="topline"><span>${escapeHtml(brief.organizer)} / 2026 NEW STUDENT CUP</span><span>${escapeHtml(brief.date)}</span></div>
    <header class="hero">
      <div>
        <small>${escapeHtml(brief.theme)}</small>
        <h1>${escapeHtml(brief.name)}</h1>
        <p>${escapeHtml(promotion.tagline)}。本方案由策划、预算、风险、宣传和文档五个专业 Agent 协同完成，所有数据可直接用于执行与复盘。</p>
      </div>
      <div class="scoreboard">
        <div><span>参赛队伍</span><strong>${brief.teamCount}</strong></div>
        <div><span>预计参与</span><strong>${brief.participantCount}</strong></div>
        <div><span>活动时间</span><strong>${escapeHtml(brief.startTime)}</strong></div>
        <div><span>结束时间</span><strong>${escapeHtml(brief.endTime)}</strong></div>
      </div>
    </header>
    <div class="notice"><strong>执行地点</strong><span>${escapeHtml(brief.venue)}。遇雨启用室内备选场地，并通过班级群发布变更。</span></div>

    <section>
      <div class="section-head"><h2>赛制与分组</h2><span>8 队 · 2 组 · 单循环后交叉淘汰</span></div>
      <div class="format">
        <div><span>小组赛</span><strong>${escapeHtml(format.format)}</strong></div>
        <div><span>半决赛</span><strong>${escapeHtml(format.semifinal)}</strong></div>
        <div><span>决赛</span><strong>${escapeHtml(format.final)}</strong></div>
        <div><span>比赛规则</span><strong>${escapeHtml(format.gameRule)}</strong></div>
      </div>
    </section>

    <section>
      <div class="section-head"><h2>当天流程</h2><span>从签到到撤场全部有明确负责人</span></div>
      <table>
        <thead><tr><th>时间</th><th>环节</th><th>负责人</th></tr></thead>
        <tbody>${scheduleRows}</tbody>
      </table>
    </section>

    <section>
      <div class="section-head"><h2>人员配置</h2><span>${staffing.reduce((sum, item) => sum + item.count, 0)} 名工作人员</span></div>
      <table>
        <thead><tr><th>岗位</th><th>人数</th><th>职责</th></tr></thead>
        <tbody>${staffingRows}</tbody>
      </table>
    </section>

    <section>
      <div class="section-head"><h2>预算测算</h2><span>预算上限 ¥${budget.budgetCap.toLocaleString('zh-CN')}</span></div>
      <table>
        <thead><tr><th>类别</th><th>用途</th><th>数量</th><th>单价</th><th>小计</th></tr></thead>
        <tbody>${budgetRows}</tbody>
      </table>
      <div class="budget-total">
        <span>计划支出<br><strong>¥${budget.total.toLocaleString('zh-CN')}</strong></span>
        <span>预算余量<br><strong>¥${budget.remaining.toLocaleString('zh-CN')}</strong></span>
      </div>
    </section>

    <section>
      <div class="section-head"><h2>风险预案</h2><span>${risks.length} 项风险按概率 × 影响排序</span></div>
      <div class="risk-layout">
        <table>
          <thead><tr><th>ID</th><th>风险</th><th>概率 × 影响</th><th>等级</th><th>负责人</th><th>响应</th></tr></thead>
          <tbody>${riskRows}</tbody>
        </table>
        <aside class="risk-side"><strong>${risks.filter((item) => item.level === 'high').length}</strong><p>项高风险需要活动前完成专项检查。医疗点、备用场地和应急通道列为开场前必检项。</p></aside>
      </div>
    </section>

    <section class="promo">
      <h2>${escapeHtml(promotion.announcement)}</h2>
      <div class="promo-grid">${promotionCards}</div>
    </section>
    <div class="footer"><span>AI 校园活动策划团队 · 可编辑本地版本</span><span>${escapeHtml(brief.date)} / ${escapeHtml(brief.venue)}</span></div>
  </div>
</body>
</html>`;
}


/**
 * 功能：生成并写入最终 HTML 策划方案。
 * 输入：无。
 * 输出：返回输出文件绝对路径。
 */
async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, renderHtml(buildPlan()), 'utf8');
  console.log(OUTPUT_FILE);
}


if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
  main().catch((error) => {
    console.error(`生成 HTML 失败：${error.message}`);
    process.exitCode = 1;
  });
}
