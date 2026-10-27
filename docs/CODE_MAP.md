# 代码地图

> 最后更新：2026-10-27

## 总体结构

```text
campus-event-planner/
├─ data/event-brief.json        活动输入
├─ agents/                      六角色配置与五个 Skill
├─ knowledge/                   四份 PDF 知识库
├─ scripts/                     数据、HTML、Office、PDF 和归档生成器
├─ tests/                       数据和最终产物验证
├─ reports/                     测试、截图与逐页预览
├─ docs/                        项目备忘和代码地图
└─ Agent办公实践AI校园活动策划团队实践作品/
```

## 模块职责

- `agents/team.yaml`：Leader 与专业 Agent 分工。
- `scripts/plan-data.mjs`：纯函数生成赛程、预算、风险与宣传数据。
- `scripts/build-html.mjs`：生成单文件 HTML 策划方案。
- `scripts/build-workbooks.mjs`：生成预算与风险 XLSX。
- `scripts/verify-workbooks.mjs`：重新计算、公式扫描、生成预览。
- `scripts/build-deck.mjs`：生成 6 页可编辑宣传 PPTX。
- `scripts/build_pdfs.py`：生成四份知识库 PDF。
- `scripts/archive_work.mjs`：生成对话记录和作品 README。
- `tests/validate-outputs.test.mjs`：验证最终文件集合、ZIP 内容和页数。

## 逐文件核心内容

### `scripts/plan-data.mjs`

- 用途：为所有产物提供单一事实来源。
- 关键函数：`buildPlan()`、`buildBudget()`、`buildRisks()`。
- 数据流：event brief → 结构化数组 → 文件生成器。
- 注意：风险等级阈值固定为 15 和 8。

### `scripts/build-deck.mjs`

- 用途：使用 Artifact Tool 构建并校验 PPTX。
- 关键函数：`buildPresentation()`、`main()`。
- 数据流：策划数据 → 六页可编辑对象 → finalizer → 渲染截图。
- 注意：主题字体设置为 Microsoft YaHei UI 和 Bahnschrift Condensed。
