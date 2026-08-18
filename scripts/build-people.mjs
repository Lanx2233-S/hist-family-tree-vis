#!/usr/bin/env node
/**
 * build-people.mjs — generates people.normandy.json (repo root) from the split
 * source files in src/data/people/.
 *
 * DATA FLOW (single source of truth):
 *   src/data/people/*.json  →  this script  →  people.normandy.json  →  server/seed.mjs, scripts/*.mjs
 *
 * people.normandy.json is a GENERATED artifact — do not edit it manually.
 * Add or edit people in src/data/people/*.json (and keep manifest.json order
 * up to date), then run: npm run data:build
 *
 * Output format: uniform `JSON.stringify(people, null, 2)` + trailing newline.
 * (The pre-refactor file had mixed hand-edited layouts; a one-time formatting
 * diff was accepted when the generator became the single writer — see docs/log.md.)
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../src/data/people");
const outFile = resolve(here, "../people.normandy.json");

function fail(msg) {
  console.error(`[build-people] ERROR: ${msg}`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(await readFile(resolve(dataDir, "manifest.json"), "utf8"));
} catch (err) {
  fail(`cannot read or parse manifest.json: ${err.message}`);
}

// Consistency guard: manifest.files must equal the JSON imports in index.ts.
{
  let indexSrc;
  try {
    indexSrc = await readFile(resolve(dataDir, "index.ts"), "utf8");
  } catch (err) {
    fail(`cannot read src/data/people/index.ts: ${err.message}`);
  }
  const imported = [...indexSrc.matchAll(/import \w+ from "\.\/(\w+)\.json"/g)]
    .map((m) => m[1])
    .filter((name) => name !== "manifest") // manifest.json is the order file, not a data file
    .sort();
  const listed = manifest.files.map((f) => f.replace(/\.json$/, "")).sort();
  if (JSON.stringify(imported) !== JSON.stringify(listed))
    fail("manifest.files does not match index.ts JSON imports");
}

const byId = new Map();
for (const file of manifest.files) {
  let records;
  try {
    records = JSON.parse(await readFile(resolve(dataDir, file), "utf8"));
  } catch (err) {
    fail(`cannot read or parse ${file}: ${err.message}`);
  }
  if (!Array.isArray(records)) fail(`${file} is not a JSON array`);
  for (const record of records) {
    if (!record || typeof record.id !== "string" || record.id === "") fail(`${file} contains a record without a valid id`);
    if (byId.has(record.id)) fail(`duplicate UUID ${record.id} (also in ${file})`);
    byId.set(record.id, record);
  }
}

const orderSet = new Set(manifest.order);
if (orderSet.size !== manifest.order.length) fail("manifest.order contains duplicate UUIDs");
for (const id of manifest.order) if (!byId.has(id)) fail(`manifest.order references missing UUID ${id}`);
for (const id of byId.keys()) if (!orderSet.has(id)) fail(`UUID ${id} is missing from manifest.order (add new people there)`);

const PARENT_KEYS = ["fatherId", "motherId"]; // string, "" allowed
const LIST_KEYS = ["spouseIds", "partnerIds", "childIds"];
for (const record of byId.values()) {
  for (const key of PARENT_KEYS) {
    const v = record[key];
    if (typeof v === "string" && v !== "" && !byId.has(v)) fail(`${record.id} ${key}=${v} is an orphan reference`);
  }
  for (const key of LIST_KEYS) {
    const arr = record[key];
    if (arr == null) continue;
    if (!Array.isArray(arr)) fail(`${record.id} ${key} is not an array`);
    for (const v of arr) if (!byId.has(v)) fail(`${record.id} ${key} references missing UUID ${v}`);
  }
  for (const childId of record.childIds ?? []) {
    const child = byId.get(childId);
    if (!child || (child.fatherId !== record.id && child.motherId !== record.id))
      fail(`${record.id} lists child ${childId} but child does not reference it as parent`);
  }
}

const people = manifest.order.map((id) => byId.get(id));
await writeFile(outFile, JSON.stringify(people, null, 2) + "\n");
console.log(`[build-people] OK: ${people.length} people from ${manifest.files.length} files → people.normandy.json`);
