const fs = require('fs');
const XLSX = require('xlsx');

console.log("Loading brianrecipe.xlsx...");
const wb = XLSX.readFile('brianrecipe.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log(`Total excel rows loaded: ${rows.length}`);

// Group content by recipe URL
const recipesMap = {};

for (const r of rows) {
  let url = (r['Pages'] || r['web-scraper-start-url'] || '').trim();
  const content = (r['content'] || '').trim();
  
  if (!url || !content) continue;

  if (!recipesMap[url]) {
    recipesMap[url] = [];
  }
  recipesMap[url].push(content);
}

console.log(`Unique Recipe URLs: ${Object.keys(recipesMap).length}`);

// Helper to parse ingredients line by line
function parseIngredientsText(rawText) {
  const ingredients = [];
  const lines = rawText.split('\n');

  for (let l of lines) {
    l = l.trim().replace(/^[-*•\s]+/, '');
    if (!l || /^\[.*\]/.test(l)) continue;

    // Split name and value by : or ：
    const colonIdx = l.search(/[:：]/);
    let name = l;
    let valStr = '';

    if (colonIdx !== -1) {
      name = l.substring(0, colonIdx).trim();
      valStr = l.substring(colonIdx + 1).trim();
    }

    // Auto categorize
    let category = 'dry';
    if (/奶油|蛋|水|牛奶|鮮奶|油|酒|汁|優格|醋|蜜|乳酪|起司/.test(name)) {
      category = 'wet';
    } else if (/皮屑|香草|精|粉（調味）|肉桂|荳蔻|鹽|醬|酵母|抹茶粉|可可粉/.test(name)) {
      category = 'flavor';
    } else if (/裝飾|片|粒|糖粉|霜|椰子絲/.test(name)) {
      category = 'decor';
    } else if (/淋醬|糖漿|膠/.test(name)) {
      category = 'glaze';
    }

    let baseValue = 1;
    let unit = '克';
    let note = '';

    const numMatch = valStr.match(/^([0-9\/\.\~]+)\s*([^\d\s\(\)]+)?(?:\s*\((.*)\))?/);
    if (numMatch) {
      let numPart = numMatch[1];
      if (numPart.includes('/')) {
        const fr = numPart.split('/');
        baseValue = parseFloat(fr[0]) / (parseFloat(fr[1]) || 1);
      } else {
        baseValue = parseFloat(numPart) || 1;
      }
      if (numMatch[2]) unit = numMatch[2].trim();
      if (numMatch[3]) note = numMatch[3].trim();
    } else if (valStr) {
      unit = valStr;
    }

    ingredients.push({
      category,
      name,
      baseValue: isNaN(baseValue) ? 1 : baseValue,
      unit: unit || '克',
      displayUnit: unit || '克',
      note
    });
  }

  return ingredients;
}

// Convert grouped data to recipe objects
const finalRecipes = {};
let recipeCounter = 0;

for (const [url, contents] of Object.entries(recipesMap)) {
  // Title is usually the first content item (or decoded slug)
  let title = contents[0].split('\n')[0].trim();

  // Decode URL slug for backup title or ID
  let slug = '';
  try {
    const slugMatch = url.match(/\/([^\/]+)\/?$/);
    if (slugMatch && slugMatch[1]) {
      slug = decodeURIComponent(slugMatch[1]).replace(/[-_]/g, ' ');
    }
  } catch(e){}

  if (!title || title.startsWith('[') || title.length > 50) {
    title = slug || `不萊嗯食譜 ${recipeCounter + 1}`;
  }

  const recipeId = `brian_${recipeCounter++}`;
  
  let description = '';
  let ingredients = [];
  let instructions = [];
  let tips = [];

  let currentSection = 'intro'; // 'intro', 'ingredients', 'instructions', 'tips'
  let stepIndex = 1;

  for (const block of contents) {
    const lines = block.split('\n');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (/^\[\s*材料\s*\]/i.test(line)) {
        currentSection = 'ingredients';
        continue;
      }
      if (/^\[\s*(做法|步驟)\s*\]/i.test(line)) {
        currentSection = 'instructions';
        continue;
      }
      if (/^TIPS[：:]|^\[\s*備註\s*\]|^\[\s*貼士\s*\]|^\*\s*/i.test(line)) {
        currentSection = 'tips';
        const cleanTip = line.replace(/^(TIPS[：:]|\[\s*備註\s*\]|\[\s*貼士\s*\]|\*\s*)/i, '').trim();
        if (cleanTip) tips.push(cleanTip);
        continue;
      }

      if (currentSection === 'intro') {
        if (line !== title && !line.startsWith('http')) {
          description += (description ? '\n' : '') + line;
        }
      } else if (currentSection === 'ingredients') {
        const parsedIngs = parseIngredientsText(line);
        ingredients.push(...parsedIngs);
      } else if (currentSection === 'instructions') {
        // Clean leading step numbers like "1. ", "一、", "(1)"
        const cleanStep = line.replace(/^([0-9]+[\.、\)]|[\(（][0-9]+[\)）])\s*/, '').trim();
        instructions.push({ step: stepIndex++, text: cleanStep });
      } else if (currentSection === 'tips') {
        tips.push(line);
      }
    }
  }

  // Tags auto extraction
  const tags = ["不萊嗯食譜"];
  const fullText = (title + " " + description).toLowerCase();
  if (/司康|scone/.test(fullText)) tags.push("司康");
  if (/派|塔|pie|tart/.test(fullText)) tags.push("派塔");
  if (/餅乾|酥餅|cookie|biscotti/.test(fullText)) tags.push("餅乾");
  if (/蛋糕|戚風|磅蛋糕|cake|chiffon/.test(fullText)) tags.push("蛋糕");
  if (/麵包|餐包|吐司|bread/.test(fullText)) tags.push("麵包");
  if (/無麩質|gluten-free/.test(fullText)) tags.push("無麩質");
  if (/檸檬|lemon/.test(fullText)) tags.push("檸檬風味");
  if (/巧克力|可可|chocolate/.test(fullText)) tags.push("巧克力");

  // Default pan guessing
  let shape = 'round';
  let size = 8;
  if (/磅蛋糕|loaf/.test(fullText)) {
    shape = 'loaf';
    size = 9;
  } else if (/方模|square/.test(fullText)) {
    shape = 'square';
    size = 8;
  }

  finalRecipes[recipeId] = {
    id: recipeId,
    name: title,
    englishName: slug || title,
    description: description.substring(0, 400),
    tags,
    sourceUrl: url,
    basePan: { shape, size, unit: 'inch' },
    tips: tips.length ? tips : ["跟隨食譜精準量秤，注意預熱烤箱。"],
    ingredients: ingredients.length ? ingredients : [
      { category: "dry", name: "中筋麵粉", baseValue: 200, unit: "克", displayUnit: "克" }
    ],
    instructions: instructions.length ? instructions : [
      { step: 1, text: "準備好所有食材，預熱烤箱至 175°C (350°F)。" }
    ]
  };
}

console.log(`Parsed ${Object.keys(finalRecipes).length} recipes!`);

// Save to recipes_brian.json
fs.writeFileSync('recipes_brian.json', JSON.stringify(finalRecipes, null, 2), 'utf8');
console.log('Saved to recipes_brian.json!');
