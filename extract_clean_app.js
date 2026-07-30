const fs = require('fs');

const html = fs.readFileSync('code_artifact.html', 'utf8');

const appIndex = html.indexOf('function App() {');
const savedRecipesIdx = html.indexOf('const savedRecipes = {');

console.log("App() index:", appIndex);
console.log("savedRecipes index:", savedRecipesIdx);

// Locate header up to <body>
const bodyIdx = html.indexOf('<body>');
const header = html.substring(0, bodyIdx);

// Locate App() to the end of the file
const appToEnd = html.substring(appIndex);

const cleanHtml = `${header}<body>
    <div id="root"></div>

    <script src="recipes_data.js"></script>
    <script type="text/babel">

        const { useState, useEffect } = React;

        // Recipes Data (全庫不萊嗯食譜 + 預設食譜)
        const recipes = window.recipes || {};
        const savedRecipes = {};

        const emptyIngredient = () => ({ category: "dry", name: "", baseValue: "", unit: "克", note: "" });
        const emptyStep = (num) => ({ step: num, text: "" });

        ${appToEnd}`;

fs.writeFileSync('code_artifact.html', cleanHtml, 'utf8');
console.log("New code_artifact.html size:", (cleanHtml.length / 1024).toFixed(2), "KB");
