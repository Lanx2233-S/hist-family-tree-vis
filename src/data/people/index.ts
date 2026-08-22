import type { Person } from "../../types";
import normandy from "./normandy.json";
import wessex from "./wessex.json";
import godwin from "./godwin.json";
import carolingian from "./carolingian.json";
import capet from "./capet.json";
import plantagenet from "./plantagenet.json";
import york from "./york.json";
import tudor from "./tudor.json";
import other from "./other.json";
import temporaryScotland from "./temporary-scotland.json";
import temporarySicily from "./temporary-sicily.json";
import temporaryFranceQueens from "./temporary-france-queens.json";
import temporaryBurgundy from "./temporary-burgundy.json";
import temporaryChampagne from "./temporary-champagne.json";
import temporaryLouisViChildren from "./temporary-louis-vi-children.json";
import temporaryLouisViiConstance from "./temporary-louis-vii-constance.json";
import temporaryToulouse from "./temporary-toulouse.json";
import temporaryAnjou from "./temporary-anjou.json";

/** Original array order of the people dataset (captured at split time 2026-08-18), shared with scripts/build-people.mjs via manifest.json — keeps UI order unchanged. */
import manifest from "./manifest.json";
const ORIGINAL_ORDER: string[] = manifest.order;

const all = [...normandy, ...wessex, ...godwin, ...carolingian, ...capet, ...plantagenet, ...york, ...tudor, ...other, ...temporaryScotland, ...temporarySicily, ...temporaryFranceQueens, ...temporaryBurgundy, ...temporaryChampagne, ...temporaryLouisViChildren, ...temporaryLouisViiConstance, ...temporaryToulouse, ...temporaryAnjou];
const byId = new Map<string, Person>();
for (const record of all) byId.set(record.id, record as Person);

const ordered = ORIGINAL_ORDER.map((id) => byId.get(id)).filter((p): p is Person => p !== undefined);
const extras = [...byId.values()].filter((p) => !ORIGINAL_ORDER.includes(p.id));
if (extras.length > 0) console.warn(`[data/people] ${extras.length} person(s) not in ORIGINAL_ORDER — appended at end.`);

export const people: Person[] = [...ordered, ...extras];
export default people;
