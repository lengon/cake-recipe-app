const fs = require('fs');

console.log("Fixing deletion logic in code_artifact.html...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Replace customRecipes and allRecipes init logic
const oldStateBlock = `const [customRecipes, setCustomRecipes] = useState(() => {
                try {
                    const saved = localStorage.getItem("magic_baking_custom_recipes");
                    const localSaved = saved ? JSON.parse(saved) : {};
                    
                    const deleted = localStorage.getItem("magic_baking_deleted_recipes");
                    const deletedIds = deleted ? JSON.parse(deleted) : [];

                    const merged = { ...savedRecipes };
                    deletedIds.forEach(id => {
                        delete merged[id];
                    });

                    return { ...merged, ...localSaved };
                } catch (e) {
                    console.error("無法載入自訂食譜:", e);
                    return savedRecipes;
                }
            });

            const allRecipes = { ...recipes, ...customRecipes };`;

const newStateBlock = `const [customRecipes, setCustomRecipes] = useState(() => {
                try {
                    const saved = localStorage.getItem("magic_baking_custom_recipes");
                    return saved ? JSON.parse(saved) : {};
                } catch (e) {
                    return {};
                }
            });

            const [deletedIds, setDeletedIds] = useState(() => {
                try {
                    const saved = localStorage.getItem("magic_baking_deleted_recipes");
                    return saved ? JSON.parse(saved) : [];
                } catch (e) {
                    return [];
                }
            });

            const rawAllRecipes = { ...recipes, ...customRecipes };
            const allRecipes = {};
            for (const [id, r] of Object.entries(rawAllRecipes)) {
                if (!deletedIds.includes(id)) {
                    allRecipes[id] = r;
                }
            }`;

html = html.replace(oldStateBlock, newStateBlock);

// Replace activeRecipe fallback
html = html.replace(
  'const activeRecipe = allRecipes[activeRecipeId] || recipes.almondCitrus;',
  'const activeRecipe = allRecipes[activeRecipeId] || Object.values(allRecipes)[0] || {};'
);

// Replace handleDeleteRecipe logic
const oldDeleteFunc = `const handleDeleteRecipe = (id, e) => {
                if (e) e.stopPropagation();
                const targetRecipe = allRecipes[id];
                const recipeName = targetRecipe ? targetRecipe.name : "此食譜";
                if (!window.confirm(\`確定要刪除「\${recipeName}」食譜嗎？刪除後可在選單重新恢復。\`)) {
                    return;
                }

                const updatedCustom = { ...customRecipes };
                delete updatedCustom[id];
                setCustomRecipes(updatedCustom);
                localStorage.setItem("magic_baking_custom_recipes", JSON.stringify(updatedCustom));
                
                // 記錄至已刪除清單
                try {
                    const deleted = localStorage.getItem("magic_baking_deleted_recipes");
                    const deletedIds = deleted ? JSON.parse(deleted) : [];
                    if (!deletedIds.includes(id)) {
                        const updatedDeleted = [...deletedIds, id];
                        localStorage.setItem("magic_baking_deleted_recipes", JSON.stringify(updatedDeleted));
                    }
                } catch (err) {
                    console.error("無法更新已刪除食譜清單:", err);
                }

                if (activeRecipeId === id) {
                    const remainingIds = Object.keys(allRecipes).filter(k => k !== id);
                    if (remainingIds.length > 0) {
                        setActiveRecipeId(remainingIds[0]);
                    }
                }
            };`;

const newDeleteFunc = `const handleDeleteRecipe = (id, e) => {
                if (e) e.stopPropagation();
                const targetRecipe = rawAllRecipes[id];
                const recipeName = targetRecipe ? targetRecipe.name : "此食譜";
                if (!window.confirm(\`確定要刪除「\${recipeName}」食譜嗎？刪除後將移出列表。\`)) {
                    return;
                }

                const newDeleted = deletedIds.includes(id) ? deletedIds : [...deletedIds, id];
                setDeletedIds(newDeleted);
                localStorage.setItem("magic_baking_deleted_recipes", JSON.stringify(newDeleted));

                if (customRecipes[id]) {
                    const updatedCustom = { ...customRecipes };
                    delete updatedCustom[id];
                    setCustomRecipes(updatedCustom);
                    localStorage.setItem("magic_baking_custom_recipes", JSON.stringify(updatedCustom));
                }

                const remainingKeys = Object.keys(rawAllRecipes).filter(k => !newDeleted.includes(k));
                if (remainingKeys.length > 0) {
                    setActiveRecipeId(remainingKeys[0]);
                }
            };

            const handleRestoreDeletedRecipes = () => {
                if (window.confirm("確定要恢復所有已刪除的食譜嗎？")) {
                    setDeletedIds([]);
                    localStorage.removeItem("magic_baking_deleted_recipes");
                }
            };`;

html = html.replace(oldDeleteFunc, newDeleteFunc);

// Add restore button to sidebar header next to Add Recipe
const sidebarHeaderButtonsTarget = `<button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-xs"
                                        >
                                            ➕ 新增食譜
                                        </button>`;

const sidebarHeaderButtonsReplacement = `{deletedIds.length > 0 && (
                                            <button 
                                                onClick={handleRestoreDeletedRecipes}
                                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition"
                                                title="復原所有已被刪除的食譜"
                                            >
                                                ♻️ 復原 ({deletedIds.length})
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-xs"
                                        >
                                            ➕ 新增食譜
                                        </button>`;

html = html.replace(sidebarHeaderButtonsTarget, sidebarHeaderButtonsReplacement);

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Successfully updated deletion state logic and allRecipes filtering!");
