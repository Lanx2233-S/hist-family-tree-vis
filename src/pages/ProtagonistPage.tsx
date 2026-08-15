import { useState } from "react";
import { useFamilyStore } from "../store";
import { genderMark, initials, titleTier, years } from "../lib/personPresentation";
import { copyFor, textFor } from "../features/shared/presentation";
import { PageTabs } from "../components/PageTabs";

export function ProtagonistPage({ onEnter, onTree }: { onEnter: (id: string) => void; onTree: () => void }) {
  const people = useFamilyStore((state) => state.people);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const language = useFamilyStore((state) => state.language);
  const [realm, setRealm] = useState<"england" | "france">("england");
  const [page, setPage] = useState(0);
  const t = copyFor(language);
  const picks = [
    { id: "11A260814K001", phase: "I", hook: "1066 Norman Conquest", hookCn: "1066 诺曼征服", toneKey: "pickToneNorman" as const },
    { id: "12E260814A011", phase: "II", hook: "Angevin Empire", hookCn: "安茹帝国", toneKey: "pickToneAngevin" as const },
    { id: "13E260814W015", phase: "III", hook: "Plantagenet Main Line", hookCn: "金雀花主支世系", toneKey: "pickTonePlantagenet" as const },
    { id: "15E260814Y040", phase: "IV", hook: "Yorkist Claim", hookCn: "约克王位主张", toneKey: "pickToneYorkist" as const },
    { id: "16E260815I017", phase: "V", hook: "Tudor Culmination", hookCn: "都铎巅峰", toneKey: "pickToneTudor" as const },
  ];
  const visiblePicks = picks.slice(page * 3, page * 3 + 3);
  const pageCount = Math.ceil(picks.length / 3);

  return (
    <main className="protagonist-page">
      <div className="protagonist-topbar">
        <p className="eyebrow">{t.historicalFamilyTree}</p>
        <div className="topbar-actions">
          <PageTabs page="protagonists" onHome={() => undefined} onTree={onTree} />
          <div className="language-toggle" aria-label={t.language}>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" className={language === "cn" ? "active" : ""} onClick={() => setLanguage("cn")}>CN</button>
          </div>
        </div>
      </div>
      <section className="protagonist-hero">
        <div className="protagonist-copy">
          <p className="eyebrow">{t.selectHighlightedProtagonist}</p>
          <h1>{t.chooseYourHistoricalFocus}</h1>
          <p>{t.startFromFeaturedRuler}</p>
          <div className="realm-entrances" aria-label={t.historicalRegions}>
            <button type="button" className={`realm-entry ${realm === "england" ? "active" : ""}`} onClick={() => { setRealm("england"); setPage(0); }}>
              <span className="realm-entry-kicker">{t.realm} I</span>
              <strong>{t.england}</strong>
              <span>{t.englandLines}</span>
            </button>
            <button type="button" className={`realm-entry ${realm === "france" ? "active" : ""}`} onClick={() => { setRealm("france"); setPage(0); }}>
              <span className="realm-entry-kicker">{t.realm} II</span>
              <strong>{t.france}</strong>
              <span>{t.collectionOpeningSoon}</span>
            </button>
          </div>
        </div>
        <div className="protagonist-selection">
          {realm === "england" ? <>
            <div className="realm-heading"><span>{t.england}</span><small>{page + 1} / {pageCount}</small></div>
            <div className="protagonist-grid">
          {visiblePicks.map((pick) => {
            const person = people.find((item) => item.id === pick.id);
            if (!person) return null;
            const label = textFor(person, language);
            return (
              <button key={pick.id} type="button" className={`protagonist-card tier-${titleTier(person)}`} onClick={() => onEnter(person.id)}>
                <span className="phase-badge">{t.phase} {pick.phase}</span>
                <span className={`protagonist-gender ${person.gender}`}>{genderMark(person)}</span>
                <span className="protagonist-avatar">{initials(person, language)}</span>
                <span className="protagonist-name">{label.fullName}</span>
                <span className="protagonist-title">{label.primaryTitle} · {years(person)}</span>
                <span className="protagonist-hook">{language === "cn" ? pick.hookCn : pick.hook}</span>
                <span className="protagonist-tone">{t[pick.toneKey]}</span>
                <span className="enter-pill">{t.enterTree}</span>
              </button>
            );
          })}
            </div>
            <div className="protagonist-pagination">
              <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} aria-label={t.previousEnglandProtagonists}>←</button>
              <span>{t.featuredFigures}</span>
              <button type="button" onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={page === pageCount - 1} aria-label={t.nextEnglandProtagonists}>→</button>
            </div>
          </> : <div className="realm-empty"><span className="realm-entry-kicker">{t.france}</span><h2>{t.frenchFamilyTrees}</h2><p>{t.realmReserved}</p><button type="button" onClick={() => setRealm("england")}>{t.returnToEngland}</button></div>}
        </div>
      </section>
    </main>
  );
}
