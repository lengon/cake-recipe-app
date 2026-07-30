const fs = require('fs');

const origHtml = fs.readFileSync('pure_original_code_artifact.html', 'utf8');

// Find all recipe objects in origHtml
const recipeMatches = origHtml.matchAll(/"([^"]+)"\s*:\s*(\{\s*"id"\s*:\s*"[^"]+"[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g);

const allExtractedRecipes = {};
for (const m of recipeMatches) {
  const key = m[1];
  const jsonStr = m[2];
  try {
    const obj = JSON.parse(jsonStr);
    allExtractedRecipes[key] = obj;
    console.log(`✅ Parsed [${key}]: ${obj.name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + jsonStr + ')');
      allExtractedRecipes[key] = evaled;
      console.log(`✅ Evaled [${key}]: ${evaled.name}`);
    } catch(err) {
      console.error(`Failed ${key}:`, err.message);
    }
  }
}

console.log("\nTOTAL EXTRACTED ORIGINAL RECIPES:", Object.keys(allExtractedRecipes).length);
fs.writeFileSync('true_original_all_recipes.json', JSON.stringify(allExtractedRecipes, null, 2), 'utf8');
