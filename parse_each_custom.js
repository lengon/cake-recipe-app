const fs = require('fs');

const txt = fs.readFileSync('savedRecipesJs_debug.txt', 'utf8');

const recipes = {};

// Find "custom_...": { ... }
const regex = /"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?"name"\s*:\s*"([^"]+)"[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g;

let m;
while ((m = regex.exec(txt)) !== null) {
  const id = m[1];
  const objStr = m[2];
  const name = m[3];
  try {
    const parsed = JSON.parse(objStr);
    recipes[id] = parsed;
    console.log(`✅ RECOVERED USER RECIPE: [${id}] ${name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + objStr + ')');
      recipes[id] = evaled;
      console.log(`✅ RECOVERED USER RECIPE (eval): [${id}] ${name}`);
    } catch(err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
}

console.log(`\n========================================`);
console.log(`TOTAL RECOVERED USER RECIPES: ${Object.keys(recipes).length}`);
console.log(`========================================\n`);

fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(recipes, null, 2), 'utf8');
