import fs from "node:fs";
import path from "node:path";

const dataDirectory = "src/data/people";
const manifest = JSON.parse(fs.readFileSync(path.join(dataDirectory, "manifest.json"), "utf8"));

// A dynasty is the wider bloodline; a house is its territorial or cadet branch.
const dynastyByHouse = {
  "House of Capet": "Capetian dynasty",
  "House of Valois": "Capetian dynasty",
  "House of Vermandois": "Capetian dynasty",
  "Capetian House of Anjou": "Capetian dynasty",
  "House of Valois-Anjou": "Capetian dynasty",
  "House of Valois-Burgundy": "Capetian dynasty",
  "House of Évreux": "Capetian dynasty",
  "House of Bourbon": "Capetian dynasty",
  "House of Blois": "Blois dynasty",
  "House of Blois-Champagne": "Blois dynasty",
  "House of Blois-Navarre": "Blois dynasty",
  "House of Champagne": "Blois dynasty",
  "House of Reginar": "Reginar dynasty",
  "House of Leuven": "Reginar dynasty",
  "House of Wittelsbach": "Wittelsbach dynasty",
  "House of Wittelsbach — Bavaria-Ingolstadt": "Wittelsbach dynasty",
  "House of Habsburg": "Habsburg dynasty",
  "Elder House of Burgundy": "Capetian dynasty",
  "House of Barcelona": "Barcelona dynasty",
  "House of Luxembourg": "Luxembourg dynasty",
  "House of Savoy": "Savoy dynasty",
};

const lineageById = {
  "04bd4507-aadb-4108-9bb4-278c7e06ae53": ["Tosny dynasty", "House of Tosny"],
  "a7f4c320-5137-4cfd-b522-52e951026caf": ["Unknown dynasty", "Unknown house"],
  "de7af180-4027-4b64-a5c5-9c7c1ac271ae": ["Dinefwr dynasty", "House of Dinefwr"],
  "282ca949-3e4e-460c-b438-2c40887812e4": ["Unknown dynasty", "House of Northampton"],
  "5f92a3cf-4044-4892-8f05-d8959a80451d": ["Crépon dynasty", "House of Crépon"],
  "bb5c0007-6a34-4f57-9c04-3083e7f4e55f": ["Unknown dynasty", "House of Thorkell"],
  "40e82515-a8a4-4a7a-bcf0-dff6322baef6": ["Unknown dynasty", "Unknown house"],
  "0736f259-d8fa-4263-9a07-73475f48bfd3": ["Ivrea dynasty", "House of Ivrea"],
  "78567b44-2170-4e3d-b85a-be845be240d2": ["Barcelona dynasty", "House of Barcelona"],
  "27376224-deaa-4e09-9598-ed3599d8f9b2": ["Blois dynasty", "House of Blois-Navarre"],
  "716b8ebd-b9c6-4654-8b0a-87c1ef575170": ["Capetian dynasty", "Elder House of Burgundy"],
  "b311455b-ff52-423e-bd27-5c513759778e": ["Capetian dynasty", "Capetian House of Anjou"],
  "906246fe-bb15-48a1-b69f-ff5cc0fecbb0": ["Ivrea dynasty", "House of Ivrea"],
  "e01b2392-3487-43ac-80f6-cb640d051d06": ["Ivrea dynasty", "House of Ivrea"],
  "16fce723-eb78-47ff-955b-7ce3e266dd3c": ["Luxembourg dynasty", "House of Luxembourg"],
  "c52abfa0-d8c2-4b49-852b-c9f25688277a": ["Capetian dynasty", "House of Évreux"],
  "3401be01-ecb6-4d4c-b64b-777bf04937ef": ["Capetian dynasty", "Elder House of Burgundy"],
  "0181c695-5273-4c44-a052-88b55ef19d68": ["Capetian dynasty", "House of Évreux"],
  "c5cb5a6d-e9f7-4899-bb5c-7f5734fe92ed": ["Luxembourg dynasty", "House of Luxembourg"],
  "570fe380-a70d-430d-a43f-0501e6aa3c86": ["Auvergne dynasty", "House of Auvergne"],
  "0a4d4bdc-13c6-4f01-81bf-8e049c4bddca": ["Capetian dynasty", "House of Bourbon"],
  "904d5881-253a-44ab-adbb-f0c9a786de58": ["Wittelsbach dynasty", "House of Wittelsbach — Bavaria-Ingolstadt"],
  "6f145993-e643-4673-b39f-80e8a3430f97": ["Capetian dynasty", "House of Valois-Anjou"],
  "1aceb9f3-41a0-410e-aa94-f1142f0eda1e": ["Savoy dynasty", "House of Savoy"],
};

let changedPeople = 0;
for (const file of manifest.files) {
  const filePath = path.join(dataDirectory, file);
  const source = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const people = Array.isArray(source) ? source : source.people;
  if (!Array.isArray(people)) continue;
  let changed = false;

  for (const person of people) {
    const explicit = lineageById[person.id];
    const dynasty = explicit?.[0] ?? dynastyByHouse[person.house];
    const house = explicit?.[1];
    if (dynasty && person.dynasty !== dynasty) {
      person.dynasty = dynasty;
      changed = true;
    }
    if (house && person.house !== house) {
      person.house = house;
      changed = true;
    }
    if (!person.dynasty || !person.house) {
      throw new Error(`Missing lineage after normalization: ${person.fullName} (${person.id})`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(source, null, 2)}\n`);
    changedPeople += people.length;
  }
}

console.log(`Normalized dynasty/house fields; rewrote ${changedPeople} people across manifest files.`);
