# Development Log

This document records the major phases of `hist-family-tree-vis`. It is a development history, not a replacement for the README or the historical source notes.

时间记录采用本地开发时间：Phase 1–2 为 **2026-08-14 晚间**，Phase 3 及之后为 **2026-08-15 凌晨**。

## Phase 1: William I six-person MVP

**日期：2026-08-14 晚间**

### Proposed requirements

- Build a CK3-inspired historical family-tree viewer rather than a modern genealogy product.
- Start from William I of England and show a compact six-person family view: Robert I, William I, Matilda of Flanders, Robert Curthose, William II, and Henry I.
- Keep names, titles, event names, and English Wikipedia links in English as the canonical historical layer.
- Provide English/Chinese switching for interface fields and explanatory labels.
- Give each person a stable UUID, optional aliases and nicknames, lifespan, titles, tags, events, relationships, and Wikipedia URL.
- Keep the first screen focused on the tree and a person detail panel, with cards selectable as the main interaction.

### Implemented format

- Person records are JSON objects with identity, display names, gender, birth/death data, titles, tags, relationships, and events.
- Events use a date or partial date, a title, a tag, a Wikipedia URL where useful, and a hidden influence weight used to rank the most important events.
- The visible person card shows a compact identity and lifespan; the detail panel carries richer facts and the event timeline.
- The first three events are presented as a summary, while the full event list opens in a modal with tag filtering.

### Main challenges

- A family tree is not a simple list: parentage, marriage, spouse visibility, and child visibility interact.
- A single fixed SVG width failed as more generations and spouses were opened.
- Partial historical dates must sort chronologically without pretending that an unknown month or day is exact.
- The interface needed to stay readable in both English and Chinese without changing the canonical historical names.

### Solutions

- Use explicit relationship IDs instead of inferring family links from display names.
- Keep the tree as a deterministic projection of people plus UI expansion state.
- Calculate the SVG canvas width from the expanded relationship branches and preserve horizontal/vertical scrolling.
- Sort events by normalized date and use the influence weight only for selecting the visible top events.
- Separate canonical English data from translated interface copy.

## Phase 2: Event, tag, and death-cause model

**日期：2026-08-14 晚间**

### Proposed requirements

- Record only historically important events and distinguish them with tags.
- Support title acquisition, marriage, battle, campaign, coronation, childbirth, government change, diplomacy, and dynasty events.
- Show exact dates when an event is known, especially coronations and battles, and show month precision where available.
- Add age at the time of an event.
- Add a death event and a short cause-of-death explanation for populated people.
- Represent death certainty with four states:
  - `○`: normal death
  - `●`: clearly non-natural death
  - `●?`: non-natural death is certain, but responsibility or intent is uncertain
  - `○?`: the nature or cause of death itself is uncertain

### Implemented direction

- Event weights remain data-side metadata; the frontend uses them for ranking but does not expose the numeric weight.
- The timeline exposes a tag selector and keeps notes secondary, so the main event remains scannable.
- Death cause is opened from the death fact rather than occupying the main card layout.
- William II's hunting death is treated as clearly non-natural in the project notation; uncertain medieval cases can use the question-mark states.

### Main challenge

The same person can have a title event, a coronation, and a political transition in one year. Treating these as one undifferentiated “event” makes the timeline historically vague and difficult to filter.

### Solution

Use a typed event taxonomy plus partial ISO-like dates (`YYYY`, `YYYY.MM`, `YYYY.MM.DD`). Store the event title separately from its tag and optional note. This keeps display wording concise while preserving historical detail for later source review.

## Phase 3: Search, filters, and navigation

**日期：2026-08-15 凌晨**

### Proposed requirements

- Add person search with approximate matching, including people outside the currently visible branch.
- Replace a long row of tags with a searchable tag popup.
- Add a gender filter popup.
- Add zoom controls, scrollable tree space, manual focus, and generation controls.
- Keep the selected person as the family focus while expanding ancestors or descendants.

### Implemented direction

- Search is handled by a dedicated people-search module and supports fuzzy matching.
- Search results can identify a hidden person such as Alix and navigate to that person as the focus.
- Tree zoom and generation controls are separate from the tree viewport.
- A manual focus action is available in the upper-left controls; expanding a branch does not automatically recenter the user.
- The tree canvas expands when long ancestor or spouse branches are opened, allowing normal horizontal and vertical scrolling.

### Main challenge

