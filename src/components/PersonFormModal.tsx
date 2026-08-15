import { useMemo, useState, type FormEvent } from "react";
import { createPerson, type CreatePersonInput } from "../api/peopleApi";
import { useFamilyStore } from "../store";
import { copyFor, textFor } from "../features/shared/presentation";
import type { Person } from "../types";

type PersonFormModalProps = {
  people: Person[];
  onClose: () => void;
  onCreated: (person: Person) => void;
};

function createPersonId(birthYear: string, firstName: string, sequence: number) {
  const year = Number(birthYear);
  const century = Number.isFinite(year) && year > 0 ? String(Math.floor(year / 100) + 1).padStart(2, "0") : "00";
  const initial = (firstName.trim()[0] || "X").toUpperCase();
  const date = new Date();
  const dateCode = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const nonce = Math.random().toString(36).slice(2, 3).toUpperCase();
  return `${century}${initial}${dateCode}${nonce}${String(sequence).padStart(3, "0")}`;
}

export function PersonFormModal({ people, onClose, onCreated }: PersonFormModalProps) {
  const language = useFamilyStore((state) => state.language);
  const t = copyFor(language);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [gender, setGender] = useState<CreatePersonInput["gender"]>("unknown");
  const [dynasty, setDynasty] = useState("");
  const [primaryTitle, setPrimaryTitle] = useState("");
  const [rank, setRank] = useState("untitled");
  const [wikiUrl, setWikiUrl] = useState("");
  const [fatherId, setFatherId] = useState("");
  const [motherId, setMotherId] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const suggestedId = useMemo(() => createPersonId(birthYear, firstName, people.length + 1), [birthYear, firstName, people.length]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const person = await createPerson({
        id: suggestedId,
        firstName,
        lastName,
        displayName: displayName || `${firstName} ${lastName}`.trim(),
        fullName: fullName || displayName || `${firstName} ${lastName}`.trim(),
        gender,
        birthYear: birthYear ? Number(birthYear) : undefined,
        deathYear: deathYear ? Number(deathYear) : undefined,
        dynasty,
        primaryTitle,
        rank,
        wikiUrl,
        fatherId: fatherId || undefined,
        motherId: motherId || undefined,
        tags: tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean),
      });
      onCreated(person);
      onClose();
    } catch (caught) {
      console.error(caught);
      // Server validation messages are English; CN mode shows the localized
      // generic error instead so the modal stays fully translated.
      setError(language === "cn" ? t.couldNotSave : caught instanceof Error ? caught.message : t.couldNotSave);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="person-form-modal" role="dialog" aria-modal="true" aria-labelledby="person-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="detail-eyebrow">{t.databaseEntry}</span>
            <h2 id="person-form-title">{t.addPersonTitle}</h2>
          </div>
          <button type="button" onClick={onClose}>{t.close}</button>
        </div>
        <form onSubmit={submit}>
          <div className="person-form-grid">
            <label>{t.firstName}<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
            <label>{t.lastName}<input value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
            <label>{t.displayName}<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
            <label>{t.fullName}<input value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
            <label>{t.birthYear}<input inputMode="numeric" value={birthYear} onChange={(event) => setBirthYear(event.target.value)} /></label>
            <label>{t.deathYear}<input inputMode="numeric" value={deathYear} onChange={(event) => setDeathYear(event.target.value)} /></label>
            <label>{t.gender}<select value={gender} onChange={(event) => setGender(event.target.value as CreatePersonInput["gender"])}><option value="unknown">{t.unknown}</option><option value="male">{t.male}</option><option value="female">{t.female}</option></select></label>
            <label>{t.rank}<select value={rank} onChange={(event) => setRank(event.target.value)}><option value="untitled">{t.untitled}</option><option value="count">{t.count}</option><option value="duke">{t.duke}</option><option value="king">{t.king}</option><option value="queen">{t.queen}</option><option value="emperor">{t.emperor}</option></select></label>
            <label>{t.dynasty}<input value={dynasty} onChange={(event) => setDynasty(event.target.value)} /></label>
            <label>{t.primaryTitle}<input value={primaryTitle} onChange={(event) => setPrimaryTitle(event.target.value)} /></label>
            <label>{t.father}<select value={fatherId} onChange={(event) => setFatherId(event.target.value)}><option value="">{t.unknown}</option>{people.filter((person) => person.gender === "male").map((person) => <option key={person.id} value={person.id}>{textFor(person, language).displayName} · {person.id}</option>)}</select></label>
            <label>{t.mother}<select value={motherId} onChange={(event) => setMotherId(event.target.value)}><option value="">{t.unknown}</option>{people.filter((person) => person.gender === "female").map((person) => <option key={person.id} value={person.id}>{textFor(person, language).displayName} · {person.id}</option>)}</select></label>
            <label className="span-two">{t.tagsLabel}<input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t.tagsPlaceholder} /></label>
            <label className="span-two">{t.englishWikipedia}<input type="url" value={wikiUrl} onChange={(event) => setWikiUrl(event.target.value)} placeholder="https://en.wikipedia.org/..." /></label>
          </div>
          <p className="person-id-preview">{t.idLabel}: <code>{suggestedId}</code></p>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="primary-action" disabled={isSaving}>{isSaving ? t.saving : t.savePerson}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
