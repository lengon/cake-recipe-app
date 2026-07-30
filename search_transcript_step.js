const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    if (entry.content && entry.content.includes('file:///c:/Users/lengo/OneDrive') && entry.content.includes('code_artifact.html')) {
      console.log(`Step ${entry.step_index}: type=${entry.type}, snippet=${entry.content.slice(0, 120).replace(/\n/g, ' ')}`);
    }
  } catch(e){}
}