Automatic centering initially felt convenient, but it repeatedly moved the user away from the branch they were inspecting. Conversely, fixed bounds made long chains impossible to explore.

### Solution

Treat viewport position as user-controlled UI state. Center only when entering a new protagonist view or when the user explicitly presses the focus control. Let the canvas grow from measured content requirements rather than imposing a hard generation limit.

## Phase 4: Eleanor of Aquitaine and Henry II spouse switching

**日期：2026-08-15 凌晨**

### Proposed requirements

- Add Eleanor of Aquitaine and Henry II as the second major protagonist view.
- Switch between Eleanor's two marriages: Louis VII and Henry II.
- Show the appropriate children for the active spouse and represent the dissolved marriage with a broken relationship line.
- Preserve Eleanor's detail panel, event timeline, age display, and spouse controls in both views.

### Implemented direction

- Protagonist selection is available from the home page and opens a tree centered on the selected person.
- Spouse cycling is modeled explicitly instead of stacking multiple spouses vertically.
- The active spouse determines which child set is rendered; the underlying people records remain unchanged.
- Henry II's legitimate children are ordered by birth year, while acknowledged non-marital children use a distinct relationship path.

### Main challenge

Spouse navigation, parentage, and child visibility are three different concepts. Reusing one generic “expand” flag caused the wrong spouse or the wrong generation to disappear.

### Solution

Represent spouse selection and branch expansion independently. Use the relationship record, including parent and mother IDs, to decide whether a child belongs to the visible spouse branch. This is why a person can be hidden visually without losing the relationship needed for another protagonist view.

## Phase 5: Illegitimate children and relationship semantics

**日期：2026-08-15 凌晨**

### Proposed requirements

- Add Geoffrey, Archbishop of York; William Longespee, Earl of Salisbury; and Morgan FitzRoy as Henry II's non-marital children.
- Show non-marital relationships with a dotted/diamond line (`···◇···`).
- Use a grey-black dashed border and a visible marker for illegitimate children, while retaining the neutral card fill.
- Keep legitimate family links, siblings, friends, and enemies conceptually separate for future expansion.

### Implemented direction

- Non-marital status is a data property, not inferred from a person's title or card color.
- The tree renderer can use a separate relationship style for acknowledged non-marital parentage.
- The mother's ID is important: when viewing Richard I, the child branch must show Eleanor's children, not every woman associated with Henry II.

### Main challenge

Historical records often identify the father but have incomplete or disputed maternal information. A father-only query produces visually plausible but historically misleading branches.

### Solution

Make parent IDs and mother IDs first-class fields. Use them as the filter for a spouse-specific child branch, and leave uncertain parentage explicit rather than silently guessing from proximity in the graph.

## Phase 6: Long-line testing and protagonist entry points

**日期：2026-08-15 凌晨**

### Proposed requirements

- Test a long chain from Alfred the Great through the Norman and Plantagenet lines to Elizabeth I.
- Add the Rollo to William I Norman ancestry chain.
- Add the Edward I, Edward III, Black Prince, Richard II, Lancastrian, Yorkist, and Tudor test paths.
- Add home-page entries for England and France, with paged protagonist cards.

### Implemented direction

- The home page is separated from the tree page and can launch different protagonists.
- England is the populated entry; France is reserved as an empty future entry.
- Elizabeth I is used as a long-chain test protagonist so ancestor expansion exercises the same controls across many generations.
- The project now contains enough people to test repeated names, duplicate historical names with different UUIDs, spouse branches, maternal branches, and long scrolling.

### Main challenge

Repeated regnal names such as William IX and Richard II can appear as different records. A name-based identity model creates duplicate nodes, broken links, or accidental merges.

### Solution

Use UUIDs as the only relationship identity. Names are display and search fields; they are never foreign keys. This also makes later PostgreSQL migration possible without changing the tree model.

## Phase 7: Visual hierarchy and card states

**日期：2026-08-15 凌晨**

### Proposed requirements

- Make rank and relationship status legible at a glance.
- Use filled card colors for rank tiers, while keeping illegitimate children visually distinct.
- Current palette:
  - Emperor: `#56316f`
  - Empress: `#c6a9d8`
  - Supreme King / France-level king: `#283b72`
  - Supreme Queen / Queen of France: `#aab8d6`
  - King: `#6f2026`
  - Queen Consort: `#c98288`
  - Duke: `#9cc4d6`
  - Count: `#aab8ad`
  - Noble: `#d8d2c8`
  - Untitled: `#fff8e8`
  - Illegitimate: neutral fill with grey-black dashed border and marker

