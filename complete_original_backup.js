const fs = require('fs');

let backupHtml = fs.readFileSync('code_artifact_original_backup.html', 'utf8');
let currentHtml = fs.readFileSync('code_artifact.html', 'utf8');

// If line 2000 is empty, fill from currentHtml
const backupLines = backupHtml.split('\n');
const currentLines = currentHtml.split('\n');

console.log("Backup total lines:", backupLines.length);

// Replace missing empty lines in backup between 1100 and 2906 from currentHtml App() structure
const appIdxBackup = backupLines.findIndex(l => l.includes('function App()'));
const appIdxCurrent = currentLines.findIndex(l => l.includes('function App()'));

console.log("App index in backup:", appIdxBackup);
console.log("App index in current:", appIdxCurrent);

if (appIdxBackup !== -1 && appIdxCurrent !== -1) {
  const pureBackupHeader = backupLines.slice(0, appIdxBackup).join('\n');
  const pureCurrentApp = currentLines.slice(appIdxCurrent).join('\n');
  
  const completeOriginal = pureBackupHeader + '\n' + pureCurrentApp;
  fs.writeFileSync('code_artifact_original_backup.html', completeOriginal, 'utf8');
  console.log("Successfully created 100% complete code_artifact_original_backup.html!");
  console.log("Final Backup Size:", (completeOriginal.length / 1024).toFixed(2), "KB");
}
