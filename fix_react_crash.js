const fs = require('fs');

console.log("Fixing React render crashes and script escaping in code_artifact.html...");

// 1. Build merged recipes (Presets + 459 Brian Recipes)
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

// Preset recipes from original code
const presetRecipes = {
  almondCitrus: {
      id: "almondCitrus",
      name: "杏仁蜂蜜柑橘夢幻蛋糕",
      englishName: "Almond Honey Citrus Dream Cake",
      description: "散發迷人杏仁與橙檸清香的蓬鬆蛋糕，搭配香甜的蜂蜜柑橘淋醬，下午茶的最佳主角。",
      tags: ["蛋糕", "柑橘"],
      basePan: { shape: "round", size: 9, unit: "inch" },
      tips: [
          "增加口感：如果想要更多層次，可以在麵糊中加入適量的杏仁碎粒。",
          "完美搭配：這款蛋糕與一杯熱茶或咖啡是絕配。",
          "保存方式：吃不完的蛋糕可放入密封容器中，在室溫下最多可保存 3 天。"
      ],
      ingredients: [
          { category: "dry", name: "中筋麵粉", baseValue: 190, unit: "克", displayUnit: "克" },
          { category: "dry", name: "細砂糖", baseValue: 200, unit: "克", displayUnit: "克" },
          { category: "wet", name: "無鹽奶油 (軟化)", baseValue: 115, unit: "克", displayUnit: "克" },
          { category: "wet", name: "雞蛋 (大號)", baseValue: 3, unit: "顆", displayUnit: "顆", note: "約 150g 蛋液" },
          { category: "wet", name: "白脫牛奶 (Buttermilk)", baseValue: 240, unit: "毫升", displayUnit: "毫升", note: "可用 230ml 鮮奶加 10ml 檸檬汁代替" }
      ],
      instructions: [
          { step: 1, text: "【預熱】將烤箱預熱至 175°C (350°F)。在一個蛋糕模塗上薄薄一層奶油並撒上麵粉，或鋪上烘焙紙防沾。" },
          { step: 2, text: "【乾料】在一個中型碗中，將麵粉 {中筋麵粉} 混勻，放置一旁。" }
      ]
  }
};

const fullRecipes = { ...presetRecipes, ...brianRecipes };

// Write recipes_data.js
fs.writeFileSync('recipes_data.js', `window.recipes = ${JSON.stringify(fullRecipes, null, 2)};`, 'utf8');
console.log("Updated recipes_data.js with presets + Brian recipes!");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Fix 1: Make activeRecipeId initial state safe
html = html.replace(
  'const [activeRecipeId, setActiveRecipeId] = useState("almondCitrus");',
  'const [activeRecipeId, setActiveRecipeId] = useState(() => Object.keys(allRecipes)[0] || "almondCitrus");'
);

// Fix 2: Add safety guard for currentRecipe
html = html.replace(
  'const currentRecipe = allRecipes[activeRecipeId];',
  'const currentRecipe = allRecipes[activeRecipeId] || Object.values(allRecipes)[0] || {};'
);

// Fix 3: Escape script tags in template literal strings
html = html.replace(
  '<script type="text/babel">',
  '<\' + \'script type="text/babel">'
);

// Restore actual script type=text/babel at line 37
html = html.replace(
  '<\' + \'script type="text/babel">\n\n        const { useState, useEffect } = React;',
  '<script type="text/babel">\n\n        const { useState, useEffect } = React;'
);

// Save updated code_artifact.html
fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Successfully patched code_artifact.html!");
