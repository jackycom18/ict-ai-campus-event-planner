# 项目：AI 校园活动策划团队

> 最后更新：2026-10-27

## 项目总览

- 目标：完成 ICT 1.13，交付六角色多 Agent 活动策划作品。
- 技术栈：Node.js、@oai/artifact-tool、reportlab、HTML/CSS。
- 运行：`npm test`
- 入口：`scripts/plan-data.mjs`、`agents/team.yaml`
- 最终作品：`Agent办公实践AI校园活动策划团队实践作品/`

## 环境配置

- 系统：Windows 11
- Node.js：v24.18.1
- Python：Codex 主运行时 Python 3.12
- reportlab：4.4.9
- `@oai/artifact-tool`：Codex 主运行时内置，通过 `node_modules` junction 使用
- 浏览器验收：Microsoft Edge 无头模式
- 活动成本：0 元，不调用外部模型

## 当前状态

- 已完成：Agent 配置、策划数据、HTML、两个 XLSX、PPTX、四份知识库 PDF、归档和测试。
- 正在进行：最终提交仓库整理。
- 下一步：创建公开仓库并提交第 13 题。
- 风险：HTML 与 PPTX 为演示级策划稿，正式活动仍需学院审核场地、预算和报名信息。

## 需求与约定

- 活动：计算机学院2026级篮球迎新杯。
- 预算上限：30,000 元。
- 输出必须包含 HTML、预算 Excel、风险 Excel、宣传 PPTX、对话记录和 README。
- 所有内容使用中文，时间与人数保持全项目一致。
- 函数注释必须包含功能、输入、输出。

## 待办

- [x] 完成多 Agent 数据生成
- [x] 完成六项作品文件
- [x] 完成 PDF 知识库和可视化验证
- [ ] 创建公开仓库并正式提交

## 版本历史

- 2026-10-27：定义活动简报、六角色团队与实现计划。
- 2026-10-27：完成策划、预算、风险、宣传、HTML、XLSX 和 PPTX。
- 2026-10-27：完成知识库 PDF、对话记录和自动化测试。
