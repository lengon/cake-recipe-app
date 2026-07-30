const fs = require('fs');

console.log("Adding Edit & Delete capabilities for all recipes in code_artifact.html...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// 1. Add state for editingRecipeId
const stateTarget = 'const [isModalOpen, setIsModalOpen] = useState(false);';
const stateReplacement = `const [isModalOpen, setIsModalOpen] = useState(false);\n            const [editingRecipeId, setEditingRecipeId] = useState(null);`;

if (!html.includes('editingRecipeId')) {
  html = html.replace(stateTarget, stateReplacement);
}

// 2. Add handleOpenEditModal function and update resetForm
const resetFormTarget = 'const resetForm = () => {';
const resetFormReplacement = `const resetForm = () => {
                setEditingRecipeId(null);`;

html = html.replace(resetFormTarget, resetFormReplacement);

// Add handleOpenEditModal before handleSaveRecipe
const handleSaveTarget = 'const handleSaveRecipe = (e) => {';
const handleOpenEditCode = `const handleOpenEditModal = (recipeToEdit, e) => {
                if (e) e.stopPropagation();
                const target = recipeToEdit || activeRecipe;
                if (!target) return;

                setEditingRecipeId(target.id);
                setFormName(target.name || "");
                setFormEngName(target.englishName || "");
                setFormDesc(target.description || "");
                
                const shape = target.basePan?.shape || "round";
                setFormPanShape(shape);
                if (shape === "round" || shape === "square") {
                    setFormBaseSize(target.basePan?.size || 8);
                } else if (shape === "loaf") {
                    setFormPanLength(target.basePan?.length || 9);
                    setFormPanWidth(target.basePan?.width || 5);
                }

                setFormIngredients(
                    target.ingredients && target.ingredients.length
                        ? target.ingredients.map(ing => ({
                            category: ing.category || "dry",
                            name: ing.name || "",
                            baseValue: ing.baseValue !== undefined ? ing.baseValue : "",
                            unit: ing.unit || "克",
                            note: ing.note || "",
                            isStatic: ing.isStatic || false
                        }))
                        : [emptyIngredient()]
                );

                setFormInstructions(
                    target.instructions && target.instructions.length
                        ? target.instructions.map(st => ({ step: st.step, text: st.text || "" }))
                        : [emptyStep(1)]
                );

                setFormTips(target.tips && target.tips.length ? target.tips : [""]);
                setImportMode("manual");
                setFormError("");
                setIsModalOpen(true);
            };

            const handleSaveRecipe = (e) => {`;

html = html.replace(handleSaveTarget, handleOpenEditCode);

// 3. Update handleSaveRecipe logic to handle edit vs new
const saveIdTarget = 'const newId = "custom_" + Date.now();';
const saveIdReplacement = 'const targetId = editingRecipeId || ("custom_" + Date.now());';

html = html.replace(saveIdTarget, saveIdReplacement);

// Replace newId with targetId inside handleSaveRecipe
const newRecipeObjectTarget = 'id: newId,';
html = html.replace(newRecipeObjectTarget, 'id: targetId,');

const updatedCustomTarget = 'const updated = { ...customRecipes, [newId]: newRecipe };';
const updatedCustomReplacement = `const updated = { ...customRecipes, [targetId]: newRecipe };`;
html = html.replace(updatedCustomTarget, updatedCustomReplacement);

const setActiveTarget = 'setActiveRecipeId(newId);';
html = html.replace(setActiveTarget, 'setActiveRecipeId(targetId);');

// 4. Update handleDeleteRecipe logic to work for ALL recipes
const handleDeleteTarget = `const handleDeleteRecipe = (id, e) => {
                e.stopPropagation(); 
                const updated = { ...customRecipes };
                delete updated[id];
                setCustomRecipes(updated);
                localStorage.setItem("magic_baking_custom_recipes", JSON.stringify(updated));
                
                // 若刪除的是檔案中已編寫的食譜，則記錄到已刪除清單中，避免重新整理後復活
                if (savedRecipes[id]) {
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
                }

                if (activeRecipeId === id) {
                    setActiveRecipeId("almondCitrus");
                }
            };`;

const handleDeleteReplacement = `const handleDeleteRecipe = (id, e) => {
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

html = html.replace(handleDeleteTarget, handleDeleteReplacement);

// 5. Update Sidebar card item action buttons (add Edit and Delete for all recipes)
const sidebarItemButtonsTarget = `{recipe.isCustom && (
                                                <button
                                                    onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                                                    className="absolute top-3 right-3 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 rounded-md hover:bg-stone-200/50"
                                                    title="刪除此自訂食譜"
                                                >
                                                    🗑️
                                                </button>
                                            )}`;

const sidebarItemButtonsReplacement = `<div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition bg-stone-100/90 p-1 rounded-lg border border-stone-200/60 shadow-xs">
                                                <button
                                                    onClick={(e) => handleOpenEditModal(recipe, e)}
                                                    className="text-stone-500 hover:text-amber-600 p-1 rounded hover:bg-amber-50 text-xs font-bold"
                                                    title="編輯此食譜"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                                                    className="text-stone-500 hover:text-red-600 p-1 rounded hover:bg-red-50 text-xs font-bold"
                                                    title="刪除此食譜"
                                                >
                                                    🗑️
                                                </button>
                                            </div>`;

html = html.replace(sidebarItemButtonsTarget, sidebarItemButtonsReplacement);

// 6. Update Main Recipe Card Header to include ✏️ 編輯 and 🗑️ 刪除 action buttons
const mainCardHeaderTarget = `<div className="flex justify-between items-start border-b border-stone-100 pb-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-stone-900">{activeRecipe.name}</h2>
                                        <p className="text-xs text-stone-400 italic mt-0.5">{activeRecipe.englishName}</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                                        當前倍率：{scaleFactor}x
                                    </div>
                                </div>`;

const mainCardHeaderReplacement = `<div className="flex flex-wrap justify-between items-start border-b border-stone-100 pb-4 mb-6 gap-3">
                                    <div>
                                        <h2 className="text-2xl font-black text-stone-900">{activeRecipe.name}</h2>
                                        <p className="text-xs text-stone-400 italic mt-0.5">{activeRecipe.englishName}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {activeRecipe.sourceUrl && (
                                            <a 
                                                href={activeRecipe.sourceUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center gap-1"
                                                title="開啟不萊嗯原創食譜網頁"
                                            >
                                                🔗 原食譜 ↗
                                            </a>
                                        )}
                                        <button
                                            onClick={(e) => handleOpenEditModal(activeRecipe, e)}
                                            className="bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 border border-stone-200 text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center gap-1"
                                            title="編輯這道食譜"
                                        >
                                            ✏️ 編輯
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteRecipe(activeRecipe.id, e)}
                                            className="bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 border border-stone-200 text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center gap-1"
                                            title="刪除這道食譜"
                                        >
                                            🗑️ 刪除
                                        </button>
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1.5 rounded-xl font-bold">
                                            {scaleFactor}x
                                        </div>
                                    </div>
                                </div>`;

html = html.replace(mainCardHeaderTarget, mainCardHeaderReplacement);

// Update Modal title to show "編輯食譜" when editing
const modalTitleTarget = '✍️ 手動輸入 / 校對食譜';
const modalTitleReplacement = '{editingRecipeId ? "✏️ 編輯與調整食譜" : "✍️ 手動輸入 / 校對食譜"}';

html = html.replace(modalTitleTarget, modalTitleReplacement);

const saveModalBtnTarget = '儲存食譜';
const saveModalBtnReplacement = '{editingRecipeId ? "更新並儲存食譜" : "儲存食譜"}';

html = html.replace(saveModalBtnTarget, saveModalBtnReplacement);

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Successfully added edit and delete features to code_artifact.html!");
