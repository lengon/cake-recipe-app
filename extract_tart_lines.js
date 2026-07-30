const fs = require('fs');

const content = fs.readFileSync('C:/Users/lengo/.gemini/antigravity/brain/fdd3f2f7-e6f4-401c-b01f-365b5b21d070/.system_generated/logs/transcript_full.jsonl', 'utf8');

const matches = content.matchAll(/(\\n|^)([0-9]+):\s+([^\n]+)/g);
const lineMap = {};

for (const m of matches) {
  const lineNum = parseInt(m[2], 10);
  const text = m[3].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
  if (lineNum >= 1040 && lineNum <= 1240) {
    if (!lineMap[lineNum]) {
      lineMap[lineNum] = text;
    }
  }
}

console.log("Lines captured from 1040 to 1240:", Object.keys(lineMap).length);

const lines = [];
for (let i = 1040; i <= 1240; i++) {
  if (lineMap[i]) lines.push(`${i}: ${lineMap[i]}`);
}

fs.writeFileSync('tart_lines_debug.txt', lines.join('\n'), 'utf8');
console.log("Saved tart_lines_debug.txt!");
