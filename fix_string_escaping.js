const fs = require('fs');

console.log("Fixing inner string literal script escaping in code_artifact.html...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Replace script tags inside template string in generateUpdatedHtml with \x3C unicode escapes
const templateScriptBad = '<script type="text/babel">\n${updatedScript}';
const templateScriptGood = '\\x3Cscript type="text/babel">\n${updatedScript}';

if (html.includes(templateScriptBad)) {
  html = html.replace(templateScriptBad, templateScriptGood);
  console.log("Escaped inner script tag in generateUpdatedHtml template string!");
}

// Replace any </script> inside template string
const templateEndBad = '</${\'script\'}>';
const templateEndGood = '\\x3C/script>';
html = html.replace(templateEndBad, templateEndGood);

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Saved fix_string_escaping.js!");
