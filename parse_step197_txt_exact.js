const fs = require('fs');

const txt = fs.readFileSync('step_197_prompt.txt', 'utf8');
const startIdx = txt.indexOf('const savedRecipes =');

if (startIdx !== -1) {
  let jsonCode = txt.substring(startIdx + 'const savedRecipes ='.length).trim();
  
  // Find each custom recipe block by matching "custom_17..."
  const customObj = {};
  const customMatches = jsonCode.matchAll(/"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g);
  
  for (const m of customMatches) {
    const id = m[1];
    const block = m[2];
    try {
      const parsed = JSON.parse(block);
      customObj[id] = parsed;
      console.log(`✅ Parsed [${id}]: ${parsed.name}`);
    } catch(e) {
      try {
        const evaled = eval('(' + block + ')');
        customObj[id] = evaled;
        console.log(`✅ Evaled [${id}]: ${evaled.name}`);
      } catch(err) {
        console.error(`Failed ${id}:`, err.message);
      }
    }
  }
  
  console.log("Total extracted custom recipes:", Object.keys(customObj).length);
  fs.writeFileSync('true_user_custom_recipes.json', JSON.stringify(customObj, null, 2), 'utf8');
}