### Main challenge

Border-only rank indicators were too subtle once the tree contained many cards. At the same time, female rulers, consorts, noblewomen, emperors, and empresses needed different semantic treatment.

### Solution

Use fill color for rank/status and reserve the border pattern for relationship status such as illegitimacy. Gender remains an icon and does not determine rank. This separates three visual dimensions: status, relationship certainty, and gender.

## Phase 8: React decomposition and PostgreSQL preparation

**日期：2026-08-15 凌晨**

### Proposed requirements

- Move beyond a monolithic `App.tsx`.
- Prepare forms and persistence for a much larger number of people.
- Keep JSON fallback for local exploration while adding PostgreSQL for durable records.

### Implemented direction

- `App.tsx` acts as application orchestration rather than owning every rendering detail.
- Tree rendering is in `src/features/tree/FamilyTree.tsx`.
- Person detail rendering is in `src/features/people/DetailPanel.tsx`.
- Protagonist selection is in `src/pages/ProtagonistPage.tsx`.
- Person creation is in `src/components/PersonFormModal.tsx`.
- Search logic is in `src/features/people/peopleSearch.ts`.
- API access is in `src/api/peopleApi.ts`.
- PostgreSQL schema, seed, and HTTP API are under `server/`.

### Main challenge

The original MVP was fast to change, but every new relationship rule touched the same rendering and state code. That made regressions likely: a fix for a maternal branch could break spouse visibility or viewport behavior.

### Solution

Split by responsibility and keep data, derived presentation, interaction state, and persistence separate. The JSON dataset remains a deterministic demo source; PostgreSQL becomes the durable source when configured. This makes the next stage—forms, validation, larger datasets, and database-backed editing—possible without rewriting the visual tree.

## Computer science foundations involved

### Data structures and algorithms

- The family is a directed graph with typed edges: parent, spouse, and future social relationships.
- Tree layout is a graph-to-coordinate projection with collision avoidance and ordering constraints.
- Event ranking is sorting over normalized dates and hidden weights.
- Search uses tokenization and fuzzy matching rather than exact string equality.

### Databases and data modeling

- UUIDs provide stable entity identity across repeated names and changing display labels.
- Parentage, unions, titles, tags, and events are normalized into relational tables.
- JSON is useful for a portable fixture; PostgreSQL is better for constraints, querying, and durable edits.

### Software architecture

- React components provide separation of concerns and local rendering boundaries.
- Derived state turns raw records plus UI choices into a visible graph.
- API boundaries isolate the browser from database implementation details.
- A fallback data source improves local development resilience.

### Human-computer interaction

- Direct manipulation is used for selection, zoom, scrolling, branch expansion, and manual focus.
- Color, icons, line styles, and card fill provide redundant visual encoding rather than relying on one cue.
- The design protects the user's viewport and avoids surprise recentering.

### Computer graphics and visualization

- SVG is used for scalable cards, connectors, relationship markers, and large scrollable canvases.
- Layout must account for viewport size, card dimensions, connector routing, and collision volume.
- Visual hierarchy maps historical rank and relationship semantics to consistent encodings.

### Testing and reliability

- Long-chain testing exposes duplicate IDs, missing parent links, clipped nodes, and incorrect branch ownership.
- Build verification catches TypeScript and bundling regressions.
- Explicit relationship data makes failures diagnosable instead of hiding them in layout heuristics.

## Current limits and next engineering priorities

- Historical claims still need source-level review and provenance fields.
- PostgreSQL needs to become the primary editing path before the dataset grows substantially.
- Relationship edges should gain a formal schema for legitimate, non-marital, uncertain, sibling, friend, and rival links.
- Automated tests should cover UUID uniqueness, parent/mother filtering, event ordering, and long-chain layout behavior.

## 2026-08-15 下午：Phase 1 双语 UI 验收

### 本次检查范围

- 检查 Claude Code 执行 Phase 1 后的工作区差异。
- 检查语言层是否真正接入 React 组件，而不是只新增翻译表。
- 检查树页面、人物详情、事件时间线、死因弹窗、人物表单和主页入口。
- 执行 `npm run build`，确认 TypeScript 和 Vite 打包状态。

### 已完成

