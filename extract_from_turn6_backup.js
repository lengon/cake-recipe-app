const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

const lineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    // Find view_file entries for code_artifact.html with line numbers around 58700-59100
    if (entry.content && entry.content.includes('Showing lines 58700')) {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          lineMap[parseInt(m[1], 10)] = m[2];
        }
      }
    }
  } catch(e){}
}

console.log("Lines captured around 58700-59100:", Object.keys(lineMap).length);

const customCodeLines = [];
for (let i = 58700; i <= 59050; i++) {
  if (lineMap[i]) customCodeLines.push(lineMap[i]);
}

const customJsStr = "{\n" + customCodeLines.join('\n') + "\n}";
console.log("Extracted JS snippet length:", customJsStr.length);

try {
  const evaled = eval('(' + customJsStr + ')');
  console.log("✅ SUCCESSFULLY RECOVERED USER CUSTOM RECIPES FROM TRANSCRIPT!");
  console.log("Count:", Object.keys(evaled).length);
  console.log("Recipes:", Object.values(evaled).map(r => r.name));
  
  fs.writeFileSync('all_recovered_user_custom_recipes.json', JSON.stringify(evaled, null, 2), 'utf8');
} catch(e) {
  console.error("Eval failed:", e.message);
  fs.writeFileSync('customJsStr_debug.txt', customJsStr, 'utf8');
}
