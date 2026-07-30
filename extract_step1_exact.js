const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const targetSteps = [67, 69, 71, 73, 75, 97, 99, 101, 103];
const lines = content.split('\n');

const lineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    if (targetSteps.includes(entry.step_index) && entry.content) {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          const lineNum = parseInt(m[1], 10);
          const lineText = m[2];
          if (!lineMap[lineNum]) {
            lineMap[lineNum] = lineText;
          }
        }
      }
    }
  } catch(e){}
}

console.log("Total unique original lines extracted:", Object.keys(lineMap).length);
const sortedLineNums = Object.keys(lineMap).map(n => parseInt(n, 10)).sort((a,b)=>a-b);
console.log("Line ranges:", sortedLineNums[0], "to", sortedLineNums[sortedLineNums.length-1]);

// Write code lines to original_pure.js
const codeLines = [];
for (let i = 1; i <= sortedLineNums[sortedLineNums.length-1]; i++) {
  codeLines.push(lineMap[i] !== undefined ? lineMap[i] : "");
}

const fullCode = codeLines.join('\n');
fs.writeFileSync('pure_original_code_artifact.html', fullCode, 'utf8');
console.log("Saved pure_original_code_artifact.html! Size:", (fullCode.length / 1024).toFixed(2), "KB");
