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

const rawBlock = linesList.join('\n')
  .replace(/\\"/g, '"')
  .replace(/\\n/g, '\n')
  .replace(/\\\\/g, '\\');

console.log("Raw savedRecipes block length:", rawBlock.length);

const userRecipes = {};

// Match "custom_XXX": { ... }
const regex = /"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?"name"\s*:\s*"([^"]+)"[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g;

let m;
while ((m = regex.exec(rawBlock)) !== null) {
  const id = m[1];
  const jsonStr = m[2];
  const name = m[3];
  try {
    const parsed = JSON.parse(jsonStr);
    userRecipes[id] = parsed;
    console.log(`✅ RECOVERED USER RECIPE: [${id}] ${name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + jsonStr + ')');
      userRecipes[id] = evaled;
      console.log(`✅ RECOVERED USER RECIPE (eval): [${id}] ${name}`);
    } catch(err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
}

console.log(`\n========================================`);
console.log(`TOTAL USER CUSTOM RECIPES RECOVERED: ${Object.keys(userRecipes).length}`);
console.log(`Names:`, Object.values(userRecipes).map(r => r.name));
console.log(`========================================\n`);

fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(userRecipes, null, 2), 'utf8');
