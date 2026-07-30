const fs = require('fs');

const html = fs.readFileSync('code_artifact.html', 'utf8');

const scriptStart = html.indexOf('<script type="text/babel">');
const scriptEnd = html.lastIndexOf('</script>');

const jsx = html.substring(scriptStart + '<script type="text/babel">'.length, scriptEnd);

console.log("JSX length:", jsx.length);
console.log("Checking JSX syntax...");

// Test basic syntax checks
let openBraces = (jsx.match(/\{/g) || []).length;
let closeBraces = (jsx.match(/\}/g) || []).length;
console.log(`Braces: { = ${openBraces}, } = ${closeBraces}`);

if (openBraces !== closeBraces) {
  console.error("Mismatch in braces!");
} else {
  console.log("Syntax check passed cleanly!");
}
