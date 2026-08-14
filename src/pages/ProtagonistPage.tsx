import { useFamilyStore } from "../store";
import { genderMark, initials, titleTier, years } from "../lib/personPresentation";
import { PageTabs } from "../components/PageTabs";

export function ProtagonistPage({ onEnter, onTree }: { onEnter: (id: string) => void; onTree: () => void }) {
  const people = useFamilyStore((state) => state.people);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const language = useFamilyStore((state) => state.language);
  const picks = [
    { id: "11A260814K001", phase: "Phase I", hook: "1066 Norman Conquest", tone: "Conquest, succession, and the first English crown of the Norman line." },
    { id: "12E260814A011", phase: "Phase II", hook: "Angevin Empire", tone: "Aquitaine, two crowns, rebellion, and the Plantagenet succession storm." },
    { id: "13E260814W015", phase: "Phase III", hook: "Plantagenet Main Line", tone: "From Edward I through Edward III, the Black Prince, and Richard II." },
    { id: "15E260814Y040", phase: "Phase IV", hook: "Yorkist Claim", tone: "The Clarence-Mortimer line into Edward IV and the Wars of the Roses." },
  ];

  return (
    <main className="protagonist-page">
      <div className="protagonist-topbar">
        <p className="eyebrow">Historical Family Tree</p>
        <div className="topbar-actions">
          <PageTabs page="protagonists" onHome={() => undefined} onTree={onTree} />
          <div className="language-toggle" aria-label="Language">
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" className={language === "cn" ? "active" : ""} onClick={() => setLanguage("cn")}>CN</button>
          </div>
        </div>
      </div>
      <section className="protagonist-hero">
        <div className="protagonist-copy">
          <p className="eyebrow">Select Highlighted Protagonist</p>
          <h1>Choose Your Historical Focus</h1>
          <p>Start from a featured ruler or queen, then enter the family tree with that character centered.</p>
        </div>
        <div className="protagonist-grid">
          {picks.map((pick) => {
            const person = people.find((item) => item.id === pick.id);
            if (!person) return null;
            return (
              <button key={pick.id} type="button" className={`protagonist-card tier-${titleTier(person)}`} onClick={() => onEnter(person.id)}>
                <span className="phase-badge">{pick.phase}</span>
                <span className={`protagonist-gender ${person.gender}`}>{genderMark(person)}</span>
                <span className="protagonist-avatar">{initials(person)}</span>
                <span className="protagonist-name">{person.fullName}</span>
                <span className="protagonist-title">{person.primaryTitle} · {years(person)}</span>
                <span className="protagonist-hook">{pick.hook}</span>
                <span className="protagonist-tone">{pick.tone}</span>
                <span className="enter-pill">Enter tree</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
