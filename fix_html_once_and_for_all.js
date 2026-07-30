const fs = require('fs');

console.log("Fixing code_artifact.html once and for all...");

// 1. Ensure recipes_data.js is updated with all 460 recipes + preset recipes
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

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
fs.writeFileSync('recipes_data.js', `window.recipes = ${JSON.stringify(fullRecipes, null, 2)};`, 'utf8');
console.log("Updated recipes_data.js (size: " + (fs.statSync('recipes_data.js').size / 1024 / 1024).toFixed(2) + " MB)");

// 2. Read code_artifact.html
let html = fs.readFileSync('code_artifact.html', 'utf8');

// Fix any raw text script tag on line 43
html = html.replace(/<' \+ 'script type="text\/babel">/g, '<script type="text/babel">');
html = html.replace(/<\\' \+ 'script type="text\/babel">/g, '<script type="text/babel">');

// Remove any inline 2MB JSON window.recipes if present before <script type="text/babel">
const bodyIndex = html.indexOf('<body>');
const babelIndex = html.indexOf('<script type="text/babel">');

if (bodyIndex !== -1 && babelIndex !== -1) {
  const headAndBodyStart = html.substring(0, bodyIndex + '<body>'.length);
  const fromBabel = html.substring(babelIndex);

  // Construct clean body with <script src="recipes_data.js"></script>
  html = headAndBodyStart + '\n    <div id="root"></div>\n\n    <script src="recipes_data.js"></script>\n    ' + fromBabel;
}

// Fix inner string literal in generateUpdatedHtml template
html = html.replace(
  '<script type="text/babel">\n${updatedScript}',
  '\\x3Cscript type="text/babel">\n${updatedScript}'
);

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Fixed code_artifact.html (size: " + (html.length / 1024).toFixed(2) + " KB)");
