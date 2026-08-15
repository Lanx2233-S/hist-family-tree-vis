import { useFamilyStore } from "../store";
import { copyFor } from "../features/shared/presentation";

export type AppPage = "protagonists" | "tree";

export function PageTabs({ page, onHome, onTree }: { page: AppPage; onHome: () => void; onTree: () => void }) {
  const language = useFamilyStore((state) => state.language);
  const t = copyFor(language);
  return (
    <nav className="page-tabs" aria-label={t.pages}>
      <button type="button" className={page === "protagonists" ? "active" : ""} onClick={onHome}>{t.homePage}</button>
      <button type="button" className={page === "tree" ? "active" : ""} onClick={onTree}>{t.treePage}</button>
    </nav>
  );
}
