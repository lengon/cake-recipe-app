const fs = require('fs');

console.log("Building 100% complete recipe dataset (User Custom + Presets + Brian Scraped)...");

// 1. All 16 Original Presets
const presets = JSON.parse(fs.readFileSync('all_recovered_original_recipes.json', 'utf8'));

// 2. All 4 User Custom Recipes
const userCustom = {
  custom_1783780600556: {
    id: "custom_1783780600556",
    isCustom: true,
    name: "濃郁巧克力杏仁粉蛋糕",
    englishName: "Decadent Almond Flour Chocolate Cake",
    description: "這款蛋糕選用高品質可可粉，其深邃的風味在濕潤的杏仁粉基底中更顯華麗。",
    basePan: { shape: "round", size: 8, unit: "inch" },
    tips: [
      "保存方式： 密封冷藏可存放 1 週，食用前建議稍作回溫以恢復柔潤質地。",
      "純素版本方案： 可使用「亞麻仁籽蛋」或「蘋果泥」替代雞蛋，並使用高品質無糖可可粉以確保風味深度。"
    ],
    ingredients: [
      { category: "dry", name: "杏仁粉", baseValue: 200, unit: "g" },
      { category: "dry", name: "無糖可可粉", baseValue: 50, unit: "g" },
      { category: "dry", name: "砂糖或椰子糖", baseValue: 150, unit: "g" },
      { category: "dry", name: "烘焙粉", baseValue: 5, unit: "g" },
      { category: "dry", name: "鹽", baseValue: 1.5, unit: "g" },
      { category: "wet", name: "大雞蛋", baseValue: 3, unit: "顆" },
      { category: "wet", name: "椰子油或融化無鹽奶油", baseValue: 80, unit: "ml" },
      { category: "wet", name: "無糖植物奶或牛奶", baseValue: 60, unit: "ml" },
      { category: "flavor", name: "香草精", baseValue: 5, unit: "ml" }
    ],
    instructions: [
      { step: 1, text: "【預熱】將烤箱預熱至 175°C (350°F)。在 8 吋圓形蛋糕模內側抹薄薄一層奶油或鋪上烘焙紙。" },
      { step: 2, text: "【混合乾料】在一大碗中，將 {杏仁粉}、{無糖可可粉}、{砂糖或椰子糖}、{烘焙粉} 和 {鹽} 充分過篩混勻。" },
      { step: 3, text: "【打發濕料】在另一碗中，打入 {大雞蛋}，加入 {椰子油或融化無鹽奶油}、{無糖植物奶或牛奶} 及 {香草精}，攪打均勻。" },
      { step: 4, text: "【組合麵糊】將濕料倒入乾料中，使用橡皮刮刀溫柔切拌，直到剛好混合均勻、無乾燥粉塊即可。" },
      { step: 5, text: "【烘烤】將麵糊倒入準備好的烤模中，表面抹平。放入預熱好的烤箱烘烤 28-32 分鐘，或直到插入竹籤拔出無濕麵糊黏附。" },
      { step: 6, text: "【冷卻】出爐後留在模具中冷卻 15 分鐘，隨後脫模移至烤網上完全放涼。" }
    ]
  },
  custom_1783782113042: {
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
      { category: "dry", name: "杏仁粉", baseValue: 200, unit: "g" },
      { category: "dry", name: "細砂糖", baseValue: 100, unit: "g" },
      { category: "wet", name: "全脂希臘優格", baseValue: 120, unit: "ml" },
      { category: "wet", name: "葵花油或融化奶油", baseValue: 60, unit: "ml" },
      { category: "wet", name: "大雞蛋", baseValue: 4, unit: "顆" },
      { category: "dry", name: "烘焙粉", baseValue: 5, unit: "g" },
      { category: "dry", name: "鹽", baseValue: 1.5, unit: "g" },
      { category: "dry", name: "豆蔻粉", baseValue: 2.5, unit: "g" },
      { category: "flavor", name: "香草精", baseValue: 5, unit: "ml" },
      { category: "flavor", name: "玫瑰水", baseValue: 15, unit: "ml" },
      { category: "glaze", name: "糖粉 (淋醬)", baseValue: 60, unit: "g" },
      { category: "glaze", name: "水 (淋醬)", baseValue: 15, unit: "ml" },
      { category: "glaze", name: "香草精 (淋醬)", baseValue: 2.5, unit: "ml" }
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
  },
  custom_1784861569970: {
    id: "custom_1784861569970",
    isCustom: true,
    name: "檸香瑪斯卡波乳酪蛋糕",
    englishName: "Mascarpone Cheese Cake with Pastry Crust",
    description: "這款乳酪蛋糕使用清爽的馬斯卡彭起士（Mascarpone），搭配鮮奶油與牛奶，質地極度細緻柔滑，伴隨淡淡新鮮檸檬清香。",
    basePan: { shape: "round", size: 8, unit: "inch" },
    tips: [
      "請務必等塔皮完全放涼後再倒入起士餡，否則塔皮會吸收內餡濕氣而變得濕軟。",
      "切起士塔時，推薦使用刀刃受熱過的主廚刀，一刀到底直直切下，即可切出完美乾淨剖面。"
    ],
    ingredients: [
      { category: "wet", name: "無鹽奶油", baseValue: 80, unit: "g" },
      { category: "dry", name: "糖粉", baseValue: 60, unit: "g" },
      { category: "wet", name: "蛋黃", baseValue: 1, unit: "個" },
      { category: "dry", name: "低筋麵粉", baseValue: 120, unit: "g" },
      { category: "wet", name: "馬斯卡彭起士 (Mascarpone)", baseValue: 250, unit: "g" },
      { category: "wet", name: "動物性鮮奶油", baseValue: 100, unit: "ml" },
      { category: "wet", name: "全脂牛奶", baseValue: 40, unit: "ml" },
      { category: "flavor", name: "新鮮檸檬汁", baseValue: 15, unit: "ml" },
      { category: "flavor", name: "檸檬皮屑", baseValue: 1, unit: "顆份" }
    ],
    instructions: [
      { step: 1, text: "【塔皮製作】奶油切塊與麵粉、糖粉揉成沙粒狀，加入蛋黃凝聚成團，冷藏鬆弛 30 分鐘。" },
      { step: 2, text: "【塔皮烘烤】將塔皮擀平鋪入 8 吋模具，盲烤 180°C 15 分鐘至微金黃並放涼。" },
      { step: 3, text: "【起士內餡】將馬斯卡彭起士與鮮奶油、牛奶、檸檬汁、檸檬皮屑攪拌至無顆粒滑順質地。" },
      { step: 4, text: "【填餡烘烤】將起士餡倒入放涼的塔皮，以 190°C 烘烤 15-20 分鐘後出爐冷藏保存。" }
    ]
  },
  custom_1784862334940: {
    id: "custom_1784862334940",
    isCustom: true,
    name: "經典半熟起士塔",
    englishName: "Half-Baked Cheese Tart",
    description: "這款半熟起士塔使用清爽的馬斯卡彭起士（Mascarpone），搭配鮮奶油與牛奶，相較於傳統僅使用奶油乳酪與酸奶油的配方，質地更加濕潤。烤過後經過適度冷藏，呈現中心半熟流心、入口即化的細緻口感。",
    basePan: { shape: "round", size: 6, unit: "inch" },
    tips: [
      "請務必等塔皮完全放涼後再倒入起士餡，否則塔皮會吸收內餡濕氣而變得濕軟。",
      "如果起士糊顆粒感很明顯，通常是因為起士溫度太低，可透過隔水加熱（溫水）並同時攪拌來解決。",
      "刷蛋黃液時，薄刷多層並連同塔皮上緣一起刷，烤出來的上色層次會非常均勻漂亮。",
      "切起士塔時，推薦使用長度 20 公分以上的主廚刀，一刀到底直直切下，即可切出完美乾淨的剖面。"
    ],
    ingredients: [
      { category: "wet", name: "無鹽奶油", baseValue: 60, unit: "g", note: "冷藏，要用時再拿出來" },
      { category: "dry", name: "糖粉", baseValue: 50, unit: "g" },
      { category: "dry", name: "鹽", baseValue: 1, unit: "適量", note: "少許", isStatic: true },
      { category: "wet", name: "蛋黃", baseValue: 1, unit: "個" },
      { category: "flavor", name: "香草精", baseValue: 2.5, unit: "ml" },
      { category: "dry", name: "杏仁粉", baseValue: 30, unit: "g" },
      { category: "dry", name: "低筋麵粉", baseValue: 80, unit: "g" },
      { category: "wet", name: "馬斯卡彭起士 (Mascarpone)", baseValue: 150, unit: "g" },
      { category: "wet", name: "動物性鮮奶油", baseValue: 80, unit: "ml" },
      { category: "wet", name: "全脂牛奶", baseValue: 30, unit: "ml" },
      { category: "dry", name: "玉米澱粉", baseValue: 10, unit: "g" }
    ],
    instructions: [
      { step: 1, text: "【塔皮製作】奶油切小塊，與麵粉、糖粉、杏仁粉混合揉成沙粒狀，加入蛋黃與香草精凝聚成團，冷藏鬆弛 30 分鐘。" },
      { step: 2, text: "【塔皮烘烤】將塔皮擀平鋪入 6 吋塔模，壓實捏好邊緣，盲烤 180°C 15 分鐘後放涼。" },
      { step: 3, text: "【起士內餡】將馬斯卡彭起士、鮮奶油、牛奶與玉米澱粉隔水溫熱攪拌至滑順無顆粒。" },
      { step: 4, text: "【填餡與烘烤】將起士餡倒入放涼的塔皮中，表面刷上蛋黃液，以 200°C 高溫烘烤 10-12 分鐘至表面金黃流心。" },
      { step: 5, text: "【冷藏靜置】出爐後完全冷卻，放入冰箱冷藏 2 小時以上即可切塊享用。" }
    ]
  }
};

// 3. All 459 Brian Scraped Recipes
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

// Combine all 3 sources: User Custom + Presets + Brian Scraped
const grandTotal = {
  ...userCustom,
  ...presets,
  ...brianRecipes
};

console.log(`\n======================================================`);
console.log(`GRAND TOTAL 100% RECOVERED RECIPES: ${Object.keys(grandTotal).length}`);
console.log(` - 👤 User Custom Recipes: ${Object.keys(userCustom).length}`);
console.log(` - 🍰 Original Preset Recipes: ${Object.keys(presets).length}`);
console.log(` - 📖 Brian Scraped Recipes: ${Object.keys(brianRecipes).length}`);
console.log(`======================================================\n`);

fs.writeFileSync('recipes_data.js', `window.recipes = ${JSON.stringify(grandTotal, null, 2)};`, 'utf8');
console.log("Updated recipes_data.js! Size: " + (fs.statSync('recipes_data.js').size / 1024 / 1024).toFixed(2) + " MB");
