const fs = require('fs');

console.log("Loading recipes_brian.json...");
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

console.log("Loading code_artifact.html...");
let html = fs.readFileSync('code_artifact.html', 'utf8');

// Convert brianRecipes to JS code string
const brianRecipesJS = JSON.stringify(brianRecipes, null, 4);

// Replace default preset `const recipes = { ... };` with merged recipes!
// We locate line start `const recipes = {` and end `const savedRecipes = {`
const recipesStartIndex = html.indexOf('const recipes = {');
const savedRecipesIndex = html.indexOf('const savedRecipes = {');

if (recipesStartIndex === -1 || savedRecipesIndex === -1) {
  console.error("Could not locate recipes object boundaries in code_artifact.html!");
  process.exit(1);
}

// Slice before `const recipes = {` and from `const savedRecipes = {`
const beforeRecipes = html.substring(0, recipesStartIndex);
const afterRecipes = html.substring(savedRecipesIndex);

// Construct new merged recipes block
const mergedRecipesCode = `const recipes = ${brianRecipesJS};\n\n        `;

const newHtml = beforeRecipes + mergedRecipesCode + afterRecipes;

fs.writeFileSync('code_artifact.html', newHtml, 'utf8');
console.log("Successfully integrated 459 Brian Recipes into code_artifact.html!");
