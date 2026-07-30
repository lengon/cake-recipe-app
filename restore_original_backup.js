const fs = require('fs');
const path = require('path');

const logPath = `C:\\Users\\lengo\\.gemini\\antigravity\\brain\\fdd3f2f7-e6f4-401c-b01f-365b5b21d070\\.system_generated\\logs\\transcript_full.jsonl`;

console.log("Searching for original code_artifact.html in transcript logs...");

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  console.log("Log file found. Size: " + (content.length / 1024 / 1024).toFixed(2) + " MB");
  
  // Search for view_file responses for code_artifact.html in transcript
  const lines = content.split('\n');
  const viewFileChunks = [];
  
  for (const line of lines) {
    if (line.includes('code_artifact.html') && line.includes('Showing lines')) {
      viewFileChunks.push(line);
    }
  }
  
  console.log("Found view_file chunks count:", viewFileChunks.length);
} else {
  console.log("Log file not found at path:", logPath);
}
