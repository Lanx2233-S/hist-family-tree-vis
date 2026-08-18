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

## 2026-08-16 晚间至 2026-08-17：家族纹章与早期英格兰谱系扩展

### 已完成

- **纹章资源**：将 Normandy、Capet、Plantagenet、Poitiers 的 WebP/SVG 来源规范为 PNG，统一用于主页入口卡、家谱页和人物详情页；纹章采用直接贴图与统一尺寸比例，不再额外绘制 CSS 盾牌边框。
- **纹章呈现**：新增按人物王朝/家族自动匹配纹章的呈现逻辑；Plantagenet 三狮纹章覆盖对应人物卡，Geoffroy V 保留例外；树页纹章固定在实际树画布右上角，避免随人物节点位置漂移。
- **入口人物**：法国入口加入查理曼并按时间顺序排列；英格兰入口加入阿尔弗雷德大帝并置于第一位，原有入口顺延，点击逻辑保持不变。
- **阿尔弗雷德父系**：新增并连接埃塞尔伍尔夫、埃格伯特、埃尔蒙德；补入阿尔弗雷德四位兄弟。修复阿尔弗雷德卡片缺失父亲 UUID 的问题，并完成正向/反向子女关系校验。
- **阿尔弗雷德后代**：补入五位存活至成年的子女：长者爱德华、埃塞尔弗莱德、埃塞尔吉夫、埃尔夫特里特、埃塞尔韦尔德；新增埃塞尔弗莱德之女埃尔夫温。夭折人物按规则排除。
- **爱德华长者后代**：补入埃塞尔斯坦、埃德雷德、伊德吉芙、埃尔夫吉芙、伊德吉丝；保留既有埃德蒙一世，排除早夭的埃尔夫韦尔德。
- **身份标签修正**：伊德吉芙、伊德吉丝标记为 `queen + consort`，明确其为王后配偶而非女性君主；埃塞尔弗莱德保持实际统治者/麦西亚女领主身份。
- **数据质量**：新增人物均遵守现有 UUID、中文显示字段、空事件数组和父子关系规则；当前人物数据增至 110 人。

### 验收

- 多次执行 JSON 解析与关键父子关系检查，通过。
- `npm run build` 通过：TypeScript strict 检查和 Vite 生产构建均成功。

### 后续

- 继续补充早期英格兰谱系时，应区分可靠史料人物、成年存活人物与早夭/传说人物。
- 王后配偶与女性实际君主继续通过 `consort` 标签和 `rank` 组合区分，避免仅依据英文 Queen 字样判断。

## 2026-08-17：CSS 模块化与版本发布

### 已完成

- 将单一的 `src/styles.css` 拆分为 `src/styles/` 下的功能模块，并由 `main.css` 作为唯一入口统一导入。
- 按设计令牌、基础样式、布局、导航、主角页、详情面板、家谱树、表单和响应式规则完成归类。
- 保留原有选择器、级联顺序、响应式断点、纹章定位和家谱缩放行为；`person-card.css` 暂留为空文件作为预留模块。
- `npm run build` 与 `git diff --check` 均通过。
- 创建并推送版本提交：`7ec12d6`，提交信息为 `26-08-17-01-feat: expand Wessex lineage and split stylesheets`。
- `docs/CLAUDE.local.md` 与编辑器临时文件未加入版本控制。

## 2026-08-17：至亲链关系排查与时间合理性校验

### 本次修正

- 排查 Hugues Capet、Hugh the Great、Robert I 等人物的至亲链，发现并移除“大于格错误连接诺曼底罗贝尔一世”的父子关系。
- 清除诺曼底罗贝尔一世指向不存在人物的孤儿 `fatherId`，避免把缺失人物误显示为已知父亲。
- 排查 Béatrice of Vermandois，移除她与诺曼底罗贝尔一世的错误配偶 UUID；保留贝阿特丽丝与大于格的母子关系。
- 明确记录：贝阿特丽丝的丈夫应为西法兰克国王罗贝尔一世，但该人物目前尚未录入，不能用同名的诺曼底公爵替代。
- `npm run build` 通过；关系引用检查未发现孤儿 UUID。

