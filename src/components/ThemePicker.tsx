import { useState } from "react";
import { useFamilyStore, type BackgroundTheme } from "../store";

const themes: Array<{ id: BackgroundTheme; en: string; cn: string }> = [
  { id: "parchment", en: "Parchment Archive", cn: "羊皮纸档案" },
  { id: "mist-blue", en: "Mist Blue Study", cn: "雾蓝书房" },
  { id: "rose", en: "Rose Chronicle", cn: "蔷薇编年" },
  { id: "sage", en: "Sage Garden", cn: "鼠尾草庭园" },
  { id: "lilac", en: "Lilac Manuscript", cn: "紫罗兰手稿" },
];

export function ThemePicker() {
  const language = useFamilyStore((state) => state.language);
  const backgroundTheme = useFamilyStore((state) => state.backgroundTheme);
  const setBackgroundTheme = useFamilyStore((state) => state.setBackgroundTheme);
  const [open, setOpen] = useState(false);
  const active = themes.find((theme) => theme.id === backgroundTheme) ?? themes[0];
  const label = language === "cn" ? "背景主题" : "Background theme";

  return (
    <div className="theme-picker">
      <button type="button" className="theme-picker-trigger" aria-expanded={open} aria-label={label} onClick={() => setOpen((value) => !value)}>
        <span className={`theme-swatch ${backgroundTheme}`} aria-hidden="true" />
        <span>{language === "cn" ? active.cn : active.en}</span>
      </button>
      {open && <div className="theme-picker-menu" role="menu" aria-label={label}>
        {themes.map((theme) => <button key={theme.id} type="button" role="menuitemradio" aria-checked={theme.id === backgroundTheme} className={theme.id === backgroundTheme ? "active" : ""} onClick={() => { setBackgroundTheme(theme.id); setOpen(false); }}>
          <span className={`theme-swatch ${theme.id}`} aria-hidden="true" />
          <span>{language === "cn" ? theme.cn : theme.en}</span>
        </button>)}
      </div>}
    </div>
  );
}
