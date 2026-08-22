import { useEffect, useState } from "react";
import { useFamilyStore } from "./store";
import type { Person } from "./types";
import { loadPeopleFromApi } from "./api/peopleApi";
import { PersonFormModal } from "./components/PersonFormModal";
import { PageTabs, type AppPage } from "./components/PageTabs";
import { peopleSearchResults } from "./features/people/peopleSearch";
import { DetailPanel } from "./features/people/DetailPanel";
import { FamilyTree } from "./features/tree/FamilyTree";
import { copyFor, dynastyCn, tagText, textFor, years } from "./features/shared/presentation";
import { ProtagonistPage } from "./pages/ProtagonistPage";
import { TitlePage } from "./pages/TitlePage";
import { TreeCatalogPage } from "./pages/TreeCatalogPage";

type Route = { page: AppPage; personId: string };
function readRoute(): Route {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "tree") return { page: "tree", personId: parts[1] ? decodeURIComponent(parts[1]) : "" };
  if (parts[0] === "titles") return { page: "titles", personId: parts[1] ? decodeURIComponent(parts[1]) : "" };
  return { page: "protagonists", personId: "" };
}
function routePath(page: AppPage, personId = "") {
  if (page === "tree") return personId ? `/tree/${encodeURIComponent(personId)}` : "/tree";
  if (page === "titles") return personId ? `/titles/${encodeURIComponent(personId)}` : "/titles";
  return "/";
}
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
  const t = copyFor(language);
  const selectedPerson = people.find((person) => person.id === selectedId) ?? people[0];
  const selectedLabel = textFor(selectedPerson, language);
  const houseLabel = selectedLabel.dynasty || (language === "cn" ? dynastyCn(selectedPerson.house) : selectedPerson.house);
  const treeTitle = houseLabel ? `${houseLabel} ${t.familyTree}` : t.familyTree;
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
                  <strong>{textFor(person, language).displayName}</strong>
                  <small>{textFor(person, language).primaryTitle} · {years(person)}</small>
                </button>
              )) : <p className="people-search-empty">{t.noMatchingPeople}</p>}
            </div>
          )}
          </div>
          <button type="button" className="add-person-button" onClick={onAddPerson}>{t.addPerson}</button>
          <div className="popup-filter">
            <button type="button" className={activeTag !== "all" ? "active" : ""} onClick={() => setTagOpen(!isTagOpen)}>{t.tagFilter}: {tagText(activeTag, language)}</button>
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
                    {tagText(tag, language)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="popup-filter">
            <button type="button" className={activeGender !== "all" ? "active" : ""} onClick={() => setGenderOpen(!isGenderOpen)}>{t.genderFilter}: {activeGender === "all" ? t.all : activeGender === "male" ? t.male : t.female}</button>
            {isGenderOpen && (
              <div className="filter-popover compact">
                {(["all", "male", "female"] as const).map((gender) => (
                  <button key={gender} type="button" className={activeGender === gender ? "active" : ""} onClick={() => { setActiveGender(gender); setGenderOpen(false); }}>
                    {gender === "all" ? t.all : gender === "male" ? `♂ ${t.male}` : `♀ ${t.female}`}
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
  const initialRoute = readRoute();
  const [page, setPageState] = useState<AppPage>(initialRoute.page);
  const [centerHistory, setCenterHistory] = useState<string[]>([]);
  const [titleFocusId, setTitleFocusId] = useState(initialRoute.page === "titles" ? initialRoute.personId : "");
  const [treeFocusId, setTreeFocusId] = useState(initialRoute.page === "tree" ? initialRoute.personId : "");
  const [treeVisitKey, setTreeVisitKey] = useState(0);
  const [isPersonFormOpen, setPersonFormOpen] = useState(false);
  const selectedId = useFamilyStore((state) => state.selectedId);
  const setSelectedId = useFamilyStore((state) => state.setSelectedId);
  const people = useFamilyStore((state) => state.people);
  const language = useFamilyStore((state) => state.language);
  const backgroundTheme = useFamilyStore((state) => state.backgroundTheme);
  const upsertPerson = useFamilyStore((state) => state.upsertPerson);
  const replacePeople = useFamilyStore((state) => state.replacePeople);

  function navigate(nextPage: AppPage, personId = "") {
    window.history.pushState({}, "", routePath(nextPage, personId));
    setPageState(nextPage);
  }

  useEffect(() => {
    const onPopState = () => {
      const route = readRoute();
      setPageState(route.page);
      setTitleFocusId(route.page === "titles" ? route.personId : "");
      setTreeFocusId(route.page === "tree" ? route.personId : "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    loadPeopleFromApi()
      .then((databasePeople) => {
        if (isCurrent && databasePeople.length > 0) replacePeople(databasePeople);
      })
      .catch(() => undefined);
    return () => { isCurrent = false; };
  }, [replacePeople]);

  // Keep the document metadata in sync with the active language: the browser
  // tab title and the html lang attribute (screen readers, hyphenation).
  useEffect(() => {
    document.documentElement.lang = language === "cn" ? "zh-CN" : "en";
    document.title = copyFor(language).documentTitle;
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = backgroundTheme;
  }, [backgroundTheme]);

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

  function openHouse(personId: string) {
    openTree(personId);
  }

  function openTitleLineage(personId: string) {
    setTitleFocusId(personId);
    navigate("titles", personId);
  }

  function openTree(personId: string) {
    setSelectedId(personId);
    setTreeFocusId(personId);
    setCenterHistory([]);
    setTreeVisitKey((key) => key + 1);
    navigate("tree", personId);
  }

  function openTreeCatalog() {
    setTreeFocusId("");
    navigate("tree");
  }

  if (page === "protagonists") {
    return (
      <ProtagonistPage
        onTree={() => {
          openTreeCatalog();
        }}
        onTitles={() => { setTitleFocusId(""); navigate("titles"); }}
        onEnter={(id) => {
          openTree(id);
        }}
      />
    );
  }

  if (page === "titles") {
    return (
      <TitlePage
        onHome={() => navigate("protagonists")}
        onTree={() => {
          openTreeCatalog();
        }}
        onOpenHouse={openHouse}
        initialPersonId={titleFocusId}
      />
    );
  }

  if (!treeFocusId) {
    return <TreeCatalogPage onHome={() => navigate("protagonists")} onTitles={() => { setTitleFocusId(""); navigate("titles"); }} onEnter={openTree} />;
  }

  return (
    <main>
      <PageTabs page="tree" onHome={() => navigate("protagonists")} onTree={() => {
        openTreeCatalog();
      }} onTitles={() => { setTitleFocusId(""); navigate("titles"); }} />
      <Toolbar onSelectPerson={selectCenter} onAddPerson={() => setPersonFormOpen(true)} />
      <div className="workspace">
        <FamilyTree
          onHome={() => navigate("protagonists")}
          onBack={goBackCenter}
          canBack={centerHistory.length > 0}
          onSelectPerson={selectCenter}
          treeVisitKey={treeVisitKey}
        />
        <DetailPanel onOpenTitleLineage={openTitleLineage} />
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
