const fs = require('fs');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;
const content = fs.readFileSync(logPath, 'utf8');

const idx = content.indexOf('custom_1783780600556');
if (idx !== -1) {
  console.log("Snippet around custom_1783780600556:");
  console.log(content.substring(idx - 100, idx + 1500));
}
