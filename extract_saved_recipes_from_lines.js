const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const lineMap = {};

// Find lines starting with number
const matches = content.matchAll(/(\\n|^)([0-9]+):\s+([^\n]+)/g);
for (const m of matches) {
  const lineNum = parseInt(m[2], 10);
  let text = m[3].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
  if (!lineMap[lineNum]) {
    lineMap[lineNum] = text;
  }
}

// Collect lines from 660 to 1240
const codeLines = [];
for (let i = 660; i <= 1240; i++) {
  if (lineMap[i]) {
    codeLines.push(lineMap[i]);
  }
}

const savedRecipesCode = codeLines.join('\n');
console.log("Extracted savedRecipes code snippet length:", savedRecipesCode.length);

try {
  const jsStr = savedRecipesCode.replace(/const savedRecipes =/, '').trim().replace(/;$/, '');
  const parsedObj = eval('(' + jsStr + ')');
  console.log("✅ SUCCESSFULLY RECOVERED USER CUSTOM RECIPES!");
  console.log("Count:", Object.keys(parsedObj).length);
  console.log("Recipes:", Object.values(parsedObj).map(r => r.name));
  
  fs.writeFileSync('true_user_custom_recipes.json', JSON.stringify(parsedObj, null, 2), 'utf8');
} catch(e) {
  console.error("Eval failed:", e.message);
  fs.writeFileSync('savedRecipesCode_debug.txt', savedRecipesCode, 'utf8');
}
