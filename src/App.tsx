import { useEffect, useState } from "react";
import { useFamilyStore } from "./store";
import type { Person } from "./types";
import { loadPeopleFromApi } from "./api/peopleApi";
import { PersonFormModal } from "./components/PersonFormModal";
import { PageTabs, type AppPage } from "./components/PageTabs";
import { peopleSearchResults } from "./features/people/peopleSearch";
import { DetailPanel } from "./features/people/DetailPanel";
import { FamilyTree } from "./features/tree/FamilyTree";
import { cnTagLabels, copy, tagLabels, textFor, years } from "./features/shared/presentation";
import { ProtagonistPage } from "./pages/ProtagonistPage";
function Toolbar({ onSelectPerson, onAddPerson }: { onSelectPerson: (id: string) => void; onAddPerson: () => void }) {
  const people = useFamilyStore((state) => state.people);
  const selectedId = useFamilyStore((state) => state.selectedId);
  const activeTag = useFamilyStore((state) => state.activeTag);
  const activeGender = useFamilyStore((state) => state.activeGender);
  const searchQuery = useFamilyStore((state) => state.searchQuery);
  const language = useFamilyStore((state) => state.language);
  const setActiveTag = useFamilyStore((state) => state.setActiveTag);
  const setActiveGender = useFamilyStore((state) => state.setActiveGender);
  const setSearchQuery = useFamilyStore((state) => state.setSearchQuery);
  const setLanguage = useFamilyStore((state) => state.setLanguage);
  const [isTagOpen, setTagOpen] = useState(false);
  const [isGenderOpen, setGenderOpen] = useState(false);
  const [isPeopleSearchOpen, setPeopleSearchOpen] = useState(false);
  const tags = ["all", ...Array.from(new Set(people.flatMap((person) => person.tags))).slice(0, 8)];
  const t = copy[language];
  const selectedPerson = people.find((person) => person.id === selectedId) ?? people[0];
  const selectedLabel = textFor(selectedPerson, language);
  const treeTitle = `${selectedLabel.dynasty || selectedPerson.house || "Family"} Family Tree`;
  const searchResults = peopleSearchResults(people, searchQuery);

  function selectSearchResult(person: Person) {
    setSearchQuery("");
    setPeopleSearchOpen(false);
    onSelectPerson(person.id);
  }

  return (
    <div className="toolbar">
      <div><h1>{treeTitle}</h1></div>
      <div className="toolbar-controls">
        <div className="language-toggle" aria-label={t.language}>
          <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
          <button type="button" className={language === "cn" ? "active" : ""} onClick={() => setLanguage("cn")}>CN</button>
        </div>
        <div className="filter-bar" aria-label={t.filters}>
          <div className="people-search">
          <label className="search-field">
            <span>⌕</span>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPeopleSearchOpen(Boolean(event.target.value.trim()));
              }}
              onFocus={() => setPeopleSearchOpen(Boolean(searchQuery.trim()))}
              onKeyDown={(event) => {
                if (event.key === "Escape") setPeopleSearchOpen(false);
                if (event.key === "Enter" && searchResults[0]) {
                  event.preventDefault();
                  selectSearchResult(searchResults[0].person);
                }
              }}
              placeholder={t.search}
            />
          </label>
          {isPeopleSearchOpen && (
            <div className="people-search-popover" role="listbox" aria-label={t.search}>
              {searchResults.length > 0 ? searchResults.map(({ person }) => (
                <button
                  key={person.id}
                  type="button"
                  role="option"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSearchResult(person)}
                >
                  <strong>{person.displayName}</strong>
                  <small>{person.primaryTitle} · {years(person)}</small>
                </button>
              )) : <p className="people-search-empty">No matching people</p>}
            </div>
          )}
          </div>
          <button type="button" className="add-person-button" onClick={onAddPerson}>+ Person</button>
          <div className="popup-filter">
            <button type="button" className={activeTag !== "all" ? "active" : ""} onClick={() => setTagOpen(!isTagOpen)}>{t.tagFilter}: {language === "cn" ? cnTagLabels[activeTag] ?? activeTag : tagLabels[activeTag] ?? activeTag}</button>
            {isTagOpen && (
              <div className="filter-popover">
                <input
                  aria-label={t.tagSearch}
                  placeholder={t.tagSearch}
                  onChange={(event) => {
                    const value = event.target.value.toLowerCase();
                    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[data-filter-option]").forEach((button) => {
                      button.hidden = !button.textContent?.toLowerCase().includes(value);
                    });
                  }}
                />
                {tags.map((tag) => (
                  <button data-filter-option key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => { setActiveTag(tag); setTagOpen(false); }}>
                    {language === "cn" ? cnTagLabels[tag] ?? tag : tagLabels[tag] ?? tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="popup-filter">
            <button type="button" className={activeGender !== "all" ? "active" : ""} onClick={() => setGenderOpen(!isGenderOpen)}>{t.genderFilter}: {activeGender === "all" ? (language === "cn" ? "全部" : "All") : activeGender === "male" ? t.male : t.female}</button>
            {isGenderOpen && (
              <div className="filter-popover compact">
                {(["all", "male", "female"] as const).map((gender) => (
                  <button key={gender} type="button" className={activeGender === gender ? "active" : ""} onClick={() => { setActiveGender(gender); setGenderOpen(false); }}>
                    {gender === "all" ? (language === "cn" ? "全部" : "All") : gender === "male" ? `♂ ${t.male}` : `♀ ${t.female}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<AppPage>("protagonists");
  const [centerHistory, setCenterHistory] = useState<string[]>([]);
  const [treeVisitKey, setTreeVisitKey] = useState(0);
  const [isPersonFormOpen, setPersonFormOpen] = useState(false);
  const selectedId = useFamilyStore((state) => state.selectedId);
  const setSelectedId = useFamilyStore((state) => state.setSelectedId);
  const people = useFamilyStore((state) => state.people);
  const upsertPerson = useFamilyStore((state) => state.upsertPerson);
  const replacePeople = useFamilyStore((state) => state.replacePeople);

  useEffect(() => {
    let isCurrent = true;
    loadPeopleFromApi()
      .then((databasePeople) => {
        if (isCurrent && databasePeople.length > 0) replacePeople(databasePeople);
      })
      .catch(() => undefined);
    return () => { isCurrent = false; };
  }, [replacePeople]);

  function selectCenter(id: string) {
    if (id === selectedId) return;
    setCenterHistory((history) => [...history, selectedId]);
    setSelectedId(id);
  }

  function goBackCenter() {
    setCenterHistory((history) => {
      const previous = history[history.length - 1];
      if (!previous) return history;
      setSelectedId(previous);
      return history.slice(0, -1);
    });
  }

  if (page === "protagonists") {
    return (
      <ProtagonistPage
        onTree={() => {
          setTreeVisitKey((key) => key + 1);
          setPage("tree");
        }}
        onEnter={(id) => {
          setSelectedId(id);
          setCenterHistory([]);
          setTreeVisitKey((key) => key + 1);
          setPage("tree");
        }}
      />
    );
  }

  return (
    <main>
      <PageTabs page="tree" onHome={() => setPage("protagonists")} onTree={() => {
        setTreeVisitKey((key) => key + 1);
        setPage("tree");
      }} />
      <Toolbar onSelectPerson={selectCenter} onAddPerson={() => setPersonFormOpen(true)} />
      <div className="workspace">
        <FamilyTree
          onHome={() => setPage("protagonists")}
          onBack={goBackCenter}
          canBack={centerHistory.length > 0}
          onSelectPerson={selectCenter}
          treeVisitKey={treeVisitKey}
        />
        <DetailPanel />
      </div>
      {isPersonFormOpen && (
        <PersonFormModal
          people={people}
          onClose={() => setPersonFormOpen(false)}
          onCreated={(person) => {
            upsertPerson(person);
            selectCenter(person.id);
          }}
        />
      )}
    </main>
  );
}


