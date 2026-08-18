# 项目规则

## 任务日志（每次任务必做）

每次完成一个任务，把改动摘要与验收结果追加到 `docs/log.md`，标题格式 `## YYYY-MM-DD：一句话标题`，正文按需含「目标 / 已完成 / 验收 / 遗留」小节。涉及人物数据变更时同步更新 `people-entry-log.md`。日志是唯一的持久记录，不要只在对话里汇报。

## 范围与验收

开始修改前先查看 `git status`，保留用户已有改动，不把无关文件混入任务。完成后报告实际修改文件、未处理的范围外改动和验证结果；除非用户明确要求，不自动 commit 或 push。人物数据任务必须运行 `npm run data:build`；代码或数据任务完成后运行 `npm run build` 与 `git diff --check`。

## 数据源约定

人物数据唯一源为 `src/data/people/*.json` 与 `manifest.json`；根 `people.normandy.json` 为生成产物，勿手改，改完跑 `npm run data:build`。新增人物按 dynasty 归入对应拆分文件、UUID 加入 `manifest.json` 的 `order`。

代理成本与委托策略见 `docs/CLAUDE.local.md`。
