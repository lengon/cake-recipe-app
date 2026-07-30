const fs = require('fs');

const origHtml = fs.readFileSync('pure_original_code_artifact.html', 'utf8');

// Find all key: { id: ..., name: ... } blocks
const keyRegex = /(almondCitrus|coconutCake|coconutOrangeSpice|almondLemonOliveOil|orangeBlossomAlmond|sesameChiffon|appleCustard|appleYogurt|appleSpiceLoaf|mandarinOliveOil|lemonAlmond|almondCardamom|orangeAlmondButter|brownButterCinnamonPraline|honeyOrangeCornmealLoaf|chocolateCreamCheesePound|custom_[0-9]+)\s*:\s*\{/g;

const recipes = {};

let m;
while ((m = keyRegex.exec(origHtml)) !== null) {
  const key = m[1];
  const startIdx = m.index + m[0].length - 1;
  let openBraces = 0;
  let endIdx = -1;
  for (let i = startIdx; i < origHtml.length; i++) {
    if (origHtml[i] === '{') openBraces++;
    if (origHtml[i] === '}') {
      openBraces--;
      if (openBraces === 0) {
        endIdx = i;
        break;
      }
    }
  }
  if (endIdx !== -1) {
    const blockText = origHtml.substring(startIdx, endIdx + 1);
    try {
      const parsed = eval('(' + blockText + ')');
      recipes[key] = parsed;
      console.log(`✅ Extracted [${key}]: ${parsed.name}`);
    } catch(e) {
      console.error(`Failed ${key}:`, e.message);
    }
  }
}

console.log("\nTOTAL RECOVERED ORIGINAL RECIPES:", Object.keys(recipes).length);
fs.writeFileSync('all_recovered_original_recipes.json', JSON.stringify(recipes, null, 2), 'utf8');
