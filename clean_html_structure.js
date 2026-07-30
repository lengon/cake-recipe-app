const fs = require('fs');

console.log("Cleaning code_artifact.html structure...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Find where <script type="text/babel"> starts and savedRecipes starts
const babelStart = html.indexOf('<script type="text/babel">');
const savedRecipesIndex = html.indexOf('const savedRecipes = {');

if (babelStart === -1 || savedRecipesIndex === -1) {
  console.error("Could not find script positions!");
  process.exit(1);
}

const beforeBabel = html.substring(0, babelStart);
const afterSavedRecipes = html.substring(savedRecipesIndex);

const cleanBabelBlock = `<script src="recipes_data.js"></script>
    <script type="text/babel">

        const { useState, useEffect } = React;

        // Recipes Data (全庫不萊嗯食譜 + 預設食譜)
        const recipes = window.recipes || {};

        `;

const finalHtml = beforeBabel + cleanBabelBlock + afterSavedRecipes;

fs.writeFileSync('code_artifact.html', finalHtml, 'utf8');
console.log("Cleaned code_artifact.html size: " + (finalHtml.length / 1024).toFixed(2) + " KB");
