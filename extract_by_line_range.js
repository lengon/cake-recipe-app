const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const recoveredCustom = {};

// Regex to find full recipe objects
const recipeRegex = /"custom_[0-9]+"\s*:\s*(\{\s*"id"\s*:\s*"custom_[0-9]+"[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g;

let m;
while ((m = recipeRegex.exec(content)) !== null) {
  const jsonText = m[1];
  try {
    const obj = JSON.parse(jsonText);
    recoveredCustom[obj.id] = obj;
    console.log(`✅ RECOVERED: [${obj.id}] ${obj.name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + jsonText + ')');
      recoveredCustom[evaled.id] = evaled;
      console.log(`✅ RECOVERED (eval): [${evaled.id}] ${evaled.name}`);
    } catch(err){
      console.error("Failed parsing candidate:", e.message);
    }
  }
}

console.log(`Total recovered: ${Object.keys(recoveredCustom).length}`);
fs.writeFileSync('user_original_custom_recipes.json', JSON.stringify(recoveredCustom, null, 2), 'utf8');
