const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

console.log("Analyzing turn 1 view_file outputs for original recipes...");

// Collect all content chunks from turn 1 view_file
const turn1Chunks = [];
for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    // turn 1 step_index < 80
    if (entry.step_index && entry.step_index < 80 && entry.content && entry.content.includes('file:///c:/Users/lengo/OneDrive') && entry.content.includes('code_artifact.html')) {
      turn1Chunks.push(entry.content);
    }
  } catch(e){}
}

console.log("Total turn 1 view_file chunks:", turn1Chunks.length);

// Extract all lines from these chunks
const lineMap = {};
for (const chunk of turn1Chunks) {
  const chunkLines = chunk.split('\n');
  for (const cl of chunkLines) {
    const m = cl.match(/^([0-9]+):\s?(.*)$/);
    if (m) {
      const lineNum = parseInt(m[1], 10);
      const lineContent = m[2];
      if (!lineMap[lineNum]) {
        lineMap[lineNum] = lineContent;
      }
    }
  }
}

const maxLine = Math.max(...Object.keys(lineMap).map(n => parseInt(n, 10)));
console.log(`Extracted ${Object.keys(lineMap).length} original lines (Max line: ${maxLine})`);

const origFileContent = [];
for (let i = 1; i <= maxLine; i++) {
  origFileContent.push(lineMap[i] !== undefined ? lineMap[i] : "");
}

const fullOrigHtml = origFileContent.join('\n');
fs.writeFileSync('my_true_original_code_artifact.html', fullOrigHtml, 'utf8');
console.log("Created my_true_original_code_artifact.html! Size:", (fullOrigHtml.length / 1024).toFixed(2), "KB");
