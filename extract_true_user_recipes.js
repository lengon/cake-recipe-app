const fs = require('fs');

const origHtml = fs.readFileSync('pure_original_code_artifact.html', 'utf8');

// Locate const recipes = { ... } and const savedRecipes = { ... }
const recipesStart = origHtml.indexOf('const recipes = {');
const savedRecipesStart = origHtml.indexOf('const savedRecipes = {');
const emptyIngStart = origHtml.indexOf('const emptyIngredient =');

console.log("recipesStart:", recipesStart);
console.log("savedRecipesStart:", savedRecipesStart);
console.log("emptyIngStart:", emptyIngStart);

const recipesJsText = origHtml.substring(recipesStart + 'const recipes ='.length, savedRecipesStart).trim().replace(/;$/, '');
const savedRecipesJsText = origHtml.substring(savedRecipesStart + 'const savedRecipes ='.length, emptyIngStart).trim().replace(/;\s*\/\/ \[\/SAVED_RECIPES_PLACEHOLDER\]/, '').replace(/;$/, '');

let presetObj = {};
let savedCustomObj = {};

try {
  presetObj = eval('(' + recipesJsText + ')');
  console.log("✅ PRESET RECIPES COUNT:", Object.keys(presetObj).length);
  console.log("Preset Recipes:", Object.values(presetObj).map(r => r.name));
} catch(e) {
  console.error("Failed parsing presetObj:", e.message);
}

try {
  savedCustomObj = eval('(' + savedRecipesJsText + ')');
  console.log("\n✅ USER CUSTOM SAVED RECIPES COUNT:", Object.keys(savedCustomObj).length);
  console.log("User Custom Saved Recipes:", Object.values(savedCustomObj).map(r => r.name));
} catch(e) {
  console.error("Failed parsing savedCustomObj:", e.message);
}

const combinedOriginal = { ...presetObj, ...savedCustomObj };
console.log("\nTotal True Original Recipes:", Object.keys(combinedOriginal).length);

fs.writeFileSync('true_original_recipes.json', JSON.stringify(combinedOriginal, null, 2), 'utf8');
fs.writeFileSync('user_custom_recipes.json', JSON.stringify(savedCustomObj, null, 2), 'utf8');
