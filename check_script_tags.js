const fs = require('fs');
const html = fs.readFileSync('code_artifact.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('</script>') || l.includes('<script')) {
    console.log(`${i+1}: ${l.slice(0, 100)}`);
  }
});
