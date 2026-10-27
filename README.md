# AI 校园活动策划团队

本项目对应华为 ICT 云赛道 1.13，使用六角色 AgentTeam 为
“计算机学院2026级篮球迎新杯”生成完整活动策划交付包。

## 作品目录

最终提交文件位于：

```text
Agent办公实践AI校园活动策划团队实践作品/
```

目录中包含：

- `Agent办公实践AI校园活动策划团队实践.md`
- `readme.md`
- `校园篮球迎新杯活动策划方案.html`
- `预算测算表.xlsx`
- `风险评估预案.xlsx`
- `校园篮球迎新杯宣传方案.pptx`

## Agent 团队

1. Leader：拆解任务并检查最终产物。
2. 策划分析师：赛制、赛程与人员安排。
3. 预算分析师：分类预算与预算余量。
4. 风险管理员：风险评分与响应预案。
5. 宣传文案师：主题与传播节奏。
6. 文档设计师：HTML、XLSX、PPTX 和归档。

团队配置见 `agents/team.yaml`，五个专业 Agent 的能力规则位于
`agents/skills/`。

## 知识库

`knowledge/` 包含四份 PDF：

- 策划统筹流程
- 预算标准
- 风险评估标准
- 宣传规范

## 生成与验证

HTML 和数据生成：

```bash
node scripts/build-html.mjs
node scripts/archive_work.mjs
```

XLSX 和 PPTX 使用 Codex 主运行时中的 `@oai/artifact-tool`。构建命令：

```bash
node scripts/build-workbooks.mjs
node scripts/build-deck.mjs
```

PDF 知识库：

```bash
python scripts/build_pdfs.py
```

自动化测试：

```bash
npm test
```

## 产出摘要

- 8 支队伍，分为两组，小组前两名进入交叉半决赛。
- 计划支出 ¥23,040，预算上限 ¥30,000，余量 ¥6,960。
- 识别 12 项风险，其中 2 项高风险。
- PPTX 共 6 页，均为可编辑对象。
