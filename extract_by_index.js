const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const targetNames = [
  "濃郁巧克力杏仁粉蛋糕",
  "波斯風情豆蔻杏仁蛋糕",
  "檸香瑪斯卡波乳酪蛋糕",
  "經典半熟起士塔"
];

const recoveredCustom = {};

for (const name of targetNames) {
  let idx = content.indexOf(`"name": "${name}"`);
  if (idx === -1) idx = content.indexOf(`"name":"${name}"`);
  if (idx === -1) idx = content.indexOf(name);

  if (idx !== -1) {
    console.log(`Found "${name}" at index ${idx}`);
    // Search backward for the start of recipe object `{ "id":` or `{ "isCustom":`
    let startIdx = content.lastIndexOf('{', idx);
    // Find matching bracket
    let openBraces = 0;
    let endIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '{') openBraces++;
      if (content[i] === '}') {
        openBraces--;
        if (openBraces === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const candidateStr = content.substring(startIdx, endIdx + 1);
      try {
        const obj = JSON.parse(candidateStr);
        if (obj.name && obj.ingredients) {
          const id = obj.id || `custom_${Date.now()}`;
          recoveredCustom[id] = obj;
          console.log(`✅ RECOVERED RECIPE: [${id}] ${obj.name}`);
        }
      } catch(e) {
        // try eval if unescaped newlines exist
        try {
          const evaled = eval('(' + candidateStr + ')');
          if (evaled.name && evaled.ingredients) {
            const id = evaled.id || `custom_${Date.now()}`;
            recoveredCustom[id] = evaled;
            console.log(`✅ RECOVERED (eval): [${id}] ${evaled.name}`);
          }
        } catch(err){}
      }
    }
  }
}

console.log(`\nTotal Recovered User Custom Recipes: ${Object.keys(recoveredCustom).length}`);
fs.writeFileSync('user_original_custom_recipes.json', JSON.stringify(recoveredCustom, null, 2), 'utf8');
