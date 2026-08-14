export type AppPage = "protagonists" | "tree";

export function PageTabs({ page, onHome, onTree }: { page: AppPage; onHome: () => void; onTree: () => void }) {
  return (
    <nav className="page-tabs" aria-label="Pages">
      <button type="button" className={page === "protagonists" ? "active" : ""} onClick={onHome}>Home Page</button>
      <button type="button" className={page === "tree" ? "active" : ""} onClick={onTree}>Tree Page</button>
    </nav>
  );
}
