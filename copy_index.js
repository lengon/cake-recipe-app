const fs = require('fs');

console.log("Copying code_artifact.html to index.html...");
const html = fs.readFileSync('code_artifact.html', 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
console.log("Successfully created index.html (size: " + (html.length / 1024).toFixed(2) + " KB)");