- `presentation.tsx` 已建立统一的 `copyFor(language)` 文案入口。
- `App.tsx`、`PageTabs.tsx`、`ProtagonistPage.tsx`、`DetailPanel.tsx`、`PersonFormModal.tsx` 已部分或完整使用双语 copy。
- FamilyTree 的返回、首页、缩放、世代、配偶、后代、父母和导航辅助文案已接入语言层。
- 死因弹窗的 Death Cause、Culprit、Close、Wikipedia 等文案已接入语言层。
- 时间线的 NOTE、Age、UNKNOWN、事件标签筛选已接入语言层。
- 之前发现的乱码缩放 aria-label 已不再作为运行时硬编码使用。
- `npm run build` 通过：TypeScript 检查和 Vite 生产构建均成功。

### 验收结果

本次 Phase 1 已从“部分汉化”推进到“主要 UI 文案集中管理”。英文和中文切换的基础路径已经成立；人物姓名、正式头衔、事件名称、地点和 Wikipedia URL 仍保持英文 canonical data，符合项目的史料策略。

### 仍需修复

1. `FamilyTree.tsx` 的 `isFormerMarriage` 仍通过 Eleanor 与 Louis VII 的 UUID 判断离婚关系。该问题不属于本次双语 UI 的直接阻塞项，但仍违反关系数据驱动原则，应在后续关系模型阶段修复。
2. `eventTagText()` 对未知 event type 仍直接回退英文字符串。`succession`、`regency`、`imprisonment`、`annulment`、`political_crisis` 等类型需要补齐中英文映射。
3. 当前检查完成了静态代码和构建验收，尚未完成浏览器中的逐项 EN/CN 交互验收。
4. 当前工作区包含此前长链扩展和人物数据变更，不能把所有 Git diff 都归因于本次 Phase 1。

### 下一步建议

- 先补齐所有 event type 的双语映射。
- 再把婚姻状态从硬编码 UUID 改成数据字段，例如 `union.status` 或关系记录中的 `isFormer`。
- 完成浏览器验收后，再进入 Phase 2 的中文搜索和关系模型改造。

## 2026-08-16：Phase 2 完整汉化与验收

### 目标

- 补齐全部 UI、事件类型、标签、操作提示、人物详情和表单文案的 EN/CN 双语。
- 为人物姓名、头衔、地点、事件、死因增加独立中文显示字段，中文模式使用这些字段。
- 支持中文人物搜索。
- 保留英文 canonical 字段、Wikipedia URL、ID 与数据库结构兼容性；不改变人物卡视觉结构。

### 已完成

- **数据**：`people.normandy.json` 65 人新增 `displayNameCn/fullNameCn/nicknameCn/primaryTitleCn/birthPlaceCn/deathPlaceCn`（65/65）、`titles[].titleCn`（75/75）、`events[].labelCn`（153/153）、`deathCause.summaryCn/detailCn/culpritCn`（26/26）。英文字段经 jq 剥离中文键后与 HEAD 逐字对比，零改动。
- **文案**：`tagCopy` 补齐 count/countess/emperor/empress；`eventTagLabels` 补齐 annulment、succession、regency、imprisonment、political_crisis、religion、treaty、violent 等 22 个类型及 "all"；新增 `titleCnMap`/`cultureCnMap`/`faithCnMap`/`dynastyCnMap` 静态映射——共用词汇（王朝/文化/信仰/头衔）走呈现层映射而非逐人字段，数据库加载的数据同样受益。Phase 1 验收遗留的 event type 映射缺口已闭合。
- **呈现层**：`textFor()` 全字段中文优先、英文回退；新增 `eventLabelText()`；`initials(person, language)` 中文取前两字；死因弹窗 summary/detail/culprit 中文；文档 `title` 与 `html lang` 随语言切换（zh-CN）。
- **搜索**：`normalizedSearchText` 改用 Unicode 属性转义 `\p{L}\p{N}`，中文查询不再被剥离；搜索池纳入全部中文字段；搜索弹窗本地化渲染；树节点变暗匹配补入 `nicknameCn`/`primaryTitleCn`。
- **消费组件**：Toolbar、FamilyTree（含 8 处分支按钮 aria/title 与私生子记号 B/私）、DetailPanel、ProtagonistPage（hook 双语）、PersonFormModal（含父/母下拉、Tags placeholder、错误提示）全部接入。
- **服务端**：`schema.sql` 增加 `people.localized JSONB`、`person_titles.title_cn`、`person_events.label_cn`（均 `ADD COLUMN IF NOT EXISTS`，幂等；既有库重新应用 schema.sql 即可）；`seed.mjs` 写入；`index.mjs` 白名单展开中文字段。`textFor().title` 改为接收 Title 对象，优先 `title.titleCn`，静态映射仅作回退。
- **seed 幂等性加固**：`person_titles`/`person_events` 由 `ON CONFLICT DO NOTHING` 改为按唯一索引冲突目标 `DO UPDATE`，仅回填 `title_cn`/`label_cn`，不覆盖既有行的其他字段（含用户手工编辑）；people upsert 增加 `death_cause = EXCLUDED.death_cause`，使旧库死因 JSONB 内的中文键也能补写。既有数据库重跑 `npm run db:seed` 即可获得中文字段，无需删改任何历史数据。
- **验收**：
  - 静态审计（子代理）：全部 copy/tag/eventTag 成对无缺失；数据中 17 种人物标签、18 种事件类型、37 种事件标签零遗漏；人物卡 SVG 结构未变；无阻塞项。
  - `npm run build` 通过（TS strict + Vite）。
  - Headless Chrome CDP 运行时验证：首页 → 家谱页 → 死因弹窗 → 搜索 "威廉"（7 条中文结果）→ 切回英文，全部正确，无 React 运行时错误；API 未启动时按设计回退 JSON 数据。
