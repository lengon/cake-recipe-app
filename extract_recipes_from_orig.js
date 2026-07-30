const fs = require('fs');

const origHtml = fs.readFileSync('my_true_original_code_artifact.html', 'utf8');

// Find recipes = { ... } and savedRecipes = { ... }
const recipesIdx = origHtml.indexOf('const recipes = {');
const savedRecipesIdx = origHtml.indexOf('const savedRecipes = {');
const emptyIngIdx = origHtml.indexOf('const emptyIngredient =');

console.log("recipesIdx:", recipesIdx);
console.log("savedRecipesIdx:", savedRecipesIdx);
console.log("emptyIngIdx:", emptyIngIdx);

const recipesBlock = origHtml.substring(recipesIdx, savedRecipesIdx);
const savedRecipesBlock = origHtml.substring(savedRecipesIdx, emptyIngIdx);

// Parse preset recipes
try {
  const recipesJsStr = recipesBlock.replace('const recipes =', '').trim().replace(/;$/, '');
  const evalRecipes = eval('(' + recipesJsStr + ')');
  console.log("Preset Recipes Count:", Object.keys(evalRecipes).length);
  console.log("Preset Recipe Names:", Object.values(evalRecipes).map(r => r.name));
  
  // Save preset recipes
  fs.writeFileSync('preset_recipes_original.json', JSON.stringify(evalRecipes, null, 2), 'utf8');
} catch(e) {
  console.error("Failed to parse recipesBlock:", e.message);
}

// Parse saved custom recipes
try {
  const savedJsStr = savedRecipesBlock.replace('const savedRecipes =', '').trim().replace(/;\s*\/\/ \[\/SAVED_RECIPES_PLACEHOLDER\]/, '').replace(/;$/, '');
  const evalSaved = eval('(' + savedJsStr + ')');
  console.log("User Custom Saved Recipes Count:", Object.keys(evalSaved).length);
  console.log("User Custom Recipe Names:", Object.values(evalSaved).map(r => r.name));
  
  // Save custom recipes
  fs.writeFileSync('user_custom_recipes_original.json', JSON.stringify(evalSaved, null, 2), 'utf8');
} catch(e) {
  console.error("Failed to parse savedRecipesBlock:", e.message);
}
