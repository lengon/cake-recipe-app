const fs = require('fs');
const html = fs.readFileSync('code_artifact.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (i > 50000) {
    if (l.includes('placeholder=') || l.includes('selectedRecipe') || l.includes('sourceUrl') || l.includes('filteredRecipes')) {
      console.log(`${i + 1}: ${l.slice(0, 120)}`);
    }
  }
});
