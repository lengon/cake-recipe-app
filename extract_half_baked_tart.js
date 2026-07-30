const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const idx = content.indexOf('Half-Baked Cheese Tart');
console.log("Index of Half-Baked Cheese Tart in transcript:", idx);

if (idx !== -1) {
  // Find start of object
  const startIdx = content.lastIndexOf('{\n        "id": "custom_1784862334940"', idx);
  console.log("startIdx:", startIdx);
  
  let openBraces = 0;
  let endIdx = -1;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') openBraces++;
    if (content[i] === '}') {
      openBraces--;
      if (openBraces === 0) {
        endIdx = i;
        break;
      }
    }
  }
  
  if (endIdx !== -1) {
    const rawJson = content.substring(startIdx, endIdx + 1);
    console.log("Raw JSON block length:", rawJson.length);
    try {
      const parsed = JSON.parse(rawJson);
      console.log("✅ SUCCESSFULLY PARSED custom_1784862334940:", parsed.name);
      fs.writeFileSync('custom_1784862334940.json', JSON.stringify(parsed, null, 2), 'utf8');
    } catch(e) {
      console.error("JSON parse failed:", e.message);
      fs.writeFileSync('custom_1784862334940_debug.txt', rawJson, 'utf8');
    }
  }
}
