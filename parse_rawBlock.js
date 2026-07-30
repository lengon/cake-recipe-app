const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const lineMap = {};
const matches = content.matchAll(/(\\n|^)([0-9]+):\s+([^\n]+)/g);
for (const m of matches) {
  const lineNum = parseInt(m[2], 10);
  let lineText = m[3];
  if (!lineMap[lineNum]) {
    lineMap[lineNum] = lineText;
  }
}

const linesList = [];
for (let i = 660; i <= 1100; i++) {
  if (lineMap[i]) {
    linesList.push(lineMap[i]);
  }
}

const rawBlock = linesList.join('\n');
console.log("rawBlock raw snippet:", rawBlock.slice(0, 300));

// Strip line numbers if present
const cleanCode = rawBlock.replace(/^[0-9]+:\s*/gm, '');

// Parse eval
try {
  const codeToEval = '(' + cleanCode.replace(/^const savedRecipes =/, '').trim().replace(/;$/, '') + ')';
  const res = eval(codeToEval);
  console.log("✅ EVAL SUCCESSFUL!");
  console.log("Total user custom recipes:", Object.keys(res).length);
  console.log("Names:", Object.values(res).map(r => r.name));
  fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(res, null, 2), 'utf8');
} catch(e) {
  console.error("Eval failed:", e.message);
}
