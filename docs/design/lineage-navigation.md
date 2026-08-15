# Lineage Navigation Rules

The tree has two different expansion concepts:

- The top `+` / `-` on a person card continues or collapses the bloodline above that card.
- The bottom-right `+` / `-` controls whether that person's spouse or partner is visible.

The top control is intentionally generic and stable: it follows `fatherId`
first, and falls back to `motherId` only when the father is not recorded. It
does not silently change from a paternal route to a longer maternal route.
Maternal transitions are explicit: the user opens the relevant spouse card and
then continues that branch with its own top control. This keeps a `+` click
from changing both lineage direction and node placement at the same time.

This keeps the data model simple: parentage remains in `fatherId` and
`motherId`, while spouse visibility remains an independent presentation choice.
As a result, long paternal routes can be expanded with repeated top `+` clicks,
while maternal routes remain deliberate and visually traceable through the
marriage node. No person-specific rule or branch lock is required.
