const fs = require('fs');
const { execSync } = require('child_process');

console.log("Parsing brianrecipe.xlsx...");
const raw = execSync('npx xlsx-cli brianrecipe.xlsx', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
const lines = raw.split('\n');

const recipesMap = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // CSV line parsing
  const firstComma = line.indexOf(',');
  if (firstComma === -1) continue;
  const secondComma = line.indexOf(',', firstComma + 1);
  if (secondComma === -1) continue;
  const thirdComma = line.indexOf(',', secondComma + 1);
  if (thirdComma === -1) continue;

  const url = line.substring(secondComma + 1, thirdComma).trim();
  const text = line.substring(thirdComma + 1).trim();

  if (!url || url.length < 10) continue;

  if (!recipesMap[url]) {
    recipesMap[url] = [];
  }
  recipesMap[url].push(text);
}

const urls = Object.keys(recipesMap);
console.log("Total extracted recipes:", urls.length);

console.log("\n--- Sample Recipe 1 ---");
console.log("URL:", urls[0]);
console.log("Lines count:", recipesMap[urls[0]].length);
recipesMap[urls[0]].slice(0, 15).forEach((t, i) => console.log(`${i+1}: ${t}`));

console.log("\n--- Sample Recipe 2 ---");
console.log("URL:", urls[1]);
console.log("Lines count:", recipesMap[urls[1]].length);
recipesMap[urls[1]].slice(0, 15).forEach((t, i) => console.log(`${i+1}: ${t}`));
