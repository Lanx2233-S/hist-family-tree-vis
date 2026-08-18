import { useRef, useState } from "react";
import { useFamilyStore } from "../store";
import { DetailPanel } from "../features/people/DetailPanel";
import { copyFor, genderMark, initials, textFor, titleTier } from "../features/shared/presentation";
import { PageTabs } from "../components/PageTabs";
import kingOfEnglandData from "../data/titles/king-of-england.json";

type TitleHolder = {
  personId: string;
  startYear: number | "";
  endYear: number | "";
  titleForm: string;
  note: string;
  noteCn: string;
};

type TitleLineage = {
  id: string;
  canonicalName: string;
  canonicalNameCn: string;
  form: string;
  aliases: string[];
  nameForms: Array<{ name: string; nameCn: string; fromYear: number | ""; untilYear: number | ""; note: string; noteCn: string }>;
  holders: TitleHolder[];
};

const kingOfEngland = kingOfEnglandData as unknown as TitleLineage;
const williamIId = "21b5ec21-1812-4731-8b03-721988be302f";

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
  const [detailPersonId, setDetailPersonId] = useState(
    kingOfEngland.holders.some(({ personId }) => personId === initialPersonId)
      ? initialPersonId ?? ""
      : kingOfEngland.holders[0]?.personId ?? "",
  );
  const [detailHistory, setDetailHistory] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isLineageOpen, setLineageOpen] = useState(Boolean(initialPersonId));
  const [titleSearch, setTitleSearch] = useState("");
  const titleShellRef = useRef<HTMLDivElement | null>(null);

  const isCn = language === "cn";
  const holderNote = (holder: TitleHolder) => (isCn ? holder.noteCn : holder.note);
  const titleQuery = titleSearch.trim().toLocaleLowerCase();
  const isEnglandTitleVisible = !titleQuery || [
    kingOfEngland.canonicalName,
    kingOfEngland.canonicalNameCn,
    ...kingOfEngland.aliases,
  ].some((name) => name.toLocaleLowerCase().includes(titleQuery));

  function openEnglandLineage() {
    setDetailPersonId(williamIId);
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
            <span className="title-entry-name">Kingdom of England</span>
            <span className="title-entry-name-cn">英格兰王国</span>
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
            {kingOfEngland.holders.map((holder, index) => {
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
              return (
                <li key={`${holder.personId}-${holder.startYear}`} className="title-holder">
                  {index > 0 && (
                    <span className="title-holder-arrow" aria-label={holderNote(holder)}>
                      <span className="title-arrow-line" aria-hidden="true" />
                      <span className="title-arrow-note">{holderNote(holder)}</span>
                    </span>
                  )}
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
            {isEnglandTitleVisible ? (
              <button type="button" className="title-entry-card" onClick={openEnglandLineage}>
                <span className="title-entry-name">Kingdom of England</span>
                <span className="title-entry-name-cn">英格兰王国</span>
              </button>
            ) : <p className="title-search-empty">{t.noMatchingTitles}</p>}
          </div>
        </section>
      )}
    </main>
  );
}
