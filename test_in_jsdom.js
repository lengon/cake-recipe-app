const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log("Testing code_artifact.html in JSDOM simulation...");

const html = fs.readFileSync('code_artifact.html', 'utf8');
const recipesDataJs = fs.readFileSync('recipes_data.js', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("BROWSER CONSOLE ERROR:", err);
});
virtualConsole.on("warn", (warn) => {
  console.warn("BROWSER CONSOLE WARN:", warn);
});
virtualConsole.on("log", (msg) => {
  console.log("BROWSER CONSOLE LOG:", msg);
});

const dom = new JSDOM(html, {
  url: "file://" + __dirname + "/code_artifact.html",
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
});

// Inject recipes_data.js manually into window context to simulate local file script
try {
  dom.window.eval(recipesDataJs);
  console.log("recipes_data.js evaluated in window context. Total recipes:", Object.keys(dom.window.recipes || {}).length);
} catch(e) {
  console.error("Failed to eval recipes_data.js:", e);
}

// Find Babel script
const babelScriptStart = html.indexOf('<script type="text/babel">');
const babelScriptEnd = html.lastIndexOf('</script>');
const babelCode = html.substring(babelScriptStart + '<script type="text/babel">'.length, babelScriptEnd);

// Check string literal in Babel code
if (babelCode.includes('<script type="text/babel">')) {
  console.error("CRITICAL: Found nested <script type=\"text/babel\"> inside script string!");
}