### 后续数据验收原则

- 至亲链不能只检查 UUID 是否存在，还必须检查父母方向、配偶双方和子女反向关系是否一致。
- 对每条父子关系执行出生年合理性检查：父母通常应比子女年长，代际差距不能明显违背生育年龄和历史年代。
- 对同名人物必须同时核对头衔、地区、王朝、出生年和来源链接，禁止仅凭姓名匹配关系。
- 对跨王朝婚姻，若配偶人物未录入，应保留史料备注和婚姻事件，但不要用相近姓名的人物 UUID 代替。
- 发现史料缺口时宁可暂时留空，也不建立看似完整但历史上错误的至亲链。

### 版本记录

- `26-08-17-02-feat: enrich historical data and validate kinship links`
- Commit：`288cd58`
- 已完成构建验收并推送至 `origin/main`；本地策略文件未纳入版本。

## 2026-08-17：人物卡全面补全工程（historicalRating >= 5）

### 目标

- 将全部 historicalRating >= 5 的人物卡补全到项目最完整人物（Henry II 51 分、Eleanor of Aquitaine 49 分）的水平。
- 12 名重点人物优先：William I、Henry I、John、Charlemagne、Richard I、Henry VII、Henry VIII、Elizabeth I、Philippe II Augustus、Alfred the Great、Edward I、Henry V。
- 严格沿用既有事件规则（类型/标签白名单、权重、YYYY.MM.DD 精度、争议标注），资料以英文维基百科为基线核对。

### 已完成

- **执行架构**：按成本策略拆分为 12 个并行研究子代理（按王朝分组：威塞克斯、诺曼、金雀花、卡佩、加洛林、普瓦图等），各自只读主数据、产出完整记录 payload 至 /tmp/enrich/，再由综合代理以 span 级精确替换合并入库——30 条未涉及记录的字节完全不变。
- **覆盖**：98 位 >=5 星人物中补全 96 位（Henry II 与 Eleanor 即基准，未动）。重点人物事件 12–16 条，其余按星级 3–11 条。
- **事件规模**：全库事件由约 160 条增至 796 条，净新增约 640 条（含补全期间用户手动新增并被保留的 4 条）。
- **字段**：全员补齐出生/死亡地与中文、deathCause 双语（normal/violent/violent_uncertain/uncertain 四态）、别名、称号、来源与备注；事件每条含 label/labelCn/type/tags/weight/wikiUrl，争议日期与传说材料均在 note 标注。
- **史实修正 20 条**：含 Roger Mortimer 身份甄别（第 4 代马奇伯爵，非被处决的第 1 代）、Anne Mortimer 生年 1390→1388、Louis VI 卒地、Guilhem III「秃头」→「亚麻头」误译、William II 死因按项目惯例定为明确非自然死亡、Morgan FitzRoy 与 Ramnulf I 的失效 wikiUrl 修复等；完整清单见 `people-entry-log.md` 末尾「资料补全状态」章节。
- **同名甄别**：Ælfthryth（佛兰德伯爵夫人 vs 埃德加之妻）、Eadgifu（长者爱德华之女 vs 其妻）、Marie de France（香槟伯爵夫人 vs 诗人）、两位 Richard II（诺曼 vs 英格兰）等均按 UUID 核实身份，未发生混链。
- **用户工作保全**：补全期间用户新增的 4 条事件全部保留；约克的理查「1453 任护国公」史实有误（实际 1454.3.27）且与新增正确条目重复，已删除错误条并保留更正说明。
- **条目日志**：`people-entry-log.md` 原历史表格未动，末尾追加 96 行补全状态表（评分/事件数/基础资料/缺口）与史实修正清单。

### 验收

- 126 人 UUID 全唯一；关系引用 0 孤儿；无重复人物、无重复事件。
- 事件 type/tag 全部通过白名单校验（修正 9 处将 political_crisis 误用作 tag 的事件）。
- 所有 >=5 星人物事件 >=3 条；William I（14 条）、Henry I（12 条）、John（15 条）基础资料全满，达到基准水平。
- `npm run build` 与 `git diff --check` 通过。

### 遗留

