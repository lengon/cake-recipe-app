const fs = require('fs');

console.log("Removing restore button from code_artifact.html...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// 1. Remove restore button from UI sidebar header
const restoreBtnPattern = /\{deletedIds\.length > 0 && \([\s\S]*?♻️ 復原[\s\S]*?\)\}/g;
html = html.replace(restoreBtnPattern, '');

// 2. Remove handleRestoreDeletedRecipes function
const handleRestorePattern = /const handleRestoreDeletedRecipes = \(\) => \{[\s\S]*?\};/g;
html = html.replace(handleRestorePattern, '');

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Successfully removed restore button from code_artifact.html!");
