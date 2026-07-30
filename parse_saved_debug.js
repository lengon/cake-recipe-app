const fs = require('fs');

let txt = fs.readFileSync('savedRecipesCode_debug.txt', 'utf8');

// Strip line numbers if present, or clean up
txt = txt.replace(/^const savedRecipes =/, '').trim();

// Try JSON.parse or regex extraction of each custom recipe block
const customRecipes = {};
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
      customRecipes[id] = parsed;
      console.log(`✅ Recovered recipe [${id}]: ${parsed.name}`);
    } catch(e) {
      try {
        const evaled = eval('(' + jsonBlock + ')');
        customRecipes[id] = evaled;
        console.log(`✅ Recovered recipe (eval) [${id}]: ${evaled.name}`);
      } catch(err) {
        console.error(`Failed parsing ${id}:`, err.message);
      }
    }
  }
}

console.log(`\nTOTAL RECOVERED USER CUSTOM RECIPES: ${Object.keys(customRecipes).length}`);
fs.writeFileSync('true_user_custom_recipes.json', JSON.stringify(customRecipes, null, 2), 'utf8');
