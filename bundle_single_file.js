const fs = require('fs');

console.log("Bundling self-contained code_artifact.html...");

const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

// Preset recipe
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

const allData = { ...presetRecipes, ...brianRecipes };

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Also fix the generateUpdatedHtml string to avoid </script> or <script> issues
html = html.replace(/<script type="text\/babel">/g, (match, offset) => {
  // Only keep the main script tag
  if (offset < 100) return match;
  return '<\' + \'script type="text/babel">';
});

// Remove <script src="recipes_data.js"></script>
html = html.replace('<script src="recipes_data.js"></script>', '');

// Inject standard <script>window.recipes = ...</script> BEFORE <script type="text/babel">
const babelIndex = html.indexOf('<script type="text/babel">');
const beforeBabel = html.substring(0, babelIndex);
const afterBabel = html.substring(babelIndex);

const dataScriptTag = `<script>\nwindow.recipes = ${JSON.stringify(allData)};\n</script>\n`;

const bundledHtml = beforeBabel + dataScriptTag + afterBabel;

fs.writeFileSync('code_artifact.html', bundledHtml, 'utf8');
console.log("Created self-contained code_artifact.html (size: " + (bundledHtml.length / 1024 / 1024).toFixed(2) + " MB)");
