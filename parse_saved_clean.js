const fs = require('fs');

let jsText = fs.readFileSync('savedRecipesJs_debug.txt', 'utf8');

// Strip const savedRecipes =
jsText = jsText.replace(/^const savedRecipes\s*=\s*/, '').trim();

// Strip trailing comments / placeholders
const placeholderIdx = jsText.indexOf('// [/SAVED_RECIPES_PLACEHOLDER]');
if (placeholderIdx !== -1) {
  jsText = jsText.substring(0, placeholderIdx).trim();
}

jsText = jsText.replace(/;\s*$/, '').trim();

try {
  const parsedObj = eval('(' + jsText + ')');
  console.log("🎉 SUCCESS! ALL USER CUSTOM RECIPES RECOVERED!");
  console.log("Total user custom recipes:", Object.keys(parsedObj).length);
  console.log("Names:", Object.values(parsedObj).map(r => `${r.id}: ${r.name}`));

  fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(parsedObj, null, 2), 'utf8');
} catch(e) {
  console.error("Eval error:", e.message);
}
