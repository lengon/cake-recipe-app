const fs = require('fs');

console.log("Loading recipes_brian.json...");
const brianRecipes = JSON.parse(fs.readFileSync('recipes_brian.json', 'utf8'));

// 1. Create recipes_data.js as standard JS file
const recipesDataJsContent = `window.recipes = ${JSON.stringify(brianRecipes, null, 2)};`;
fs.writeFileSync('recipes_data.js', recipesDataJsContent, 'utf8');
console.log("Created recipes_data.js (size: " + (recipesDataJsContent.length / 1024 / 1024).toFixed(2) + " MB)");

// 2. Read original code_artifact.html or clean template
let html = fs.readFileSync('code_artifact.html', 'utf8');

// Find where <script type="text/babel"> starts
const babelStart = html.indexOf('<script type="text/babel">');
const savedRecipesIndex = html.indexOf('const savedRecipes = {');

if (babelStart === -1 || savedRecipesIndex === -1) {
  console.error("Could not find script positions!");
  process.exit(1);
}

// Slice before babelStart and from savedRecipesIndex
const htmlHeader = html.substring(0, babelStart);
const htmlFooter = html.substring(savedRecipesIndex);

// Construct optimized HTML
// We include <script src="recipes_data.js"></script> right before <script type="text/babel">
// And in Babel script, we simply reference window.recipes!

const cleanBabelScript = `<script src="recipes_data.js"></script>
    <script type="text/babel">

        const { useState, useEffect } = React;

        // Recipes Data (全庫不萊嗯食譜 + 預設食譜)
        const recipes = window.recipes || {};

        `;

const finalHtml = htmlHeader + cleanBabelScript + htmlFooter;

fs.writeFileSync('code_artifact.html', finalHtml, 'utf8');
console.log("Successfully fixed code_artifact.html!");
