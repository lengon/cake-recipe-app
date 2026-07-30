const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

for (const rawLine of lines) {
  if (!rawLine.trim()) continue;
  try {
    const entry = JSON.parse(rawLine);
    if (entry.step_index === 197) {
      fs.writeFileSync('step_197_prompt.txt', entry.content, 'utf8');
      console.log("Saved step_197_prompt.txt! Length:", entry.content.length);
    }
  } catch(e){}
}
