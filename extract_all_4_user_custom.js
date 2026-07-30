const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const userRecipes = {};

// Match all custom_... objects in the transcript
const regex = /"(custom_[0-9]+)"\s*:\s*(\{[\s\S]*?"name"\s*:\s*"([^"]+)"[\s\S]*?"instructions"\s*:\s*\[[\s\S]*?\]\s*\})/g;

let m;
while ((m = regex.exec(content)) !== null) {
  const id = m[1];
  const jsonStr = m[2];
  const name = m[3];
  try {
    const parsed = JSON.parse(jsonStr);
    userRecipes[id] = parsed;
    console.log(`✅ RECOVERED USER RECIPE: [${id}] ${name}`);
  } catch(e) {
    try {
      const evaled = eval('(' + jsonStr + ')');
      userRecipes[id] = evaled;
      console.log(`✅ RECOVERED USER RECIPE (eval): [${id}] ${name}`);
    } catch(err){}
  }
}

console.log(`\n========================================`);
console.log(`TOTAL USER CUSTOM RECIPES RECOVERED: ${Object.keys(userRecipes).length}`);
console.log(`Names:`, Object.values(userRecipes).map(r => r.name));
console.log(`========================================\n`);

fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(userRecipes, null, 2), 'utf8');
