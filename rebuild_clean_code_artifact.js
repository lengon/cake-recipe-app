const fs = require('fs');

console.log("Rebuilding clean code_artifact.html...");

const html = fs.readFileSync('code_artifact.html', 'utf8');

// Find the last occurrence of function App() and ReactDOM.createRoot
const appStart = html.lastIndexOf('function App() {');
const rootRender = html.lastIndexOf('ReactDOM.createRoot');

if (appStart === -1 || rootRender === -1) {
  console.error("Could not find App component boundaries!");
  process.exit(1);
}

const appCode = html.substring(appStart);

const cleanHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>烘焙比例魔法師 - 智慧蛋糕食譜計算機</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- React & ReactDOM -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <!-- Babel for JSX compilation in browser -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            background-color: #fcfbf7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .recipe-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .recipe-card:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script src="recipes_data.js"></script>
    <script type="text/babel">

        const { useState, useEffect } = React;

        // Recipes Data (全庫不萊嗯食譜 + 預設食譜)
        const recipes = window.recipes || {};
        const savedRecipes = {};

        const emptyIngredient = () => ({ category: "dry", name: "", baseValue: "", unit: "克", note: "" });
        const emptyStep = (num) => ({ step: num, text: "" });

        ${appCode}`;

fs.writeFileSync('code_artifact.html', cleanHtml, 'utf8');
console.log("Successfully rebuilt code_artifact.html! Size:", (cleanHtml.length / 1024).toFixed(2), "KB");
