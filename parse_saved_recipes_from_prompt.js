const fs = require('fs');

const txt = fs.readFileSync('step_197_prompt.txt', 'utf8');

// Match each recipe block "custom_...": { ... }
const recipes = {};
const regex = /"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\}\s*\})/g;

let match;
while ((match = regex.exec(txt)) !== null) {
  const id = match[1];
  const objStr = match[2];
  try {
    const parsed = JSON.parse(objStr);
    recipes[id] = parsed;
    console.log(`Parsed: ${id} -> ${parsed.name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + objStr + ')');
      recipes[id] = evaled;
      console.log(`Evaled: ${id} -> ${evaled.name}`);
    } catch(err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
}

console.log("Total recovered user recipes:", Object.keys(recipes).length);
fs.writeFileSync('restored_user_custom_recipes.json', JSON.stringify(recipes, null, 2), 'utf8');
