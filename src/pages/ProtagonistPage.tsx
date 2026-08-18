import { useState } from "react";
import { useFamilyStore } from "../store";
import { genderMark, initials, titleTier, years } from "../lib/personPresentation";
import { copyFor, heraldryFor, textFor } from "../features/shared/presentation";
import { PageTabs } from "../components/PageTabs";

export function ProtagonistPage({ onEnter, onTree, onTitles }: { onEnter: (id: string) => void; onTree: () => void; onTitles: () => void }) {
  const people = useFamilyStore((state) => state.people);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const language = useFamilyStore((state) => state.language);
  const [realm, setRealm] = useState<"england" | "france" | null>(null);
  const [page, setPage] = useState(0);
  const t = copyFor(language);
  const picks = [
    { id: "aed34407-7ca3-4fcc-9255-ce1b908f9b72", phase: "I", hook: "Wessex Before England", hookCn: "英格兰之前的威塞克斯", toneKey: "pickToneNorman" as const },
    { id: "21b5ec21-1812-4731-8b03-721988be302f", phase: "II", hook: "1066 Norman Conquest", hookCn: "1066 诺曼征服", toneKey: "pickToneNorman" as const },
    { id: "cbb11a70-0b0f-40ca-b9c6-95426b904bf6", phase: "III", hook: "Angevin Empire", hookCn: "安茹帝国", toneKey: "pickToneAngevin" as const },
    { id: "f58b655d-8403-4f6d-9d5d-ecffaeaa0b0e", phase: "IV", hook: "Plantagenet Main Line", hookCn: "金雀花主支世系", toneKey: "pickTonePlantagenet" as const },
    { id: "423d8a6a-a3f5-4502-abc7-5b6943dcfac6", phase: "V", hook: "Yorkist Claim", hookCn: "约克王位主张", toneKey: "pickToneYorkist" as const },
    { id: "035085c7-f1bd-483a-a2c9-fc9f348170ac", phase: "VI", hook: "Tudor Culmination", hookCn: "都铎巅峰", toneKey: "pickToneTudor" as const },
  ];
  const francePicks = [
    { id: "02b8c87d-6e49-4027-a6fa-a92431160a38", phase: "I", hook: "The Carolingian Empire", hookCn: "加洛林帝国", toneKey: "pickToneCharlemagne" as const },
    { id: "d2dd406e-702b-425c-b3dc-2dcac8e8163d", phase: "II", hook: "Capetian Consolidation", hookCn: "卡佩王朝巩固", toneKey: "pickToneFrenchLouis" as const },
    { id: "7cc009b6-08d8-459b-b40e-2921bf3e4580", phase: "III", hook: "The Augustan Crown", hookCn: "奥古斯都王冠", toneKey: "pickToneFrenchPhilip" as const },
  ];
  const activePicks = realm === "france" ? francePicks : picks;
  const visiblePicks = activePicks.slice(page * 4, page * 4 + 4);
  const pageCount = Math.ceil(activePicks.length / 4);

  return (
    <main className="protagonist-page">
      <div className="protagonist-topbar">
        <p className="eyebrow">{t.historicalFamilyTree}</p>
        <div className="topbar-actions">
          <PageTabs page="protagonists" onHome={() => undefined} onTree={onTree} onTitles={onTitles} />
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
            <button type="button" aria-expanded={realm === "england"} className={`realm-entry ${realm === "england" ? "active" : ""}`} onClick={() => { setRealm(realm === "england" ? null : "england"); setPage(0); }}>
              <span className="realm-entry-kicker">{t.realm} I</span>
              <strong>{t.england}</strong>
              <span>{t.englandLines}</span>
            </button>
            <button type="button" aria-expanded={realm === "france"} className={`realm-entry ${realm === "france" ? "active" : ""}`} onClick={() => { setRealm(realm === "france" ? null : "france"); setPage(0); }}>
              <span className="realm-entry-kicker">{t.realm} II</span>
              <strong>{t.france}</strong>
              <span>{t.frenchLines}</span>
            </button>
          </div>
        </div>
        {realm && <div className="protagonist-selection">
          {<>
            <div className="realm-heading"><span>{realm === "france" ? t.france : t.england}</span><small>{page + 1} / {pageCount}</small></div>
            <div className="protagonist-grid">
          {visiblePicks.map((pick) => {
            const person = people.find((item) => item.id === pick.id);
            if (!person) return null;
            const label = textFor(person, language);
            const heraldry = heraldryFor(person);
            return (
              <button key={pick.id} type="button" className={`protagonist-card tier-${titleTier(person)}`} onClick={() => onEnter(person.id)}>
                <span className="phase-badge">{t.phase} {pick.phase}</span>
                <span className={`protagonist-gender ${person.gender}`}>{genderMark(person)}</span>
                {heraldry && (
                  <img
                    className="protagonist-heraldry"
                    src={heraldry.src}
                    alt={heraldry.alt}
                  />
                )}
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
              <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} aria-label={t.previousProtagonists}>←</button>
              <span>{t.featuredFigures}</span>
              <button type="button" onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={page === pageCount - 1} aria-label={t.nextProtagonists}>→</button>
            </div>
          </>}
        </div>}
      </section>
    </main>
  );
}
