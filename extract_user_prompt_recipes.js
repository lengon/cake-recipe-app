const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    if (entry.step_index === 197) {
      console.log("User prompt in Step 197 found!");
      const txt = entry.content;
      const startIdx = txt.indexOf('const savedRecipes = {');
      if (startIdx !== -1) {
        const savedStr = txt.substring(startIdx + 'const savedRecipes ='.length).trim();
        // find matching brace
        let openBraces = 0;
        let endIdx = -1;
        for (let i = 0; i < savedStr.length; i++) {
          if (savedStr[i] === '{') openBraces++;
          if (savedStr[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
              endIdx = i;
              break;
            }
          }
        }
        if (endIdx !== -1) {
          const jsonObjStr = savedStr.substring(0, endIdx + 1);
          console.log("Successfully extracted savedRecipes JSON string!");
          const parsedSaved = JSON.parse(jsonObjStr);
          console.log("Custom Recipe IDs:", Object.keys(parsedSaved));
          console.log("Custom Recipe Names:", Object.values(parsedSaved).map(r => r.name));
          fs.writeFileSync('extracted_user_custom_recipes.json', JSON.stringify(parsedSaved, null, 2), 'utf8');
        }
      }
    }
  } catch(e){}
}
