import { useMemo, useState, type FormEvent } from "react";
import { createPerson, type CreatePersonInput } from "../api/peopleApi";
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
      setError(caught instanceof Error ? caught.message : "Could not save person.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="person-form-modal" role="dialog" aria-modal="true" aria-labelledby="person-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="detail-eyebrow">DATABASE ENTRY</span>
            <h2 id="person-form-title">Add person</h2>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <form onSubmit={submit}>
          <div className="person-form-grid">
            <label>First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
            <label>Last name<input value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
            <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
            <label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
            <label>Born<input inputMode="numeric" value={birthYear} onChange={(event) => setBirthYear(event.target.value)} /></label>
            <label>Died<input inputMode="numeric" value={deathYear} onChange={(event) => setDeathYear(event.target.value)} /></label>
            <label>Gender<select value={gender} onChange={(event) => setGender(event.target.value as CreatePersonInput["gender"])}><option value="unknown">Unknown</option><option value="male">Male</option><option value="female">Female</option></select></label>
            <label>Rank<select value={rank} onChange={(event) => setRank(event.target.value)}><option value="untitled">Untitled</option><option value="count">Count</option><option value="duke">Duke</option><option value="king">King</option><option value="queen">Queen</option><option value="emperor">Emperor</option></select></label>
            <label>Dynasty<input value={dynasty} onChange={(event) => setDynasty(event.target.value)} /></label>
            <label>Primary title<input value={primaryTitle} onChange={(event) => setPrimaryTitle(event.target.value)} /></label>
            <label>Father<select value={fatherId} onChange={(event) => setFatherId(event.target.value)}><option value="">Unknown</option>{people.filter((person) => person.gender === "male").map((person) => <option key={person.id} value={person.id}>{person.displayName} · {person.id}</option>)}</select></label>
            <label>Mother<select value={motherId} onChange={(event) => setMotherId(event.target.value)}><option value="">Unknown</option>{people.filter((person) => person.gender === "female").map((person) => <option key={person.id} value={person.id}>{person.displayName} · {person.id}</option>)}</select></label>
            <label className="span-two">Tags<input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="monarch, commander, noble" /></label>
            <label className="span-two">English Wikipedia<input type="url" value={wikiUrl} onChange={(event) => setWikiUrl(event.target.value)} placeholder="https://en.wikipedia.org/..." /></label>
          </div>
          <p className="person-id-preview">ID: <code>{suggestedId}</code></p>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-action" disabled={isSaving}>{isSaving ? "Saving" : "Save person"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
