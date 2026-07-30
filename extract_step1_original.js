const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

const step1LineMap = {};

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    // Filter for view_file responses from step_index early in trajectory (< step 20)
    if (entry.step_index && entry.step_index < 20 && entry.content) {
      const chunkLines = entry.content.split('\n');
      for (const cl of chunkLines) {
        const m = cl.match(/^([0-9]+):\s?(.*)$/);
        if (m) {
          const lineNum = parseInt(m[1], 10);
          const lineContent = m[2];
          if (!step1LineMap[lineNum]) {
            step1LineMap[lineNum] = lineContent;
          }
        }
      }
    }
  } catch(e){}
}

const maxLine = Math.max(...Object.keys(step1LineMap).map(n => parseInt(n, 10)));
console.log(`Extracted ${Object.keys(step1LineMap).length} step 1 original lines (Max line: ${maxLine})`);

const origLines = [];
for (let i = 1; i <= maxLine; i++) {
  origLines.push(step1LineMap[i] !== undefined ? step1LineMap[i] : "");
}

const origText = origLines.join('\n');
fs.writeFileSync('code_artifact_original_backup.html', origText, 'utf8');
console.log("Updated code_artifact_original_backup.html with pure original step 1 content!");
console.log("Size:", (origText.length / 1024).toFixed(2), "KB");
