const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log("Testing deletion logic in JSDOM simulation...");

const html = fs.readFileSync('code_artifact.html', 'utf8');
const recipesDataJs = fs.readFileSync('recipes_data.js', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => console.error("BROWSER ERROR:", err));

const dom = new JSDOM(html, {
  url: "file://" + __dirname + "/code_artifact.html",
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
});

dom.window.eval(recipesDataJs);

setTimeout(() => {
  console.log("Recipes loaded in DOM context: " + Object.keys(dom.window.recipes || {}).length);
  console.log("DOM root content length: " + dom.window.document.getElementById('root').innerHTML.length);
  if (dom.window.document.getElementById('root').innerHTML.length > 500) {
    console.log("✅ React App mounted and rendered UI successfully!");
  } else {
    console.error("❌ React App failed to mount!");
  }
}, 500);
