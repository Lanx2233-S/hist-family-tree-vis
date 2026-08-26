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
import kingdomOfSicilyData from "../data/titles/kingdom-of-sicily.json";
import duchyOfBurgundyData from "../data/titles/duchy-of-burgundy.json";
import duchyOfNormandyData from "../data/titles/duchy-of-normandy.json";
import countyOfChampagneData from "../data/titles/county-of-champagne.json";
import kingOfNavarreData from "../data/titles/king-of-navarre.json";
import duchyOfAquitaineData from "../data/titles/duchy-of-aquitaine.json";
import countyOfToulouseData from "../data/titles/county-of-toulouse.json";
import countyOfAnjouData from "../data/titles/county-of-anjou.json";
import kingdomOfJerusalemData from "../data/titles/kingdom-of-jerusalem.json";
import countyOfFlandersData from "../data/titles/county-of-flanders.json";
import countyOfHainautData from "../data/titles/county-of-hainaut.json";
import countyOfProvenceData from "../data/titles/county-of-provence.json";
import duchyOfBrabantData from "../data/titles/duchy-of-brabant.json";
import duchyOfBavariaData from "../data/titles/duchy-of-bavaria.json";
import duchyOfAustriaData from "../data/titles/duchy-of-austria.json";
import kingdomOfDenmarkData from "../data/titles/kingdom-of-denmark.json";
import kingdomOfCastileData from "../data/titles/kingdom-of-castile.json";
import kingdomOfAragonData from "../data/titles/kingdom-of-aragon.json";
import kingdomOfBohemiaData from "../data/titles/kingdom-of-bohemia.json";
import byzantineEmpireData from "../data/titles/byzantine-empire.json";
import rashidunCaliphateData from "../data/titles/rashidun-caliphate.json";

type TitleHolder =
  | { kind?: "person"; personId: string; startYear: number | ""; endYear: number | ""; titleForm: string; note: string; noteCn: string; tierOverride?: string; jointWithPrevious?: boolean; }
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
const kingdomOfSicily = kingdomOfSicilyData as unknown as TitleLineage;
const duchyOfBurgundy = duchyOfBurgundyData as unknown as TitleLineage;
const duchyOfNormandy = duchyOfNormandyData as unknown as TitleLineage;
const countyOfChampagne = countyOfChampagneData as unknown as TitleLineage;
const kingOfNavarre = kingOfNavarreData as unknown as TitleLineage;
const duchyOfAquitaine = duchyOfAquitaineData as unknown as TitleLineage;
const countyOfToulouse = countyOfToulouseData as unknown as TitleLineage;
const countyOfAnjou = countyOfAnjouData as unknown as TitleLineage;
const countyOfHainaut = countyOfHainautData as unknown as TitleLineage;
const duchyOfBrabant = duchyOfBrabantData as unknown as TitleLineage;
const duchyOfBavaria = duchyOfBavariaData as unknown as TitleLineage;
const duchyOfAustria = duchyOfAustriaData as unknown as TitleLineage;
const kingdomOfDenmark = kingdomOfDenmarkData as unknown as TitleLineage;
const kingdomOfCastile = kingdomOfCastileData as unknown as TitleLineage;
const kingdomOfAragon = kingdomOfAragonData as unknown as TitleLineage;
const kingdomOfBohemia = kingdomOfBohemiaData as unknown as TitleLineage;
const byzantineEmpire = byzantineEmpireData as unknown as TitleLineage;
const rashidunCaliphate = rashidunCaliphateData as unknown as TitleLineage;

type LineageEntry = {
  lineage: TitleLineage;
  name: string;
  nameCn: string;
  anchorId: string;
  isDefault: boolean;
  showInDirectory?: boolean;
  directoryGroup: "kingdom" | "france" | "hre";
  theme?: "england" | "france" | "germany" | "castile" | "byzantium" | "rashidun" | "aragon" | "sicily" | "bohemia" | "denmark" | "navarre";
  emblem?: { src: string; alt: string };
};