- 10 位人物出生/死亡地因史料无记载保留为空（Geoffroy V、Guilhem IX、Louis VII、Morgan FitzRoy 等），已在条目日志标注缺口原因。
- 配偶/子女不在人物库的婚姻只记事件、不建关系链接（亨利八世诸妻、Constance of Brittany 等），待人物库扩展后回填。
- 本轮补全与 UUID 化、CSS 拆分等前序工作均未提交，建议分批提交并各附验收说明。

## 2026-08-18：第三页「头衔谱系页」MVP 与标题统一

### 目标

- 新增第三页「Title Page / 头衔谱系页」，首条只实现 King of England 头衔链，仅连接 William I → William II → Henry I 三人，不扩展其他人物、王朝或头衔。
- 头衔数据独立成文件，不硬编码进组件；在产品层把 King of the English 与 King of England 视为同一连续王位，数据层保留名称演变语义。
- 统一项目名称文案为「Historical Family Tree / 历史人物家谱」。

### 已完成

- **头衔数据**：新增 `src/data/titles/king-of-england.json`，含 title UUID、canonicalName（EN/CN）、`form: "evolving"`、`aliases`、`nameForms`（King of the English 早期称谓 → King of England 领土称谓，各带起止与注释）与 `holders`（3 人，各含 personId/startYear/endYear/titleForm/note）。
- **1066 继承危机扩展**：新建忏悔者爱德华、哈罗德二世·戈德温森、威塞克斯伯爵戈德温三张双语完整人物卡（基础资料、头衔、双语死因、事件时间线、来源与备注）。英格兰王位链补为爱德华（1042–1066）→ 哈罗德二世（1066）→ 征服者威廉（1066–1087）→ 威廉二世 → 亨利一世；戈德温—哈罗德使用双向父子 UUID，爱德华—哈罗德只作为前后任头衔关系，不误建血缘边。
- **页面组件**：新增 `src/pages/TitlePage.tsx`，通过 `personId` 查 store 现有人物（不复制数据），personId 缺失时渲染虚线警告卡不崩溃；持有者卡在本页打开复用的详情面板，不跳转 Tree Page。
- **导航**：`PageTabs` 的 `AppPage` 类型扩为 `"protagonists" | "tree" | "titles"`，新增第三个导航按钮（EN「Titles」/ CN「头衔谱系」）；`App.tsx` 加 titles 页状态分支，`ProtagonistPage` 透传 `onTitles`。
- **文案**：`presentation.tsx` 新增 7 个 EN/CN 键（titlesPage、titleLineage、currentTitle、nameEvolution、titleHolders、reignYears、titlePersonMissing）。
- **样式**：新增 `src/styles/title-page.css`，沿用现有边框 `#8b6b43`、8px 圆角、同系阴影与米色渐变，宽度 `min(100% - 2rem, 1180px)` 居中；持有者改为与家谱树一致的紧凑人物节点和纵向传承箭头；`main.css` 按顺序 import。
- **人物节点统一**：启用原本预留的 `person-card.css`，抽取紧凑节点尺寸、圆角、边框和选中态令牌。Title Page 的金色双层外框（留白间隔 + 金色环）定为基准；Family Tree 的 SVG 选中层以等效外扩描边实现同一视觉层级，保留树专属的展开/收起控件。
- **头衔链控件**：Title Page 左上角增加与树页一致的固定控件层：缩放（50%–150%）、百分比重置、居中和 Back/Home。缩放仅作用于头衔链；Back 在本页回退此前查看的持有者详情，Home 返回首页。
- **详情页上下文入口**：DetailPanel 支持可选导航回调。Title Page 内点击王朝标签进入该人物为中心的家谱树；Tree Page 内点击已接入头衔链的主头衔进入对应 Title Page，并定位该人物。当前仅 `King of England / King of the English` 链启用，普通未建链头衔保持静态文字，避免虚假入口。
- **直接访问引导**：Titles 直接访问改为头衔目录入口：仅展示 `Kingdom of England` 与头衔搜索，人物卡不预先渲染；进入该条目后从征服者威廉开始传承链。来自详情卡的头衔跳转仍可直接定位已选持有者。
- **对称入口页**：Tree 的直接访问改为与 Titles 相同的目录层，不再在任意情形都展示威廉提示或立即渲染树。目录提供人物搜索和三项默认王朝入口：诺曼底→征服者威廉、金雀花→亨利二世、卡佩→腓力二世；点击才进入对应人物树。首页人物卡、详情 House 入口等已有上下文的操作仍直接进入人物树。
- **标题统一**：`index.html` 静态 `<title>` 与 `documentTitle`、`historicalFamilyTree`（主页 eyebrow）三处统一为 Historical Family Tree / 历史人物家谱；历史正文中的 Normandy / House of Normandy / 1066 Norman Conquest 等一律未动。
- **文案修正**：`divorced`（DIVORCED/离异）改为 `formerUnion`（FORMER UNION/前婚）——断裂婚线标签对教会婚姻无效（埃莉诺×路易七世、阿涅丝×腓力二世）不再误称 divorce。

