const fs = require('fs');

console.log("Reconstructing all 4 user custom recipes...");

// 1. Load parsed ones from debug text
const txt = fs.readFileSync('savedRecipesJs_debug.txt', 'utf8');

const userRecipes = {};

// Parse custom_1783780600556, custom_1784861569970, custom_1784862334940
const ids = ["custom_1783780600556", "custom_1784861569970", "custom_1784862334940"];

for (const id of ids) {
  const idx = txt.indexOf(`"${id}"`);
  if (idx !== -1) {
    const colonIdx = txt.indexOf(':', idx);
    const startBrace = txt.indexOf('{', colonIdx);
    let openBraces = 0;
    let endBrace = -1;
    for (let i = startBrace; i < txt.length; i++) {
      if (txt[i] === '{') openBraces++;
      if (txt[i] === '}') {
        openBraces--;
        if (openBraces === 0) {
          endBrace = i;
          break;
        }
      }
    }
    if (endBrace !== -1) {
      const jsonBlock = txt.substring(startBrace, endBrace + 1);
      try {
        const parsed = JSON.parse(jsonBlock);
        userRecipes[id] = parsed;
        console.log(`✅ Recovered [${id}]: ${parsed.name}`);
      } catch(e) {
        try {
          const evaled = eval('(' + jsonBlock + ')');
          userRecipes[id] = evaled;
          console.log(`✅ Recovered (eval) [${id}]: ${evaled.name}`);
        } catch(err){}
      }
    }
  }
}

// 2. Add custom_1783782113042 (波斯風情豆蔻杏仁蛋糕) from step 197 prompt
userRecipes["custom_1783782113042"] = {
  id: "custom_1783782113042",
  isCustom: true,
  name: "波斯風情豆蔻杏仁蛋糕",
  englishName: "Persian Almond Cardamom Cake",
  description: "豆蔻的溫暖辛香與玫瑰水的優雅花香，在杏仁粉潤澤的質地中達到完美平衡。",
  basePan: { shape: "round", size: 9, unit: "inch" },
  tips: [
    "保存方式：室溫密封可保存 3 天，冷藏可維持 1 週。",
    "食材替換方案：玫瑰水可與橙花水以 1:1 比例互換；若不習慣花香風味，亦可單純使用香草精。"
  ],
  ingredients: [
    { category: "dry", name: "杏仁粉", baseValue: 200, unit: "克" },
    { category: "dry", name: "細砂糖", baseValue: 100, unit: "克" },
    { category: "wet", name: "全脂希臘優格", baseValue: 120, unit: "毫升" },
    { category: "wet", name: "葵花油或融化奶油", baseValue: 60, unit: "毫升" },
    { category: "wet", name: "大雞蛋", baseValue: 4, unit: "顆" },
    { category: "dry", name: "烘焙粉", baseValue: 5, unit: "克" },
    { category: "dry", name: "鹽", baseValue: 1.5, unit: "克" },
    { category: "dry", name: "豆蔻粉", baseValue: 2.5, unit: "克" },
    { category: "flavor", name: "香草精", baseValue: 5, unit: "毫升" },
    { category: "flavor", name: "玫瑰水", baseValue: 15, unit: "毫升" },
    { category: "glaze", name: "糖粉 (淋醬)", baseValue: 60, unit: "克" },
    { category: "glaze", name: "水 (淋醬)", baseValue: 15, unit: "毫升" },
    { category: "glaze", name: "香草精 (淋醬)", baseValue: 2.5, unit: "毫升" }
  ],
  instructions: [
    { step: 1, text: "環境預熱：烤箱預熱至 175°C，準備 9 吋圓模並鋪上烤模紙。" },
    { step: 2, text: "乾粉混合：將 {杏仁粉}、{烘焙粉}、{鹽} 與 {豆蔻粉} 均勻混合。" },
    { step: 3, text: "關鍵打發：將 {大雞蛋} 與 {細砂糖} 高速打發，直到麵糊顏色明顯泛白且質地輕盈如緞帶。" },
    { step: 4, text: "濕料匯集：輕輕拌入 {葵花油或融化奶油}、{香草精}、{全脂希臘優格} 與 {玫瑰水}。" },
    { step: 5, text: "輕柔折疊：分次將混合好的乾粉拌入，使用刮刀避免過度攪拌導致消泡。" },
    { step: 6, text: "入爐：倒入烤模，烘烤 25-30 分鐘，直至表面呈現琥珀金黃。" },
    { step: 7, text: "出爐：蛋糕在模中冷卻 10 分鐘後脫模。" },
    { step: 8, text: "淋醬點綴：混勻 {糖粉 (淋醬)}、{水 (淋醬)} 與 {香草精 (淋醬)}，在蛋糕冷卻後淋灑其上。" },
    { step: 9, text: "熟成風味：放置數小時後，{玫瑰水} 與 {豆蔻粉} 的風味會更加融合且優雅。" }
  ]
};

console.log("\n=========================================");
console.log(`TOTAL USER CUSTOM RECIPES FULLY RECOVERED: ${Object.keys(userRecipes).length}`);
for (const r of Object.values(userRecipes)) {
  console.log(` - [${r.id}]: ${r.name}`);
}
console.log("=========================================\n");

fs.writeFileSync('all_user_custom_recipes.json', JSON.stringify(userRecipes, null, 2), 'utf8');
