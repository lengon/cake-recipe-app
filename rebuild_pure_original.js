const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

const originalLineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    // Any view_file call before step 105 (first file edit)
    if (entry.step_index && entry.step_index < 105 && entry.content) {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          const lineNum = parseInt(m[1], 10);
          const lineContent = m[2];
          if (!originalLineMap[lineNum]) {
            originalLineMap[lineNum] = lineContent;
          }
        }
      }
    }
  } catch(e){}
}

const maxLine = Math.max(...Object.keys(originalLineMap).map(n => parseInt(n, 10)));
console.log(`Reconstructed ${Object.keys(originalLineMap).length} original lines (Max line: ${maxLine})`);

const origLines = [];
for (let i = 1; i <= maxLine; i++) {
  origLines.push(originalLineMap[i] !== undefined ? originalLineMap[i] : "");
}

const origText = origLines.join('\n');
fs.writeFileSync('code_artifact_original_backup.html', origText, 'utf8');
console.log("Successfully updated code_artifact_original_backup.html!");
console.log("Pure original backup file size:", (origText.length / 1024).toFixed(2), "KB");
