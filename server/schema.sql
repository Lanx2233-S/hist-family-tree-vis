CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  display_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT '',
  also_known_as TEXT[] NOT NULL DEFAULT '{}',
  nickname_tags TEXT[] NOT NULL DEFAULT '{}',
  birth_year INTEGER,
  death_year INTEGER,
  birth_place TEXT NOT NULL DEFAULT '',
  death_place TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT 'unknown',
  dynasty TEXT NOT NULL DEFAULT '',
  house TEXT NOT NULL DEFAULT '',
  culture TEXT NOT NULL DEFAULT '',
  faith TEXT NOT NULL DEFAULT '',
  primary_title TEXT NOT NULL DEFAULT '',
  rank TEXT NOT NULL DEFAULT 'untitled',
  importance_score INTEGER NOT NULL DEFAULT 0,
  wiki_url TEXT NOT NULL DEFAULT '',
  portrait_url TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  source_note TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  death_cause JSONB,
  created_date TEXT NOT NULL,
  created_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chinese display fields for the CN interface mode. English columns remain the
-- canonical layer; localized carries only optional presentation overrides.
ALTER TABLE people ADD COLUMN IF NOT EXISTS localized JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS person_parentage (
  child_id TEXT PRIMARY KEY REFERENCES people(id) ON DELETE CASCADE,
  father_id TEXT REFERENCES people(id) ON DELETE SET NULL,
  mother_id TEXT REFERENCES people(id) ON DELETE SET NULL,
  CHECK (father_id IS NULL OR father_id <> child_id),
  CHECK (mother_id IS NULL OR mother_id <> child_id)
);

CREATE TABLE IF NOT EXISTS person_unions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_a_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  person_b_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  union_type TEXT NOT NULL CHECK (union_type IN ('marriage', 'former_marriage', 'partner')),
  started_on DATE,
  ended_on DATE,
  UNIQUE (person_a_id, person_b_id, union_type),
  CHECK (person_a_id <> person_b_id)
);

CREATE TABLE IF NOT EXISTS person_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_year INTEGER,
  end_year INTEGER
);

ALTER TABLE person_titles ADD COLUMN IF NOT EXISTS title_cn TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS person_tags (
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (person_id, tag)
);

CREATE TABLE IF NOT EXISTS person_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  happened_on DATE,
  year INTEGER,
  month INTEGER,
  day INTEGER,
  event_type TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  weight INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  wiki_url TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  CHECK (month IS NULL OR month BETWEEN 1 AND 12),
  CHECK (day IS NULL OR day BETWEEN 1 AND 31)
);

ALTER TABLE person_events ADD COLUMN IF NOT EXISTS label_cn TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS people_name_search_idx ON people USING gin (
  to_tsvector('simple', display_name || ' ' || full_name || ' ' || nickname)
);
CREATE INDEX IF NOT EXISTS parentage_father_idx ON person_parentage(father_id);
CREATE INDEX IF NOT EXISTS parentage_mother_idx ON person_parentage(mother_id);
CREATE INDEX IF NOT EXISTS union_person_a_idx ON person_unions(person_a_id);
CREATE INDEX IF NOT EXISTS union_person_b_idx ON person_unions(person_b_id);
CREATE INDEX IF NOT EXISTS person_events_person_idx ON person_events(person_id, year, month, day);
CREATE UNIQUE INDEX IF NOT EXISTS person_titles_unique_idx ON person_titles (person_id, title, COALESCE(start_year, -1), COALESCE(end_year, -1));
CREATE UNIQUE INDEX IF NOT EXISTS person_events_unique_idx ON person_events (person_id, COALESCE(year, -1), COALESCE(month, -1), COALESCE(day, -1), label);
