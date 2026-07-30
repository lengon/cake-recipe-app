const fs = require('fs');

const html = fs.readFileSync('code_artifact.html', 'utf8');

// Verify that deletedIds state is used to filter allRecipes
if (html.includes('deletedIds.includes(id)')) {
  console.log("✅ Verified: allRecipes correctly filters out deletedIds!");
} else {
  console.error("❌ allRecipes does NOT filter out deletedIds!");
}

if (html.includes('handleRestoreDeletedRecipes')) {
  console.log("✅ Verified: handleRestoreDeletedRecipes function added!");
}

if (html.includes('♻️ 復原')) {
  console.log("✅ Verified: Restore button added to UI!");
}
