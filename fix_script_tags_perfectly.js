const fs = require('fs');

console.log("Fixing main script tag in code_artifact.html...");

let html = fs.readFileSync('code_artifact.html', 'utf8');

// Fix line 40: Change `<' + 'script type="text/babel">` back to `<script type="text/babel">` at the start of the body!
html = html.replace("<' + 'script type=\"text/babel\">\n\n        const { useState, useEffect } = React;", "<script type=\"text/babel\">\n\n        const { useState, useEffect } = React;");

// In template literal inside generateUpdatedHtml:
html = html.replace("    <' + 'script type=\"text/babel\">\n${updatedScript}", "    <script type=\"text/babel\">\n${updatedScript}");

fs.writeFileSync('code_artifact.html', html, 'utf8');
console.log("Successfully fixed script tag on line 40!");
