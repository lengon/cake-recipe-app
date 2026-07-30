const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const targetSteps = [67, 69, 71, 73, 75, 97, 99, 101, 103];
const lines = content.split('\n');

const lineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    if (targetSteps.includes(entry.step_index) && entry.content) {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          const lineNum = parseInt(m[1], 10);
          const lineText = m[2];
          if (lineNum >= 660 && lineNum <= 1240) {
            lineMap[lineNum] = lineText;
          }
        }
      }
    }
  } catch(e){}
}

console.log("Lines captured from steps 67-103 between 660 and 1240:", Object.keys(lineMap).length);

const codeLines = [];
for (let i = 660; i <= 1240; i++) {
  if (lineMap[i] !== undefined) {
    codeLines.push(lineMap[i]);
  }
}

const savedRecipesJs = codeLines.join('\n');
console.log("Captured JS length:", savedRecipesJs.length);

try {
  const codeToEval = '(' + savedRecipesJs.replace(/^const savedRecipes =/, '').trim().replace(/;\s*$/, '') + ')';
  const res = eval(codeToEval);
  console.log("🎉 SUCCESS! ALL USER CUSTOM RECIPES RECOVERED!");
  console.log("Total user custom recipes:", Object.keys(res).length);
  console.log("Names:", Object.values(res).map(r => r.name));
  fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(res, null, 2), 'utf8');
} catch(e) {
  console.error("Eval failed:", e.message);
  fs.writeFileSync('savedRecipesJs_debug.txt', savedRecipesJs, 'utf8');
}
