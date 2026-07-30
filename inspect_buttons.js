const fs = require('fs');

const html = fs.readFileSync('code_artifact.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('handleSaveRecipe') || l.includes('handleDelete') || l.includes('isModalOpen') || l.includes('新增食譜') || l.includes('編輯')) {
    console.log(`${i + 1}: ${l.slice(0, 100)}`);
  }
});
