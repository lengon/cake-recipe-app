const fs = require('fs');

const txt = fs.readFileSync('customJsStr_debug.txt', 'utf8');

// Match custom_... objects
const userRecipes = {};
const idRegex = /"(custom_[0-9]+)"\s*:\s*\{/g;

let m;
while ((m = idRegex.exec(txt)) !== null) {
  const id = m[1];
  const startIdx = m.index + m[0].length - 1;
  let openBraces = 0;
  let endIdx = -1;
  for (let i = startIdx; i < txt.length; i++) {
    if (txt[i] === '{') openBraces++;
    if (txt[i] === '}') {
      openBraces--;
      if (openBraces === 0) {
        endIdx = i;
        break;
      }
    }
  }
  if (endIdx !== -1) {
    const jsonBlock = txt.substring(startIdx, endIdx + 1);
    try {
      const parsed = JSON.parse(jsonBlock);
      userRecipes[id] = parsed;
      console.log(`✅ RECOVERED USER RECIPE: [${id}] ${parsed.name}`);
    } catch(e) {
      try {
        const evaled = eval('(' + jsonBlock + ')');
        userRecipes[id] = evaled;
        console.log(`✅ RECOVERED USER RECIPE (eval): [${id}] ${evaled.name}`);
      } catch(err) {
        console.error(`Failed ${id}:`, err.message);
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`TOTAL USER CUSTOM RECIPES RECOVERED: ${Object.keys(userRecipes).length}`);
console.log(`========================================\n`);

fs.writeFileSync('all_recovered_user_custom_recipes.json', JSON.stringify(userRecipes, null, 2), 'utf8');
