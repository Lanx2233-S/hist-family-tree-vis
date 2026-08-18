import { useFamilyStore } from "../store";
import { copyFor } from "../features/shared/presentation";

export type AppPage = "protagonists" | "tree" | "titles";

export function PageTabs({ page, onHome, onTree, onTitles }: { page: AppPage; onHome: () => void; onTree: () => void; onTitles: () => void }) {
  const language = useFamilyStore((state) => state.language);
  const t = copyFor(language);
  return (
    <nav className="page-tabs" aria-label={t.pages}>
      <button type="button" className={page === "protagonists" ? "active" : ""} onClick={onHome}>{t.homePage}</button>
      <button type="button" className={page === "tree" ? "active" : ""} onClick={onTree}>{t.treePage}</button>
      <button type="button" className={page === "titles" ? "active" : ""} onClick={onTitles}>{t.titlesPage}</button>
    </nav>
  );
}
