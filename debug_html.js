const fs = require('fs');
const html = fs.readFileSync('code_artifact.html', 'utf8');

// Find Babel script block
const scriptStart = html.indexOf('<script type="text/babel">');
const scriptEnd = html.lastIndexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
  console.log("Error: Script tags not found!");
  process.exit(1);
}

const jsContent = html.substring(scriptStart + '<script type="text/babel">'.length, scriptEnd);
console.log("Extracted JS size:", (jsContent.length / 1024 / 1024).toFixed(2), "MB");

// Test Babel transform using @babel/standalone or check syntax
try {
  // Check if string template literal or quotes inside JSON caused a breaking issue in Babel inline script
  console.log("Checking string escaping issues...");
  
  // Look for unescaped backticks or backslashes or unexpected script closing tag inside recipes string
  if (jsContent.includes('</script>')) {
    console.log("Found </script> inside JS content! This breaks HTML parsing!");
  }

  // Check if template literals or JSX parsing might fail due to huge object size in browser Babel
  // Note: Babel standalone in browser has stack size / memory limit when transpiling giant 2MB JSX files!
  console.log("Checking inline BabelStandalone compilation limitation...");

} catch(err) {
  console.error("Syntax Error found:", err);
}