### 验收

- `npm run build` 与 `git diff --check` 通过。
- 三位持有者 UUID 均真实存在于 `people.normandy.json`，holders 无重复、无误加第四人，全部 personId 可解析。
- Home / Tree / Titles 三页均可切换，EN/CN 文案齐全，无 TypeScript 错误。

### 遗留

- 当前仅一条头衔链、三位持有者；数据结构已按多 title、多 holders、evolving forms 设计，后续加 King of France 等只需加数据。
- William I、Henry I 缺中文显示字段（displayNameCn 等为空），CN 模式名字回退英文——属人物数据缺口，非本页范围。
- 头衔数据为前端静态 JSON（MVP 无后端 API）；API 模式只替换人物数组，不涉及头衔。
- 持有者链当前为竖直 ol + 箭头，横向链布局留待后续 media query。

## 2026-08-18：树页固定控件定位复盘

### 问题与原因

- 需求是树区域滚动或横向移动时，缩放、世代和 Back/Home 控件都保持在可视区域边缘。
- 初始实现中，缩放与世代控件使用 `position: sticky`，但 Back/Home 使用 `position: absolute`。`absolute` 的定位参照是 `.tree-shell` 的内容坐标，而非其滚动后的可视区域，因此树画布滚动时会随内容离开视口。
- 第一次修正只把 Back/Home 单独改为 `sticky`。这消除了部分滚动问题，但它仍是一个独立的文档流元素，和缩放控件不共享同一个固定锚点；视觉排列也不符合「同一左侧工具区」的意图。

### 最终方案

- 在 `FamilyTree.tsx` 中以 `.tree-fixed-controls` 包装 `.zoom-controls` 和 `.tree-nav-controls`。
- 仅外层容器承担 `position: sticky; top: 12px; left: 12px`，子控件不再各自定位。
- 容器采用纵向 flex 布局、左侧对齐：Zoom 在上，Back/Home 在下；它们共享同一定位参照和滚动生命周期。

### 防回归原则

- 对同一滚动容器内需固定在一起的 UI，应创建一个唯一的 sticky/fixed 父层；不要让相邻控件分别使用 absolute/sticky 混合定位。
- 验收不仅检查初始位置，还须在树画布纵向滚动、横向滚动、缩放后确认控件仍位于树区域可视左上角。
- `absolute` 只用于随树内容坐标移动的元素（例如右上角随画布出现的纹章）；不用于工具栏。

## 2026-08-18：查理曼子女修正与全局性别审计

### 目标

- 修复查理曼子女数据：补齐缺失的性别标识，补入缺失的主线继承人 Louis the Pious。
- 全局审计人物卡性别，可确认者据史料补 male/female，真正不明者保留 unknown。

### 已完成

