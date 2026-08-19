import { useRef, useState } from "react";
import { useFamilyStore } from "../store";
import { DetailPanel } from "../features/people/DetailPanel";
import { copyFor, dynastyCn, genderMark, initials, textFor, titleTier } from "../features/shared/presentation";
import { PageTabs } from "../components/PageTabs";
import kingOfEnglandData from "../data/titles/king-of-england.json";
import kingOfFranceData from "../data/titles/king-of-france.json";
import kingOfScotlandData from "../data/titles/kingdom-of-scotland.json";
import holyRomanEmperorData from "../data/titles/holy-roman-emperor.json";
import kingOfEastFranciaData from "../data/titles/king-of-east-francia.json";

type TitleHolder =
  | { kind?: "person"; personId: string; startYear: number | ""; endYear: number | ""; titleForm: string; note: string; noteCn: string; }
  | { kind: "gap"; personId: null; startYear: number | ""; endYear: number | ""; titleForm: string; titleFormCn: string; note: string; noteCn: string; arrowNote?: string; arrowNoteCn?: string; sideNote?: string; sideNoteCn?: string; };

type TitleLineage = {
  id: string;
  canonicalName: string;
  canonicalNameCn: string;
  form: string;
  aliases: string[];
  nameForms: Array<{ name: string; nameCn: string; fromYear: number | ""; untilYear: number | ""; note: string; noteCn: string }>;
  holders: TitleHolder[];
  houseOverrides?: Record<string, { en: string; cn: string }>;
};

const kingOfEngland = kingOfEnglandData as unknown as TitleLineage;
const kingOfFrance = kingOfFranceData as unknown as TitleLineage;
const kingOfScotland = kingOfScotlandData as unknown as TitleLineage;
const holyRomanEmperor = holyRomanEmperorData as unknown as TitleLineage;
const kingOfEastFrancia = kingOfEastFranciaData as unknown as TitleLineage;

type LineageEntry = {
  lineage: TitleLineage;
  name: string;
  nameCn: string;
  anchorId: string;
  isDefault: boolean;
};

const LINEAGES: LineageEntry[] = [
  { lineage: kingOfEngland, name: "Kingdom of England", nameCn: "英格兰王国", anchorId: "21b5ec21-1812-4731-8b03-721988be302f", isDefault: true },
  { lineage: kingOfFrance, name: "Kingdom of France", nameCn: "法兰西王国", anchorId: "7cc009b6-08d8-459b-b40e-2921bf3e4580", isDefault: true },
  { lineage: kingOfScotland, name: "Kingdom of Scotland", nameCn: "苏格兰王国", anchorId: "086c99e5-0a45-493c-aee1-4dc08057197f", isDefault: false },
  { lineage: holyRomanEmperor, name: "Holy Roman Empire", nameCn: "神圣罗马帝国", anchorId: "3dd7dc1c-7473-495d-aac7-0c145d147ed9", isDefault: true },
  { lineage: kingOfEastFrancia, name: "East Francia", nameCn: "东法兰克", anchorId: "140ea34c-2546-4e55-bed6-fa8b7fbd9848", isDefault: false },
];

