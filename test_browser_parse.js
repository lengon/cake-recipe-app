const fs = require('fs');

const html = fs.readFileSync('code_artifact.html', 'utf8');

// Check script tags in HTML
console.log("HTML length:", html.length);

const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push({
    tag: match[0].substring(0, 100),
    src: match[0].match(/src=["']([^"']+)["']/)?.[1] || null,
    type: match[0].match(/type=["']([^"']+)["']/)?.[1] || null,
    length: match[1].length
  });
}

console.log("Found script tags:", scripts);