- **性别补齐**：查理曼 17 名子女中除 Pepin of Italy 外 16 人 gender="unknown"，按英文维基百科逐一核实后全部补齐 male/female（男 6、女 10），全局 gender unknown 清零（female 32→42、male 95→101）。
- **核心遗漏补救**：新建 Louis the Pious（虔诚者路易，Louis I）完整人物卡——male、778–840、Carolingian dynasty、Holy Roman Emperor、9 条事件、historicalRating 9；双向接入父子关系（Charlemagne.childIds + Louis.fatherId）。查理曼子女由 17 增至 18 人，直系继承链补齐。
- **审计结论**：Person 类型 gender 为 string、schema.sql 默认 'unknown'、seed/API 均透传不覆盖，后端支持良好；本次仅数据层修正，未做无关架构改动。
- **身份澄清**：Hruodhaid（非婚生女，约 787 年生，卒年不确）与 Ruothild（Madelgard 之女，Faremoutiers 院长，卒 852-03-24）是两人，非同一人；初版误判已更正，两张卡独立保留、身份与年代分离。

### 验收

- JSON 有效、144 人 UUID 全唯一、所有 parent/spouse/child 引用 0 孤儿。
- 查理曼 18 名子女全部可解析，Louis the Pious 已在其中；子女生年 769–807 分布合理，双向父子关系正确。
- `npm run build` 与 `git diff --check` 通过。

### 经验与遗留

- **关系 UUID 有效 ≠ 主线人物完整**：此前验收只查 UUID 断链，未查主线继承人完整性，导致 Louis the Pious 缺失漏检。今后数据验收需同时覆盖「关键人物是否在库」「子女/继承人链是否完整」。
- 既有 Godwin 家族数据（Godwin、Harold II、Edward the Confessor）使用 `builder`、`exile` 两个未注册的 event tag（eventTagLabels 无对应文案，`tagText` 会回退英文原文），属本任务范围之外，已报告未改。

## 2026-08-18：史实不确定表述与性别标识视觉统一

### 已完成

- 哈罗德二世的死因与黑斯廷斯战役备注改为更自然的双语表述：中文使用“据说一箭射中其眼部”，英文使用 “reportedly after an arrow struck his eye”，保留史实不确定性但避免过度收敛的说明口吻。
- Title Page 人物节点的性别标识与 Family Tree 统一：男性使用蓝色斜体符号，女性使用粉色符号，并补齐描边与阴影以适配深色人物卡。
- 头衔入口从详情页主头衔移至 Titles 列表中对应的 `King of England` 行，主头衔保持静态展示，入口位置与语义一致。
- README 更新为当前项目范围、Home / Tree / Titles 三页结构，并加入不确定史实的表达原则。

### 验收

- `people.normandy.json` JSON 解析通过。
- `npm run build` 通过。
- 性别标识、头衔入口与哈罗德二世双语文案均为数据或展示层的局部修改，未改变既有关系模型。

## 2026-08-18：英格兰王位主链与北海帝国补齐

### 已完成

- **既有人物关系修复**：补齐埃德蒙一世→伊德维格、埃德加→殉道者爱德华、埃塞尔雷德二世↔诺曼底的艾玛、埃塞尔雷德二世／艾玛→忏悔者爱德华、诺曼底理查一世→艾玛、理查·约克→理查三世、亨利八世→爱德华六世等双向 UUID；未用王位先后关系伪造血缘。
- **北海帝国与诺曼连接**：新增斯温八字胡、克努特大帝、诺曼底的艾玛、野兔脚哈罗德、哈德克努特五张人物卡。斯温、克努特、艾玛含主要事件与双语资料；两位短期君主保留可靠基本资料和继承关系。
- **威塞克斯与后续缺卡**：新增伊德维格、殉道者爱德华、斯蒂芬、理查三世、爱德华六世；除必要死因与关系外遵守“基本信息优先”的录入范围。
- **头衔主链**：`King of England` 头衔数据由 5 位扩展为 40 个在位段，从埃塞尔斯坦（924）延伸至伊丽莎白一世（1603），包含斯温征服、埃塞尔雷德复位、北海帝国、1066、无政府时期与玫瑰战争中亨利六世／爱德华四世的复辟交替。
- **女王入口**：`Queen of England` 作为英格兰王位链的别名接入，玛丽一世和伊丽莎白一世可从详情页的 Titles 行进入同一头衔谱系。

### 验收

- 人物数 144 → 154；王位链 40 段持有记录全部指向存在的人物卡。
- 新增及修复关系的父母／子女双向引用逐项通过，所有关系 UUID 可解析，无孤儿引用。
- `npm run build` 与 `git diff --check` 通过。
