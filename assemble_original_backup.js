const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

const lineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    const text = JSON.stringify(entry);
    
    // Look for content output with line numbers like "1: <!DOCTYPE html>"
    if (entry.content && typeof entry.content === 'string') {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          const lineNum = parseInt(m[1], 10);
          const lineContent = m[2];
          // Save line if not already recorded (first time seen is original read)
          if (!lineMap[lineNum]) {
            lineMap[lineNum] = lineContent;
          }
        }
      }
    }
  } catch(e){}
}

const maxLine = Math.max(...Object.keys(lineMap).map(n => parseInt(n, 10)));
console.log(`Extracted ${Object.keys(lineMap).length} original lines (Max line: ${maxLine})`);

const originalLines = [];
for (let i = 1; i <= maxLine; i++) {
  originalLines.push(lineMap[i] !== undefined ? lineMap[i] : "");
}

const originalContent = originalLines.join('\n');
fs.writeFileSync('code_artifact_original_backup.html', originalContent, 'utf8');

console.log("Successfully created code_artifact_original_backup.html!");
console.log("Backup file size:", (originalContent.length / 1024).toFixed(2), "KB");
