const fs = require('fs');
const { execSync } = require('child_process');

console.log("Reading brianrecipe.xlsx...");
const raw = execSync('npx xlsx-cli brianrecipe.xlsx', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
const lines = raw.split('\n');

const rawRecipes = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const firstComma = line.indexOf(',');
  if (firstComma === -1) continue;
  const secondComma = line.indexOf(',', firstComma + 1);
  if (secondComma === -1) continue;
  const thirdComma = line.indexOf(',', secondComma + 1);
  if (thirdComma === -1) continue;

  const url = line.substring(secondComma + 1, thirdComma).trim();
  let text = line.substring(thirdComma + 1).trim();

  // Strip leading/trailing quotes if double quoted
  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.substring(1, text.length - 1).trim();
  }

  if (!url || url.length < 10) continue;

  if (!rawRecipes[url]) {
    rawRecipes[url] = [];
  }
  rawRecipes[url].push(text);
}

console.log(`Total URLs found: ${Object.keys(rawRecipes).length}`);

// Helper to sanitize ingredient lines
function parseIngredientLine(line) {
  // e.g. "高筋 麵粉 (蛋白質含量 11.5~12.5% )：430克"
  // e.g. "細白砂糖：50克"
  // e.g. "無鹽奶油：230g"
  // e.g. "蛋黃：1顆"
  const clean = line.replace(/^[•\-\*\s]+/, '').trim();
  const parts = clean.split(/[:：]/);
  
  let name = parts[0] ? parts[0].trim() : clean;
  let valStr = parts[1] ? parts[1].trim() : '';

  // Categorize ingredient
  let category = 'dry';
  if (/奶油|蛋|水|牛奶|鮮奶|油|酒|汁|優格|醋|蜜/.test(name)) {
    category = 'wet';
  } else if (/皮屑|香草|精|粉（調味）|肉桂|荳蔻|鹽|醬/.test(name)) {
    category = 'flavor';
  } else if (/裝飾|片|粒|糖粉|霜/.test(name)) {
    category = 'decor';
  } else if (/淋醬|糖漿/.test(name)) {
    category = 'glaze';
  }

  // Parse numeric baseValue and unit
  let baseValue = 1;
  let unit = '克';
  let note = '';

  const numMatch = valStr.match(/^([0-9\/\.\~]+)\s*([^\d\s\(\)]+)?(?:\s*\((.*)\))?/);
  if (numMatch) {
    let numPart = numMatch[1];
    if (numPart.includes('/')) {
      const fr = numPart.split('/');
      baseValue = parseFloat(fr[0]) / parseFloat(fr[1]);
    } else {
      baseValue = parseFloat(numPart) || 1;
    }
    if (numMatch[2]) unit = numMatch[2].trim();
    if (numMatch[3]) note = numMatch[3].trim();
  } else if (valStr) {
    unit = valStr;
  }

  return {
    category,
    name,
    baseValue,
    unit: unit || '適量',
    displayUnit: unit || '適量',
    note
  };
}

// Convert each raw recipe into code_artifact recipe format
const parsedRecipes = {};
let count = 0;

for (const [url, linesList] of Object.entries(rawRecipes)) {
  if (linesList.length === 0) continue;

  const title = linesList[0].trim();
  if (!title || title.length < 2) continue;

  // Extract slug / ID from URL
  const urlMatch = url.match(/\/([^\/]+)\/?$/);
  let id = `recipe_${count++}`;
  if (urlMatch && urlMatch[1]) {
    try {
      id = decodeURIComponent(urlMatch[1]).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 30);
    } catch(e) {}
  }

  let description = '';
  const tips = [];
  const ingredients = [];
  const instructions = [];

  let section = 'intro'; // 'intro', 'ingredients', 'instructions', 'tips'
  let stepCounter = 1;

  for (let i = 1; i < linesList.length; i++) {
    const text = linesList[i].trim();
    if (!text) continue;

    if (/^\[\s*材料\s*\]/i.test(text)) {
      section = 'ingredients';
      const rest = text.replace(/^\[\s*材料\s*\][^\n]*/i, '').trim();
      if (rest) {
        rest.split('\n').forEach(l => {
          if (l.trim()) ingredients.push(parseIngredientLine(l.trim()));
        });
      }
      continue;
    }

    if (/^\[\s*做法\s*\]/i.test(text) || /^\[\s*步驟\s*\]/i.test(text)) {
      section = 'instructions';
      const rest = text.replace(/^\[\s*(做法|步驟)\s*\][^\n]*/i, '').trim();
      if (rest) {
        instructions.push({ step: stepCounter++, text: rest });
      }
      continue;
    }

    if (/^TIPS[：:]|^\[\s*備註\s*\]|^\[\s*貼士\s*\]/i.test(text)) {
      section = 'tips';
      const rest = text.replace(/^(TIPS[：:]|\[\s*備註\s*\]|\[\s*貼士\s*\])/i, '').trim();
      if (rest) tips.push(rest);
      continue;
    }

    if (section === 'intro') {
      if (!description) description = text;
      else description += ' ' + text;
    } else if (section === 'ingredients') {
      text.split('\n').forEach(l => {
        if (l.trim()) ingredients.push(parseIngredientLine(l.trim()));
      });
    } else if (section === 'instructions') {
      instructions.push({ step: stepCounter++, text: text });
    } else if (section === 'tips') {
      tips.push(text);
    }
  }

  // Tag recognition
  const tags = [];
  if (/司康/i.test(title)) tags.push("司康");
  if (/派|塔/i.test(title)) tags.push("派塔");
  if (/餅乾|酥餅/i.test(title)) tags.push("餅乾");
  if (/蛋糕|戚風|磅蛋糕/i.test(title)) tags.push("蛋糕");
  if (/麵包|餐包/i.test(title)) tags.push("麵包");
  if (/無麩質/i.test(title) || /無麩質/i.test(description)) tags.push("無麩質");

  parsedRecipes[id] = {
    id,
    name: title,
    englishName: id.replace(/_/g, ' '),
    description: description.substring(0, 300),
    tags: tags.length ? tags : ["經典烘焙"],
    sourceUrl: url,
    basePan: { shape: "round", size: 8, unit: "inch" },
    tips: tips.length ? tips : ["跟隨食譜精準量秤，注意預熱烤箱。"],
    ingredients: ingredients.length ? ingredients : [
      { category: "dry", name: "低筋麵粉", baseValue: 200, unit: "克", displayUnit: "克" }
    ],
    instructions: instructions.length ? instructions : [
      { step: 1, text: "預熱烤箱至 175°C。" }
    ]
  };
}

const parsedCount = Object.keys(parsedRecipes).length;
console.log(`Successfully parsed ${parsedCount} recipes!`);
console.log("Sample Parsed Recipe Structure:", JSON.stringify(Object.values(parsedRecipes)[0], null, 2));

fs.writeFileSync('parsed_brian_recipes.json', JSON.stringify(parsedRecipes, null, 2), 'utf8');
