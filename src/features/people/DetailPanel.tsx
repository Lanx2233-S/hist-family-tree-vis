import { useState } from "react";
import { useFamilyStore } from "../../store";
import type { PersonEvent } from "../../types";
import { byImportance, copyFor, DeathCauseButton, eventAge, eventDateText, eventDateValue, eventLabelText, eventTagText, EventNote, genderMark, heraldryFor, initials, lifespan, shortEnglishName, tagText, textFor, years, type Language } from "../shared/presentation";
import kingOfEnglandData from "../../data/titles/king-of-england.json";

type DetailPanelProps = {
  personId?: string;
  onOpenHouse?: (personId: string) => void;
  onOpenTitleLineage?: (personId: string) => void;
};

const kingOfEnglandHolderIds = new Set((kingOfEnglandData.holders as Array<{ personId: string }>).map(({ personId }) => personId));

export function DetailPanel({ personId, onOpenHouse, onOpenTitleLineage }: DetailPanelProps = {}) {
  const people = useFamilyStore((state) => state.people);
  const selectedId = useFamilyStore((state) => state.selectedId);
  const language = useFamilyStore((state) => state.language);
  const [isTimelineOpen, setTimelineOpen] = useState(false);
  const [eventTag, setEventTag] = useState("all");
  const person = people.find((item) => item.id === (personId ?? selectedId)) ?? people[0];
  const t = copyFor(language);
  const label = textFor(person, language);
  const heraldry = heraldryFor(person);
  const hasTitleLineage = kingOfEnglandHolderIds.has(person.id);
  const titleLineageNames = new Set([
    kingOfEnglandData.canonicalName,
    ...kingOfEnglandData.aliases,
  ]);
  const topEvents = byImportance(person.events).slice(0, 3).sort((a, b) => eventDateValue(a) - eventDateValue(b));
  const timelineEvents = [...person.events].sort((a, b) => eventDateValue(a) - eventDateValue(b));
  const eventTags = Array.from(new Set(person.events.flatMap((event) => event.tags ?? [event.type])));
  const visibleTimelineEvents = eventTag === "all" ? timelineEvents : timelineEvents.filter((event) => (event.tags ?? [event.type]).includes(eventTag));

  return (
    <aside className="detail-panel">
      <div className="portrait-wrap">
        <div className="portrait">{initials(person, language)}</div>
        <span className={`portrait-gender ${person.gender}`}>{genderMark(person)}</span>
      </div>
      {heraldry && (
        <img className="detail-heraldry" src={heraldry.src} alt={heraldry.alt} />
      )}
      {onOpenHouse ? (
        <button type="button" className="detail-context-link eyebrow" onClick={() => onOpenHouse(person.id)}>
          {label.dynasty}
        </button>
      ) : <p className="eyebrow">{label.dynasty}</p>}
      <h2>{label.fullName}</h2>
      <div className="subtitle">
        <span className="primary-title">{label.primaryTitle}</span>
        <span className="life-row"><span>{years(person)}</span><strong>{lifespan(person, language)}</strong></span>
      </div>
      {label.nickname && <p className="nickname">"{label.nickname}"</p>}
      <div className="tag-row">{person.tags.map((tag) => <span key={tag}>{tagText(tag, language)}</span>)}</div>
      <dl className="facts">
        <div><dt>{t.culture}</dt><dd>{label.culture || t.unknown}</dd></div>
        <div><dt>{t.faith}</dt><dd>{label.faith || t.unknown}</dd></div>
        <div><dt>{t.born}</dt><dd>{label.birthPlace || t.unknown}</dd></div>
        <div><dt>{t.died}</dt><dd className="death-fact"><span>{label.deathPlace || t.unknown}</span><DeathCauseButton person={person} language={language} /></dd></div>
      </dl>
      <h3>{t.titles}</h3>
      <ul className="compact-list">
        {person.titles.map((title) => {
          const opensLineage = hasTitleLineage && onOpenTitleLineage && titleLineageNames.has(title.title);
          return (
            <li key={`${title.title}-${title.startYear}`}>
              {opensLineage ? (
                <button type="button" className="detail-context-link title-lineage-link" onClick={() => onOpenTitleLineage(person.id)}>
                  {label.title(title)}
                </button>
              ) : <strong>{label.title(title)}</strong>}
              <span>{title.startYear || "?"}-{title.endYear || "?"}</span>
            </li>
          );
        })}
      </ul>
      <div className="section-heading">
        <h3>{t.topEvents}</h3>
        {person.events.length > 0 && <button type="button" onClick={() => setTimelineOpen(true)}>{t.viewAllEvents}</button>}
      </div>
      <ul className="event-list">
        {topEvents.map((event) => (
          <li key={`${event.year}-${event.label}`}>
            <span>{eventDateText(event)}</span>
            <div className="event-main">
              <div className="event-title-row">
                <a href={event.wikiUrl} target="_blank" rel="noreferrer">{eventLabelText(event, language)}</a>
                <strong className="event-age">{eventAge(person, event, language)}</strong>
              </div>
              <div className="event-meta"><small>{eventTagText(event.tags?.[0] ?? event.type, language)}</small><EventNote note={event.note} language={language} /></div>
            </div>
          </li>
        ))}
      </ul>
      {isTimelineOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setTimelineOpen(false)}>
          <section className="timeline-modal" role="dialog" aria-modal="true" aria-label={`${label.fullName} ${t.events}`} onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div><p className="eyebrow">{label.fullName}</p><h3>{t.events}</h3></div>
              <div className="modal-actions">
                <label>
                  <span>{t.eventTag}</span>
                  <select value={eventTag} onChange={(event) => setEventTag(event.target.value)}>
                    <option value="all">{eventTagText("all", language)}</option>
                    {eventTags.map((tag) => <option key={tag} value={tag}>{eventTagText(tag, language)}</option>)}
                  </select>
                </label>
                <button type="button" onClick={() => setTimelineOpen(false)}>{t.close}</button>
              </div>
            </div>
            <ul className="timeline-list">
              {visibleTimelineEvents.map((event) => (
                <li key={`${event.year}-${event.label}`}>
                  <span className="timeline-year">{eventDateText(event)}</span>
                  <div>
                    <div className="event-title-row">
                      <a href={event.wikiUrl} target="_blank" rel="noreferrer">{eventLabelText(event, language)}</a>
                      <strong className="event-age">{eventAge(person, event, language)}</strong>
                    </div>
                    <div className="event-meta"><small>{(event.tags ?? [event.type]).map((tag) => eventTagText(tag, language)).join(" / ")}</small><EventNote note={event.note} language={language} /></div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      <a className="wiki-link" href={person.wikiUrl} target="_blank" rel="noreferrer">{t.wiki}</a>
    </aside>
  );
}
