const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const targetNames = [
  "濃郁巧克力杏仁粉蛋糕",
  "波斯風情豆蔻杏仁蛋糕",
  "檸香瑪斯卡波乳酪蛋糕",
  "經典半熟起士塔"
];

console.log("Searching transcript for target recipe names...");

const foundRecipes = {};

for (const name of targetNames) {
  const idx = content.indexOf(name);
  if (idx !== -1) {
    console.log(`Found "${name}" at index ${idx}`);
    // Find the enclosing object block around this name
    const blockStart = content.lastIndexOf('{', idx);
    const blockEnd = content.indexOf('}', idx);
    // Find custom_ID before block
    const customMatch = content.substring(Math.max(0, idx - 300), idx).match(/"(custom_[0-9]+)"/);
    const id = customMatch ? customMatch[1] : `custom_${name}`;
    console.log(`Associated ID: ${id}`);
  }
}
