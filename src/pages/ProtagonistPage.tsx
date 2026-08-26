import { useState } from "react";
import { useFamilyStore } from "../store";
import { genderMark, initials, titleTier, years } from "../lib/personPresentation";
import { copyFor, heraldryFor, textFor } from "../features/shared/presentation";
import { PageTabs } from "../components/PageTabs";

export function ProtagonistPage({ onEnter, onTree, onTitles }: { onEnter: (id: string) => void; onTree: () => void; onTitles: () => void }) {
  const people = useFamilyStore((state) => state.people);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const language = useFamilyStore((state) => state.language);
  const [realm, setRealm] = useState<"england" | "france" | "germany" | "castile" | "byzantium" | "arabia" | null>(null);
  const [realmPage, setRealmPage] = useState(0);
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
    { id: "91f35e74-2dd3-4393-9858-0fc6b5acc537", phase: "IV", hook: "The Perfect Monster", hookCn: "完美怪物", toneKey: "pickToneFrenchLouis" as const },
    { id: "04c2ad7c-d296-4338-af7c-05fd1d730cfe", phase: "V", hook: "The Wise Crown", hookCn: "智者王冠", toneKey: "pickToneFrenchPhilip" as const },
    { id: "4482439c-eae6-4ec6-885a-ac48721ec552", phase: "VI", hook: "The Victorious King", hookCn: "胜利之王", toneKey: "pickToneFrenchPhilip" as const },
  ];
  const germanyPicks = [
    { id: "3dd7dc1c-7473-495d-aac7-0c145d147ed9", phase: "I", hook: "Salian Investiture", hookCn: "萨利安叙任权之争", toneKey: "pickToneSalian" as const },
    { id: "727f5266-97af-45ee-8a21-c986aaf039dd", phase: "II", hook: "Hohenstaufen Empire", hookCn: "霍亨斯陶芬帝国", toneKey: "pickToneHohenstaufen" as const },
    { id: "ea19e505-86fe-4cb7-8e55-c42e9f0ebfd3", phase: "III", hook: "Stupor Mundi", hookCn: "世界的惊奇", toneKey: "pickToneHohenstaufen" as const },
    { id: "268c6586-a041-4aa7-9d66-92a7af3c4ac6", phase: "IV", hook: "Habsburg election", hookCn: "哈布斯堡当选", toneKey: "pickToneHabsburg" as const },
    { id: "80b3801a-ffca-4136-ba92-293b6b976e85", phase: "V", hook: "Luxembourg imperial revival", hookCn: "卢森堡王朝复兴", toneKey: "pickToneLuxembourg" as const },
    { id: "db91c543-8aa9-43fa-b19b-b09be69989ed", phase: "VI", hook: "The Habsburg ascent", hookCn: "哈布斯堡崛起", toneKey: "pickToneMaximilian" as const },
    { id: "adb801cd-8a69-4de3-92d8-107f7e11a1e6", phase: "VII", hook: "An empire on which the sun never sets", hookCn: "日不落帝国", toneKey: "pickToneCharlesV" as const },
  ];
  const castilePicks = [{ id: "c1026000-0000-4000-8000-000000000001", phase: "I", hook: "The Leonese-Castilian Crown", hookCn: "莱昂—卡斯蒂利亚王冠", toneKey: "pickToneFrenchLouis" as const }];
  const byzantiumPicks = [{ id: "1ce160f2-c91e-4a3c-9c39-01f49c7c221e", phase: "I", hook: "The Komnenian Restoration", hookCn: "科穆宁中兴", toneKey: "pickToneByzantine" as const }];
  const arabiaPicks = [
    { id: "b54d8195-66ad-4668-b9dc-a117a2d9e51b", phase: "I", hook: "The Prophetic Mission", hookCn: "先知使命", toneKey: "pickToneArabia" as const },
    { id: "1173bc8b-b203-44b7-9f15-8f5c832d3c66", phase: "II", hook: "The Rashidun Caliphate", hookCn: "正统哈里发国", toneKey: "pickToneArabia" as const },
  ];
  const realms = [
    { key: "england", label: t.england, lines: t.englandLines },
    { key: "france", label: t.france, lines: t.frenchLines },
    { key: "germany", label: t.germany, lines: t.germanyLines },
    { key: "byzantium", label: language === "cn" ? "罗马—拜占庭" : "Rome–Byzantium", lines: language === "cn" ? "罗马与拜占庭帝国世系" : "Roman and Byzantine imperial lines" },
    { key: "castile", label: language === "cn" ? "西班牙" : "Spain", lines: language === "cn" ? "莱昂、卡斯蒂利亚与阿拉贡世系" : "León, Castile, and Aragonese lines" },
    { key: "arabia", label: language === "cn" ? "阿拉伯" : "Arabia", lines: language === "cn" ? "阿拉伯与伊斯兰世界世系" : "Arabian and Islamic world lineages" },
  ] as const;
  const activePicks = realm === "france" ? francePicks : realm === "germany" ? germanyPicks : realm === "castile" ? castilePicks : realm === "byzantium" ? byzantiumPicks : realm === "arabia" ? arabiaPicks : picks;
  const visiblePicks = activePicks.slice(page * 4, page * 4 + 4);
  const pageCount = Math.max(1, Math.ceil(activePicks.length / 4));
  const realmLabel = realm === "france" ? t.france : realm === "germany" ? t.germany : realm === "castile" ? (language === "cn" ? "西班牙" : "Spain") : realm === "byzantium" ? (language === "cn" ? "罗马—拜占庭" : "Rome–Byzantium") : realm === "arabia" ? (language === "cn" ? "阿拉伯" : "Arabia") : t.england;

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
            {realms.slice(realmPage * 3, realmPage * 3 + 3).map((entry, index) => <button key={entry.key} type="button" aria-expanded={realm === entry.key} className={`realm-entry realm-${entry.key} ${realm === entry.key ? "active" : ""}`} onClick={() => { setRealm(realm === entry.key ? null : entry.key); setPage(0); }}>
              <span className="realm-entry-kicker">{t.realm} {realmPage * 3 + index + 1}</span><strong>{entry.label}</strong><span>{entry.lines}</span>
            </button>)}
            <div className="realm-pagination"><button disabled={realmPage === 0} onClick={() => setRealmPage(0)}>←</button><span>{realmPage + 1} / 2</span><button disabled={realmPage === 1} onClick={() => setRealmPage(1)}>→</button></div>
          </div>
        </div>
        {realm && <div className="protagonist-selection">
          {activePicks.length > 0 ? <>
            <div className="realm-heading"><span>{realmLabel}</span><small>{page + 1} / {pageCount}</small></div>
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
          </> : <div className="realm-empty"><h2>{realmLabel}</h2><p>{t.realmReserved}</p></div>}
        </div>}
      </section>
    </main>
  );
}