export function TitlePage({
  onHome,
  onTree,
  onOpenHouse,
  initialPersonId,
}: {
  onHome: () => void;
  onTree: () => void;
  onOpenHouse: (personId: string) => void;
  initialPersonId?: string;
}) {
  const people = useFamilyStore((state) => state.people);
  const language = useFamilyStore((state) => state.language);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const t = copyFor(language);
  const byId = new Map(people.map((person) => [person.id, person]));
  const initialEntry =
    LINEAGES.find(({ lineage }) => lineage.holders.some(({ personId }) => personId === initialPersonId)) ?? LINEAGES[0];
  const [activeEntry, setActiveEntry] = useState<LineageEntry>(initialEntry);
  const [detailPersonId, setDetailPersonId] = useState(
    initialEntry.lineage.holders.some(({ personId }) => personId === initialPersonId)
      ? initialPersonId ?? ""
      : initialEntry.lineage.holders[0]?.personId ?? "",
  );
  const [detailHistory, setDetailHistory] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isLineageOpen, setLineageOpen] = useState(Boolean(initialPersonId));
  const [titleSearch, setTitleSearch] = useState("");
  const titleShellRef = useRef<HTMLDivElement | null>(null);

  const isCn = language === "cn";
  const holderNote = (holder: TitleHolder) => (isCn ? holder.noteCn : holder.note);
  const titleQuery = titleSearch.trim().toLocaleLowerCase();
  const isLineageVisible = ({ lineage, name, nameCn }: LineageEntry) =>
    !titleQuery ||
    [lineage.canonicalName, lineage.canonicalNameCn, ...lineage.aliases, name, nameCn]
      .some((label) => label.toLocaleLowerCase().includes(titleQuery));

  const visibleLineages = LINEAGES.filter((entry) => (titleQuery ? isLineageVisible(entry) : entry.isDefault));

  function openLineage(entry: LineageEntry) {
    setActiveEntry(entry);
    setDetailPersonId(entry.anchorId);
    setDetailHistory([]);
    setZoom(1);
    setLineageOpen(true);
  }

  function selectHolder(id: string) {
    if (id === detailPersonId) return;
    setDetailHistory((history) => [...history, detailPersonId]);
    setDetailPersonId(id);
  }

  function goBackHolder() {
    setDetailHistory((history) => {
      const previous = history[history.length - 1];
      if (!previous) return history;
      setDetailPersonId(previous);
      return history.slice(0, -1);
    });
  }

  function centerChain() {
    titleShellRef.current
      ?.querySelector<HTMLElement>(".title-person-node.selected")
      ?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }

  return (
    <main className="title-page">
      <div className="title-page-topbar">
        <p className="eyebrow">{t.titleLineage}</p>
        <div className="topbar-actions">
          <PageTabs page="titles" onHome={onHome} onTree={onTree} onTitles={() => { setLineageOpen(false); setTitleSearch(""); }} />
          <div className="language-toggle" aria-label={t.language}>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" className={language === "cn" ? "active" : ""} onClick={() => setLanguage("cn")}>CN</button>
          </div>
        </div>
      </div>

      {isLineageOpen ? (
      <section className="title-lineage">
        <header className="title-lineage-header">
          <h1>{t.titleLineage}</h1>
          <p className="eyebrow">{t.currentTitle}</p>
          <button type="button" className="title-entry-card" aria-pressed="true" onClick={() => setLineageOpen(false)}>
            <span className="title-entry-name">{activeEntry.name}</span>
            <span className="title-entry-name-cn">{activeEntry.nameCn}</span>
          </button>
        </header>

        <section className="title-workspace">
          <div ref={titleShellRef} className="title-tree-shell" aria-label={t.titleHolders}>
            <div className="title-fixed-controls">
              <div className="zoom-controls" aria-label={t.zoomControls}>
                <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))} aria-label={t.zoomOut}>-</button>
                <button type="button" onClick={() => setZoom(1)} aria-label={t.resetZoom}>{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))} aria-label={t.zoomIn}>+</button>
                <button type="button" className="tree-focus-button" onClick={centerChain} aria-label={t.centerFocus} title={t.centerFocus}>◎</button>
              </div>
              <div className="tree-nav-controls" aria-label={t.treeNavigation}>
                <button type="button" onClick={goBackHolder} disabled={detailHistory.length === 0}>{t.back}</button>
                <button type="button" onClick={onHome}>{t.home}</button>
              </div>
            </div>
            <div className="title-tree-canvas" style={{ "--title-zoom": zoom } as React.CSSProperties}>
              <ol className="title-holder-chain">
            {activeEntry.lineage.holders.map((holder, index) => {
              if (holder.kind === "gap") {
                const gapNote = isCn ? holder.sideNoteCn : holder.sideNote;
                const arrowNote = isCn ? holder.arrowNoteCn : holder.arrowNote;
                return (
                <li key={`gap-${holder.startYear}`} className="title-holder">
                    {index > 0 && (
                      <span className="title-holder-arrow" aria-label={arrowNote || holderNote(holder)}>
                        <span className="title-arrow-line" aria-hidden="true" />
                        {arrowNote ? <span className="title-arrow-note">{arrowNote}</span> : null}
                      </span>
                    )}
                    <div className="title-gap-row">
                      <div className="title-gap-node">
                        <span className="title-node-title">{isCn ? holder.titleFormCn : holder.titleForm}</span>
                        <span className="title-node-years">{holder.startYear || "?"}–{holder.endYear || "?"}</span>
                      </div>
                      {gapNote ? <span className="title-gap-note">{gapNote}</span> : null}
                    </div>
                  </li>
                );
              }
              const person = byId.get(holder.personId);
              if (!person) {
                return (
                <li key={`${holder.personId}-${holder.startYear}`} className="title-holder title-holder-missing">
                    <p className="title-person-missing">{t.titlePersonMissing}</p>
                    <span className="title-holder-years">
                      {holder.startYear || "?"}–{holder.endYear || "?"}
                    </span>
                  </li>
                );
              }
              const label = textFor(person, language);
              const house = person.house || person.dynasty;
              const houseOverride = activeEntry.lineage.houseOverrides?.[person.id];
              const houseText = houseOverride ? (isCn ? houseOverride.cn : houseOverride.en) : (house ? (isCn ? dynastyCn(house) : house) : "");
              return (
                <li key={`${holder.personId}-${holder.startYear}`} className="title-holder">
                  {index > 0 && (
                    <span className="title-holder-arrow" aria-label={holderNote(holder)}>
                      <span className="title-arrow-line" aria-hidden="true" />
                      <span className="title-arrow-note">{holderNote(holder)}</span>
                    </span>
                  )}
                  <div className="title-holder-row">
                    <button
                      type="button"
                      className={`title-person-node tier-${titleTier(person)} ${person.tags.includes("illegitimate") ? "illegitimate" : ""} ${detailPersonId === person.id ? "selected" : ""}`}
                      onClick={() => selectHolder(person.id)}
                      aria-label={`${t.select} ${label.fullName}`}
                    >
                      <span className={`title-node-gender ${person.gender}`}>{genderMark(person)}</span>
                      <span className="title-node-avatar">{initials(person, language)}</span>
                      <span className="title-node-name">{label.displayName}</span>
                      <span className="title-node-title">{holder.titleForm}</span>
                      <span className="title-node-years">{holder.startYear || "?"}–{holder.endYear || "?"}</span>
                    </button>
                    {houseText ? <span className="title-holder-house">{houseText}</span> : null}
                  </div>
                </li>
              );
            })}
              </ol>
            </div>
          </div>
          <DetailPanel
            personId={detailPersonId}
            onOpenHouse={onOpenHouse}
            onOpenTitleLineage={selectHolder}
          />
        </section>
      </section>
      ) : (
        <section className="title-catalog" aria-label={t.titleLineage}>
          <header className="title-catalog-header">
            <p className="eyebrow">{t.titleLineage}</p>
            <h1>{t.titleLineage}</h1>
            <p className="title-intro">{t.titleIntro}</p>
          </header>
          <label className="title-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              value={titleSearch}
              onChange={(event) => setTitleSearch(event.target.value)}
              placeholder={t.searchTitles}
              aria-label={t.searchTitles}
            />
          </label>
          <div className="title-catalog-results">
            {visibleLineages.length > 0 ? (
              visibleLineages.map((entry) => (
                <button key={entry.lineage.id} type="button" className="title-entry-card" onClick={() => openLineage(entry)}>
                  <span className="title-entry-name">{entry.name}</span>
                  <span className="title-entry-name-cn">{entry.nameCn}</span>
                </button>
              ))
            ) : <p className="title-search-empty">{t.noMatchingTitles}</p>}
          </div>
        </section>
      )}
    </main>
  );
}
