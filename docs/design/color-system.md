# Rank Fill Color System

The family tree uses fill color for political status and relationship context. A dark fill means a reigning or highest-level sovereign; a light fill means a consort or a lower-status title.

| Rank or role | Fill | CSS hex |
| --- | --- | --- |
| Emperor | Deep purple | `#56316f` |
| Empress | Light purple | `#c6a9d8` |
| Supreme King / highest royal authority, including King of France | Deep indigo | `#283b72` |
| Supreme Queen, such as Queen of France when not marked consort | Light blue-purple | `#aab8d6` |
| King / reigning Queen | Deep red | `#6f2026` |
| Queen Consort / King Consort | Light red | `#c98288` |
| Duke | Light blue | `#9cc4d6` |
| Count / Countess | Grey-green | `#aab8ad` |
| Noble with a recorded title | Light grey | `#d8d2c8` |
| No clear title | Warm ivory | `#fff8e8` |
| Illegitimate child | Warm ivory fill with dark grey dashed border | `#fff8e8` + dashed border |

## Classification rule

`Empress` and `Emperor` are matched before other title terms. A person tagged `consort` and carrying a queen title uses the Queen Consort color, even if another title such as `Queen of France` is present. This keeps Eleanor of Aquitaine visually distinct from a reigning queen while preserving her historical titles in the data.