const LINEAGES: LineageEntry[] = [
  { lineage: kingOfEngland, name: "Kingdom of England", nameCn: "英格兰王国", anchorId: "21b5ec21-1812-4731-8b03-721988be302f", isDefault: true, directoryGroup: "kingdom", theme: "england" },
  { lineage: kingOfFrance, name: "Kingdom of France", nameCn: "法兰西王国", anchorId: "7cc009b6-08d8-459b-b40e-2921bf3e4580", isDefault: true, directoryGroup: "kingdom", theme: "france" },
  { lineage: holyRomanEmperor, name: "Holy Roman Empire", nameCn: "神圣罗马帝国", anchorId: "3dd7dc1c-7473-495d-aac7-0c145d147ed9", isDefault: true, directoryGroup: "kingdom", theme: "germany" },
  { lineage: byzantineEmpire, name: "Byzantine Empire", nameCn: "拜占庭帝国", anchorId: "1ce160f2-c91e-4a3c-9c39-01f49c7c221e", isDefault: true, directoryGroup: "kingdom", theme: "byzantium", emblem: { src: "/images/heraldry/title/late-roman-chi-rho.png", alt: "Chi-Rho emblem" } },
  { lineage: kingdomOfCastile, name: "Kingdom of Castile", nameCn: "卡斯蒂利亚王国", anchorId: "c1026000-0000-4000-8000-000000000001", isDefault: true, directoryGroup: "kingdom", theme: "castile" },
  { lineage: rashidunCaliphate, name: "Rashidun Caliphate", nameCn: "正统哈里发国", anchorId: "b54d8195-66ad-4668-b9dc-a117a2d9e51b", isDefault: true, directoryGroup: "kingdom", theme: "rashidun" },
  { lineage: kingOfScotland, name: "Kingdom of Scotland", nameCn: "苏格兰王国", anchorId: "086c99e5-0a45-493c-aee1-4dc08057197f", isDefault: false, directoryGroup: "kingdom" },
  { lineage: kingOfEastFrancia, name: "East Francia", nameCn: "东法兰克", anchorId: "140ea34c-2546-4e55-bed6-fa8b7fbd9848", isDefault: false, directoryGroup: "kingdom" },
  { lineage: kingdomOfSicily, name: "Kingdom of Sicily", nameCn: "西西里王国", anchorId: "5b57dd7c-5717-4f3a-8a6c-e8c26a2bbaef", isDefault: true, directoryGroup: "kingdom", theme: "sicily" },
  { lineage: kingdomOfDenmark, name: "Kingdom of Denmark", nameCn: "丹麦王国", anchorId: "c1019000-0000-4000-8000-000000000000", isDefault: true, directoryGroup: "kingdom", theme: "denmark" },
  { lineage: kingdomOfAragon, name: "Kingdom of Aragon", nameCn: "阿拉贡王国", anchorId: "e1010000-0000-4000-8000-000000000001", isDefault: true, directoryGroup: "kingdom", theme: "aragon" },
  { lineage: kingdomOfBohemia, name: "Kingdom of Bohemia", nameCn: "波希米亚王国", anchorId: "80b3801a-ffca-4136-ba92-293b6b976e85", isDefault: true, directoryGroup: "kingdom", theme: "bohemia" },
  { lineage: duchyOfBurgundy, name: "Duchy of Burgundy", nameCn: "勃艮第公国", anchorId: duchyOfBurgundy.holders[0].personId ?? "", isDefault: false, directoryGroup: "france" },
  { lineage: duchyOfNormandy, name: "Duchy of Normandy", nameCn: "诺曼底公国", anchorId: duchyOfNormandy.holders[0].personId ?? "", isDefault: false, directoryGroup: "france" },
  { lineage: countyOfChampagne, name: "County of Champagne", nameCn: "香槟伯国", anchorId: "c7080000-0000-4000-8000-000000000008", isDefault: false, directoryGroup: "france" },
  { lineage: kingOfNavarre, name: "Kingdom of Navarre", nameCn: "纳瓦拉王国", anchorId: kingOfNavarre.holders[0].personId ?? "", isDefault: true, directoryGroup: "kingdom", theme: "navarre" },
  { lineage: duchyOfAquitaine, name: "Duchy of Aquitaine", nameCn: "阿基坦公国", anchorId: duchyOfAquitaine.holders[0].personId ?? "", isDefault: false, directoryGroup: "france" },
  { lineage: countyOfToulouse, name: "County of Toulouse", nameCn: "图卢兹伯国", anchorId: "c9040000-0000-4000-8000-000000000004", isDefault: false, directoryGroup: "france" },
  { lineage: countyOfAnjou, name: "County of Anjou", nameCn: "安茹伯国", anchorId: "cc0cb400-e684-4bdb-b477-9a8fb578f4f5", isDefault: false, directoryGroup: "france" },
  { lineage: kingdomOfJerusalemData as unknown as TitleLineage, name: "Kingdom of Jerusalem", nameCn: "耶路撒冷王国", anchorId: "c9390000-0000-4000-8000-000000000035", isDefault: false, directoryGroup: "kingdom" },
  { lineage: countyOfFlandersData as unknown as TitleLineage, name: "County of Flanders", nameCn: "佛兰德伯国", anchorId: "c9740000-0000-4000-8000-000000000000", isDefault: false, directoryGroup: "france" },
  { lineage: countyOfProvenceData as unknown as TitleLineage, name: "County of Provence", nameCn: "普罗旺斯伯国", anchorId: "c9910000-0000-4000-8000-000000000001", isDefault: false, directoryGroup: "france" },
  { lineage: duchyOfBrabant, name: "Duchy of Brabant", nameCn: "布拉班特公国", anchorId: "c1006000-0000-4000-8000-000000000000", isDefault: false, directoryGroup: "hre" },
  { lineage: duchyOfBavaria, name: "Duchy of Bavaria", nameCn: "巴伐利亚公国", anchorId: "58be4d4c-d7ff-470a-953f-48e5a9401cec", isDefault: false, directoryGroup: "hre" },
  { lineage: duchyOfAustria, name: "Duchy of Austria", nameCn: "奥地利公国", anchorId: "268c6586-a041-4aa7-9d66-92a7af3c4ac6", isDefault: false, directoryGroup: "hre" },
  { lineage: countyOfHainaut, name: "County of Hainaut", nameCn: "埃诺伯国", anchorId: "f1010000-0000-4000-8000-000000000001", isDefault: false, directoryGroup: "hre" },
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
  const [isDirectoryOpen, setDirectoryOpen] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [catalogPage, setCatalogPage] = useState(0);
  const titleShellRef = useRef<HTMLDivElement | null>(null);

  const isCn = language === "cn";
  const holderNote = (holder: TitleHolder) => (isCn ? holder.noteCn : holder.note);
  const titleQuery = titleSearch.trim().toLocaleLowerCase();
  const isLineageVisible = ({ lineage, name, nameCn }: LineageEntry) =>
    !titleQuery ||
    [lineage.canonicalName, lineage.canonicalNameCn, ...lineage.aliases, name, nameCn]
      .some((label) => label.toLocaleLowerCase().includes(titleQuery));

  const catalogPageSize = 10;
  const featuredLineageOrder = ["king-of-england", "king-of-france", "holy-roman-emperor", "byzantine-empire", "kingdom-of-castile", "rashidun-caliphate", "kingdom-of-aragon", "kingdom-of-sicily", "kingdom-of-bohemia", "kingdom-of-denmark", "king-of-navarre"];
  const catalogLineages = LINEAGES
    .filter((entry) => (titleQuery ? isLineageVisible(entry) : entry.isDefault))
    .sort((a, b) => titleQuery ? 0 : featuredLineageOrder.indexOf(a.lineage.id) - featuredLineageOrder.indexOf(b.lineage.id));
  const catalogPageCount = titleQuery ? 1 : Math.max(1, Math.ceil(catalogLineages.length / catalogPageSize));
  const visibleLineages = titleQuery ? catalogLineages : catalogLineages.slice(catalogPage * catalogPageSize, (catalogPage + 1) * catalogPageSize);
  const lineageStartYear = (lineage: TitleLineage) => Number(lineage.nameForms[0]?.fromYear || lineage.holders[0]?.startYear || Infinity);
  const directoryLineages = (group: LineageEntry["directoryGroup"]) => LINEAGES
    .filter((entry) => (!entry.isDefault || entry.showInDirectory) && entry.directoryGroup === group)
    .sort((a, b) => lineageStartYear(a.lineage) - lineageStartYear(b.lineage));
  const holderGroups = activeEntry.lineage.holders.reduce<Array<{ holders: TitleHolder[]; firstIndex: number }>>((groups, holder, index) => {
    const previousGroup = groups[groups.length - 1];
    if (holder.kind !== "gap" && holder.jointWithPrevious && previousGroup?.holders.every((item: TitleHolder) => item.kind !== "gap")) {
      previousGroup.holders.push(holder);
    } else {
      groups.push({ holders: [holder], firstIndex: index });
    }
    return groups;
  }, []);

  function openLineage(entry: LineageEntry) {
    setActiveEntry(entry);
    setDetailPersonId(entry.anchorId);
    setDetailHistory([]);
    setZoom(1);
    setDirectoryOpen(false);
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
        <div className="topbar-actions">
          <PageTabs page="titles" onHome={onHome} onTree={onTree} onTitles={() => { setLineageOpen(false); setTitleSearch(""); setCatalogPage(0); }} />
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
          <button type="button" className={`title-entry-card${activeEntry.theme ? ` title-entry-card--${activeEntry.theme}` : ""}`} aria-pressed="true" onClick={() => setLineageOpen(false)}>
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
            {holderGroups.map(({ holders, firstIndex }) => {
              const holder = holders[0];
              if (holder.kind === "gap") {
                const gapNote = isCn ? holder.sideNoteCn : holder.sideNote;
                const arrowNote = isCn ? holder.arrowNoteCn : holder.arrowNote;
                return (
                <li key={`gap-${holder.startYear}`} className="title-holder">
                    {firstIndex > 0 && (
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
              return (
                <li key={`${holder.personId}-${holder.startYear}`} className="title-holder">
                  {firstIndex > 0 && (
                    <span className="title-holder-arrow" aria-label={holderNote(holder)}>
                      <span className="title-arrow-line" aria-hidden="true" />
                      <span className="title-arrow-note">{holderNote(holder)}</span>
                    </span>
                  )}
                  <div className={`title-holder-row${holders.length > 1 ? " title-holder-row--joint" : ""}`}>
                    {holders.map((jointHolder) => {
                      if (jointHolder.kind === "gap") return null;
                      const person = byId.get(jointHolder.personId);
                      if (!person) return <p key={jointHolder.personId} className="title-person-missing">{t.titlePersonMissing}</p>;
                      const label = textFor(person, language);
                      const house = person.house || person.dynasty;
                      const houseOverride = activeEntry.lineage.houseOverrides?.[person.id];
                      const houseText = houseOverride ? (isCn ? houseOverride.cn : houseOverride.en) : (house ? (isCn ? dynastyCn(house) : house) : "");
                      return (
                        <div key={`${jointHolder.personId}-${jointHolder.startYear}`} className="title-holder-member">
                          <button type="button" className={`title-person-node tier-${jointHolder.tierOverride ?? titleTier(person)} ${person.tags.includes("illegitimate") ? "illegitimate" : ""} ${detailPersonId === person.id ? "selected" : ""}`} onClick={() => selectHolder(person.id)} aria-label={`${t.select} ${label.fullName}`}>
                            <span className={`title-node-gender ${person.gender}`}>{genderMark(person)}</span>
                            <span className="title-node-avatar">{initials(person, language)}</span>
                            <span className="title-node-name">{label.displayName}</span>
                            <span className="title-node-title">{jointHolder.titleForm}</span>
                            <span className="title-node-years">{jointHolder.startYear || "?"}–{jointHolder.endYear || "?"}</span>
                          </button>
                          {houseText ? <span className="title-holder-house">{houseText}</span> : null}
                        </div>
                      );
                    })}
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
          <div className="title-catalog-search-row">
            <label className="title-search-field">
              <span aria-hidden="true">⌕</span>
              <input
                value={titleSearch}
                onChange={(event) => { setTitleSearch(event.target.value); setCatalogPage(0); }}
                placeholder={t.searchTitles}
                aria-label={t.searchTitles}
              />
            </label>
            <button type="button" className="title-directory-button" onClick={() => setDirectoryOpen(true)} aria-haspopup="dialog">
              <span aria-hidden="true">☷</span>{t.titleDirectory}
            </button>
          </div>
          <div className="title-catalog-results">
            {visibleLineages.length > 0 ? (
              visibleLineages.map((entry) => (
                <div key={entry.lineage.id} className="title-catalog-entry">
                  <button type="button" className={`title-entry-card title-entry-card--reserved${entry.theme ? ` title-entry-card--${entry.theme}` : ""}`} onClick={() => openLineage(entry)} aria-label={`${t.select} ${isCn ? entry.nameCn : entry.name}`}>
                    {entry.emblem && <span className="title-entry-emblem-frame"><img className="title-entry-emblem" src={entry.emblem.src} alt={entry.emblem.alt} /></span>}
                  </button>
                  <p className="title-entry-note">{isCn ? entry.nameCn : entry.name}</p>
                </div>
              ))
            ) : <p className="title-search-empty">{t.noMatchingTitles}</p>}
          </div>
          {!titleQuery && catalogPageCount > 1 && (
            <nav className="title-catalog-pagination" aria-label="Title page navigation">
              <button type="button" onClick={() => setCatalogPage((page) => Math.max(0, page - 1))} disabled={catalogPage === 0} aria-label="Previous title page">←</button>
              <span>{catalogPage + 1} / {catalogPageCount}</span>
              <button type="button" onClick={() => setCatalogPage((page) => Math.min(catalogPageCount - 1, page + 1))} disabled={catalogPage === catalogPageCount - 1} aria-label="Next title page">→</button>
            </nav>
          )}
          {isDirectoryOpen && (
            <div className="modal-backdrop title-directory-backdrop" role="presentation" onClick={() => setDirectoryOpen(false)}>
              <section className="timeline-modal title-directory-modal" role="dialog" aria-modal="true" aria-label={t.titleDirectory} onClick={(event) => event.stopPropagation()}>
                <header className="modal-header">
                  <div>
                    <p className="eyebrow">{t.titleLineage}</p>
                    <h3>{t.titleDirectory}</h3>
                  </div>
                  <button type="button" onClick={() => setDirectoryOpen(false)}>{t.close}</button>
                </header>
                <p className="title-directory-hint">{t.titleDirectoryHint}</p>
                {(["kingdom", "france", "hre"] as const).map((group) => {
                  const entries = directoryLineages(group);
                  return <section key={group} className="title-directory-group">
                    <h4>{group === "kingdom" ? t.titleDirectoryKingdoms : group === "france" ? "Kingdom of France / 法兰西王国" : "Holy Roman Empire / 神圣罗马帝国"}</h4>
                    <div className="title-directory-list">
                      {entries.length > 0 ? entries.map((entry) => (
                        <button key={entry.lineage.id} type="button" className="title-directory-entry" onClick={() => openLineage(entry)}>
                          <span>{entry.name}</span>
                          <small>{entry.nameCn} · {lineageStartYear(entry.lineage)} · {entry.lineage.form}</small>
                        </button>
                      )) : <p className="title-search-empty">{t.noAdditionalTitles}</p>}
                    </div>
                  </section>;
                })}
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
