# Temporary Person Research Intake

> **Permanent format requirements — do not delete or edit this section.**
>
> This file is the handoff buffer for research gathered in a ChatGPT conversation. The user manually copies and pastes material into the staging area below. When an agent completes the corresponding person-card task, it must clear only the staging area; it must preserve this heading and every requirement in this section.

## Required research format

Provide one clearly separated record per person. Use factual, concise English; include Chinese wording where it is known or important to the interface.

```md
### [Canonical English name] — [historical rating / 5–10 stars]

- Existing card: [UUID, or `new person`]
- Names: [canonical name; native-language/alternative names; Chinese display name]
- Dates: [birth; death; uncertainty explicitly marked]
- Dynasty / House: [shared dynasty] / [specific house or territorial branch]
- Culture / faith: [...]
- Primary title: [English] / [Chinese]
- Titles: [title — start–end; include Chinese if known]
- Family: [father; mother; spouses; children; relationship certainty]
- Core events:
  - [YYYY[-MM[-DD]]] — [English event label] / [Chinese label] — [why it matters; include event type, tags, weight and direct source URL]
- Death: [cause/place only when reliably sourced]
- Historical note: [2–5 concise sentences appropriate to the star rating]
- Sources: [direct URLs; distinguish primary/official/academic references from orientation sources]
- Confidence / caveats: [uncertain dates, disputed parentage, title ambiguity, or `none`]
```

### Example — Eleanor of Aquitaine

### Eleanor of Aquitaine — 9 stars

- Existing card: `cbb11a70-0b0f-40ca-b9c6-95426b904bf6`
- Names: Eleanor of Aquitaine; Aliénor d’Aquitaine; 阿基坦的埃莉诺
- Dates: c.1122 – 1 April 1204
- Dynasty / House: House of Poitiers / House of Poitiers
- Culture / faith: Occitan / Catholic
- Primary title: Queen of England / 英格兰王后
- Titles: Duchess of Aquitaine / 阿基坦女公爵 (1137–1204); Queen of France / 法兰西王后 (1137–1152); Queen of England / 英格兰王后 (1154–1189)
- Family: father William X, Duke of Aquitaine; spouses Louis VII of France and Henry II of England; mother not recorded in the current roster; children include Marie and Alix of France, Henry the Young King, Richard I, Geoffrey II, John, Matilda, Eleanor and Joan.
- Core events:
  - 1137 — Became Duchess of Aquitaine / 成为阿基坦女公爵 — inherited Aquitaine after William X’s death.
  - 1137-07-25 — Married Louis, heir to France / 与法兰西王储路易成婚 — joined Aquitaine to the Capetian royal marriage.
  - 1137-12-25 — Crowned Queen of France / 加冕为法兰西王后.
  - 1147 — Took part in the Second Crusade / 参加第二次十字军东征.
  - 1152-03-21 — Marriage to Louis VII annulled / 与路易七世的婚姻被宣告无效.
  - 1152-05-18 — Married Henry, Duke of Normandy / 与诺曼底公爵亨利成婚 — foundation of the Angevin political union.
  - 1154-12-19 — Crowned Queen of England / 加冕为英格兰王后.
  - 1173–1174 — Supported the revolt of her sons / 支持 1173—1174 年叛乱 — subsequently imprisoned by Henry II.
  - 1189 — Released; helped secure Richard I’s succession / 获释并协助理查一世继位.
  - 1192 — Raised Richard I’s ransom / 筹集理查一世的赎金.
  - 1200 — Travelled to Castile for Blanche’s marriage negotiations / 出使卡斯蒂利亚商议布兰奇婚事.
- Death: died naturally at Fontevraud Abbey, Anjou, in 1204.
- Historical note: Duchess of Aquitaine in her own right, Eleanor was successively queen of France and England. Her marriage to Henry II joined Aquitaine to the Angevin sphere, making her central to the long Capetian-Plantagenet rivalry. She remained politically active into old age as regent, diplomat and dynastic patron.
- Sources: https://en.wikipedia.org/wiki/Eleanor_of_Aquitaine ; add a second strong direct source before using this as production research.
- Confidence / caveats: birth year is conventionally c.1122; the current roster does not yet record her mother.

### Detail standard by rating

- **10 stars:** 15–25 dated core events; full major titles, family, historical note, and at least two strong sources.
- **9 stars:** 10–16 dated core events; complete principal titles, family, and at least two sources.
- **8 stars:** 7–10 dated core events; principal titles, core family, and one or two sources.
- **7 stars:** 5–7 dated core events; core biography and at least one reliable source.
- **6 stars:** 3–5 dated core events; basic biography and one reliable source.
- **5 stars:** 2–3 dated core events; minimum biography, title, core relationship, and one reliable source.

### Required event payload

For every researched person rated 5 stars or higher, include the complete `events` array in the JSON payload. Each event must use this project-ready shape:

```json
{
  "year": 0,
  "month": 0,
  "day": 0,
  "type": "",
  "tags": [],
  "weight": 0,
  "label": "",
  "labelCn": "",
  "wikiUrl": "",
  "note": ""
}
```

- Omit `month`, `day`, and `note` when no reliable value is available; never invent precision.
- Meet the rating-specific event count above on first submission. A card is not complete without its events.
- Cover succession, titles, marriage, childbirth, warfare, government, diplomacy, captivity, abdication, and death only when materially relevant.
- Women’s reliable biological births may be separate `childbirth` events; apply the childbirth rule below.

### Non-negotiable data rules

- Do not invent dates, relationships, events, death causes, or sources. State uncertainty explicitly.
- `Dynasty` is the wider shared bloodline; `House` is the concrete territorial/cadet branch.
- Preserve established project naming conventions and existing UUIDs. Do not create duplicate people.
- A reigning queen is a monarch, not a consort. A spouse’s title does not automatically become the other spouse’s title.
- Prefer exact dates when reliable; otherwise use only the year.
- Event labels must be concise, non-duplicative, and useful on a timeline.
- **Childbirth events for women:** record a separate `childbirth` event for each reliably attested biological birth when the child is in the roster or the birth materially affects succession, alliance, or the person’s historical role. Use `Birth of [child] / [child Chinese name]`; give the exact date when reliable, otherwise the year only. Do not create childbirth events for stepchildren, a spouse’s children by another partner, miscarriages, or disputed offspring. For 8–10 star women, a documented sequence of children is normally part of the core timeline (as in the Eleanor example); for 5–7 stars, retain only births with direct dynastic significance rather than padding the card.
- Sources must be direct links, not search-result pages.



---


## User paste staging area — agent clears this after completing the matching person-card task
