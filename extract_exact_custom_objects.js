const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const targetIds = [
  "custom_1783780600556",
  "custom_1783782113042",
  "custom_1784861569970",
  "custom_1784862334940"
];

const recoveredCustom = {};

for (const id of targetIds) {
  const searchStr = `"${id}"`;
  const idx = content.indexOf(searchStr);
  if (idx !== -1) {
    console.log(`Found ${id} at ${idx}`);
    // Find object starting after colon
    const colonIdx = content.indexOf(':', idx + searchStr.length);
    if (colonIdx !== -1) {
      const startBrace = content.indexOf('{', colonIdx);
      if (startBrace !== -1) {
        let openBraces = 0;
        let endBrace = -1;
        for (let i = startBrace; i < content.length; i++) {
          if (content[i] === '{') openBraces++;
          if (content[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
              endBrace = i;
              break;
            }
          }
        }
        if (endBrace !== -1) {
          const jsonStr = content.substring(startBrace, endBrace + 1);
          try {
            const parsed = JSON.parse(jsonStr);
            recoveredCustom[id] = parsed;
            console.log(`✅ Successfully extracted ${id} (${parsed.name})`);
          } catch(e) {
            console.error(`Failed to parse JSON for ${id}:`, e.message);
          }
        }
      }
    }
  } else {
    console.warn(`Could not find ${id} in transcript!`);
  }
}

console.log(`\nTotal recovered user custom recipes: ${Object.keys(recoveredCustom).length}`);
fs.writeFileSync('recovered_user_custom_recipes.json', JSON.stringify(recoveredCustom, null, 2), 'utf8');
