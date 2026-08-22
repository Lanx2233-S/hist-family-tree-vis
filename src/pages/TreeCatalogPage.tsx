import { useState } from "react";
import { PageTabs } from "../components/PageTabs";
import { peopleSearchResults } from "../features/people/peopleSearch";
import { copyFor, textFor, years } from "../features/shared/presentation";
import { useFamilyStore } from "../store";

const treeEntries = [
  { id: "21b5ec21-1812-4731-8b03-721988be302f", house: { en: "House of Normandy", cn: "诺曼底家族" } },
  { id: "29e2abba-321e-4090-a35d-10f0bd6a420a", house: { en: "House of Plantagenet", cn: "金雀花家族" } },
  { id: "7cc009b6-08d8-459b-b40e-2921bf3e4580", house: { en: "House of Capet", cn: "卡佩家族" } },
];

export function TreeCatalogPage({ onHome, onTitles, onEnter }: { onHome: () => void; onTitles: () => void; onEnter: (personId: string) => void }) {
  const people = useFamilyStore((state) => state.people);
  const language = useFamilyStore((state) => state.language);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const [query, setQuery] = useState("");
  const t = copyFor(language);
  const results = peopleSearchResults(people, query);

  return (
    <main className="title-page tree-catalog-page">
      <div className="title-page-topbar">
        <div className="topbar-actions">
          <PageTabs page="tree" onHome={onHome} onTree={() => undefined} onTitles={onTitles} />
          <div className="language-toggle" aria-label={t.language}>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" className={language === "cn" ? "active" : ""} onClick={() => setLanguage("cn")}>CN</button>
          </div>
        </div>
      </div>

      <section className="title-catalog tree-catalog" aria-label={t.familyTree}>
        <header className="title-catalog-header">
          <p className="eyebrow">{t.familyTree}</p>
          <h1>{t.familyTree}</h1>
          <p className="title-intro">{t.treeCatalogIntro}</p>
        </header>
        <label className="title-search-field">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} />
        </label>
        {query.trim() ? (
          <div className="tree-search-results">
            {results.length > 0 ? results.map(({ person }) => {
              const label = textFor(person, language);
              return (
                <button key={person.id} type="button" onClick={() => onEnter(person.id)}>
                  <strong>{label.fullName}</strong>
                  <small>{label.primaryTitle} · {years(person)}</small>
                </button>
              );
            }) : <p className="title-search-empty">{t.noMatchingPeople}</p>}
          </div>
        ) : (
          <div className="tree-entry-grid">
            {treeEntries.map((entry) => {
              const person = people.find((item) => item.id === entry.id);
              if (!person) return null;
              const label = textFor(person, language);
              return (
                <button key={entry.id} type="button" className="tree-entry-card" onClick={() => onEnter(entry.id)}>
                  <span className="eyebrow">{entry.house[language]}</span>
                  <strong>{label.fullName}</strong>
                  <span>{label.primaryTitle}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
