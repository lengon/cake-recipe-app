const fs = require('fs');

console.log("Rebuilding complete dataset with original presets + user custom + Brian recipes...");

// 1. Load original 16 presets
const origPresets = JSON.parse(fs.readFileSync('all_recovered_original_recipes.json', 'utf8'));

// 2. Load step 197 user prompt custom recipes text and parse cleanly
const step197Txt = fs.readFileSync('step_197_prompt.txt', 'utf8');

// Parse step 197 custom recipes
const customMap = {};
const savedIdx = step197Txt.indexOf('const savedRecipes = {');
if (savedIdx !== -1) {
  const jsonCode = step197Txt.substring(savedIdx + 'const savedRecipes ='.length).trim();
  // match "custom_XXX": { ... }
  const idMatches = jsonCode.matchAll(/"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?\n\s*\}\s*\},?\s*\n|\{[\s\S]*?\n\s*\}\s*\})/g);
  for (const m of idMatches) {
    const id = m[1];
    const block = m[2].replace(/,\s*$/, '');
    try {
      const parsed = JSON.parse(block);
      customMap[id] = parsed;
      console.log(`✅ Recovered User Custom Recipe: [${id}] ${parsed.name}`);
    } catch(e) {
      try {
        const evaled = eval('(' + block + ')');
        customMap[id] = evaled;
        console.log(`✅ Recovered User Custom Recipe (eval): [${id}] ${evaled.name}`);
      } catch(err){
        console.error(`Failed parsing user custom ${id}:`, err.message);
      }
    }
  }
}

// 3. Load Brian 459 recipes
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

// Combine ALL recipes in exact logical order: User Custom Recipes first, then Presets, then Brian Recipes!
const grandTotalRecipes = {
  ...customMap,
  ...origPresets,
  ...brianRecipes
};

console.log(`\n========================================`);
console.log(`GRAND TOTAL RECIPES RECOVERED: ${Object.keys(grandTotalRecipes).length}`);
console.log(`- User Custom Recipes: ${Object.keys(customMap).length}`);
console.log(`- Original Preset Recipes: ${Object.keys(origPresets).length}`);
console.log(`- Brian Scraped Recipes: ${Object.keys(brianRecipes).length}`);
console.log(`========================================\n`);

// Update recipes_data.js
const newRecipesDataJs = `window.recipes = ${JSON.stringify(grandTotalRecipes, null, 2)};`;
fs.writeFileSync('recipes_data.js', newRecipesDataJs, 'utf8');
console.log("Updated recipes_data.js! Size: " + (newRecipesDataJs.length / 1024 / 1024).toFixed(2) + " MB");
