import fs from "node:fs";
const file = "src/data/people/house-house-of-habsburg.json";
const people = JSON.parse(fs.readFileSync(file, "utf8"));
const causes = {
  "73b42b1a-c2dd-4d64-bdb2-1c0d63528f00": ["illness", "Died after an illness", "患病后去世", "The precise illness is not securely recorded.", "具体病因没有可靠记载."],
  "7f2f30fb-2735-4e96-a1b6-f9ec8703e9ff": ["illness", "Died after illness at Gutenstein", "在古腾施泰因患病去世", "The precise illness is not securely recorded.", "具体病因没有可靠记载."],
  "b56f6ca0-e20c-4c6a-a118-1c730bca3cf4": ["illness", "Died after illness in Vienna", "在维也纳患病去世", "Albert II died after a prolonged illness; the exact diagnosis is uncertain.", "阿尔布雷希特二世久病后去世，确切诊断不明."],
  "c0e5a6fc-5c06-408b-bc49-4ab9e592ca4b": ["illness", "Died after illness at Neuberg", "在诺伊贝格患病去世", "The precise illness is not securely recorded.", "具体病因没有可靠记载."],
  "4340617b-1fb7-43d9-afcc-bf826c55c8b7": ["illness", "Died suddenly in Milan", "在米兰突发疾病去世", "Rudolf IV died suddenly while travelling; the exact illness is uncertain.", "鲁道夫四世在旅途中突然去世，确切病因不明."],
  "b9386e8c-6886-4cea-b6f1-b1205598335c": ["normal", "Died at Laxenburg", "在拉克森堡去世", "No specific cause is securely recorded.", "没有可靠记载的具体死因."],
  "25bd05f2-280c-4472-a83a-e8a5081bd43f": ["battle", "Killed at the Battle of Sempach", "在森帕赫战役中阵亡", "Leopold III was killed in battle while leading the Austrian forces.", "利奥波德三世率奥地利军队作战时阵亡."],
  "f3e3018e-8778-4d52-948f-b5c002800b36": ["normal", "Died at Bruck an der Mur", "在布鲁克于穆尔去世", "No specific cause is securely recorded.", "没有可靠记载的具体死因."],
  "6778e952-ab13-4294-9562-38559a6223e2": ["illness", "Died after illness at Klosterneuburg", "在克洛斯特新堡患病去世", "Albert IV died after illness; the precise diagnosis is uncertain.", "阿尔布雷希特四世患病后去世，确切诊断不明."],
  "5541d187-7dfd-439c-b664-44ad103e413a": ["illness", "Died suddenly in Prague", "在布拉格突发疾病去世", "Ladislaus died suddenly; poisoning was alleged but is not established, and illness remains the cautious description.", "拉迪斯拉斯突然去世；虽有中毒传闻，但未获证实，谨以疾病概括."],
};
for (const p of people) {
  const c = causes[p.id];
  if (!c) continue;
  p.deathCause = { kind: c[0], summary: c[1], summaryCn: c[2], detail: c[3], detailCn: c[4], wikiUrl: p.sourceUrl || p.wikiUrl };
}
fs.writeFileSync(file, `${JSON.stringify(people, null, 2)}\n`);
console.log(`[add-early-habsburg-death-causes] updated ${Object.keys(causes).length} cards`);