- **收尾**：一次性迁移脚本 `merge-cn.mjs` 用后即删；`.gitignore` 加入 `.DS_Store`。

### 遗留问题

- 人物表单仍仅录入英文字段，新建人物在中文模式回退英文（已做优雅回退）。
- 中文搜索为子串 + 编辑距离匹配，未做拼音匹配。
- 事件 note、人物 notes/sourceNote、deathCause 正文以外史料保持英文 canonical。
- `isFormerMarriage()` 仍硬编码埃莉诺与路易七世的 UUID（Phase 1 验收遗留，待关系模型改造）。
- 运行时验收基于 headless Chrome 的 DOM 级断言与截图，截图未人工目检；建议人工抽检一次浏览器视觉效果。
- `culpritCn` 仅 3/26，与英文 culprit 一一对应（其余 23 人英文亦无元凶字段）。

## 2026-08-16 凌晨：响应式布局与家谱等比例缩放

### 本次目标

- 让首页、主角选择页和家谱页适配桌面大屏、Mac 窗口、平板、手机及浏览器 125% 缩放。
- 保持人物卡的视觉结构和宽高比例不变，让家谱节点、连接线和交互控件统一缩放。
- 减少固定宽度、固定高度和固定间距造成的横向溢出。

### 当前改动

- `src/styles.css`：使用 `clamp()`、视口单位和响应式网格调整页面内边距、主角区、卡片网格、工具栏、详情面板、时间线和树容器。
- 家谱工具栏允许换行；搜索与筛选弹窗改为受视口约束的宽度和定位，移动端使用左侧锚定。
- 家谱树容器使用 `100dvh` 和内部滚动，避免页面级横向溢出；SVG 高度随 viewBox 比例变化。
- `src/features/tree/FamilyTree.tsx`：进入家谱页时根据树容器宽度计算 fit zoom，统一缩放 SVG 内容，范围限制为 50%–100%。
- `src/store.ts`：新增 `setZoom`，并将手动缩小下限统一为 50%。
- `.DS_Store` 等系统文件不进入版本控制；`docs/CLAUDE.local.md` 继续作为本地策略文件保持未跟踪。

### 验收记录

- 使用 headless Chrome/CDP 检查 1440×900、1280×800、1024×768、834×1194、744×1133、390×844，以及 1440 的 125% 浏览器缩放。
- 首页无页面级横向溢出；家谱树允许容器内部滚动。
- SVG viewBox 与实际尺寸保持等比例，人物卡宽高比例保持 178:108。
- EN/CN 切换、中文人物搜索、人物卡导航、详情面板、死因弹窗和缩放按钮均通过自动化检查。
- 未发现 React 运行时异常；未启动 API 时出现的 500 属于预期 JSON fallback 行为。
- 自动化报告曾发现桌面宽度下搜索弹窗左侧溢出问题；当前 CSS 已改为左侧锚定并限制宽度，仍应在最终提交前重新运行桌面端验收确认。

### 当前状态与后续

- 响应式布局和统一缩放改动目前仍在工作区，尚未单独提交。
- 建议重新运行完整响应式验收并人工目检至少一个桌面和一个 Mac/移动尺寸。
- `src/styles.css` 仍是单文件，后续可按功能拆分为多个 CSS 文件，并保留统一入口。
