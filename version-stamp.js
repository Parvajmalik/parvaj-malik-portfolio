/**
 * version-stamp.js
 * Run this before deploying: node version-stamp.js
 * It adds/updates ?v=TIMESTAMP on all local JS and CSS files in frontend/
 */

const fs = require('fs');
const path = require('path');

// Generate version from current timestamp e.g. 20260330143022
const version = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);

const frontendDir = path.join(__dirname, 'frontend');

// Find all .html files recursively
function getHtmlFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(frontendDir);

let totalReplaced = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Match local css href and js src (skip CDN links — they contain ://)
  // Replaces existing ?v=xxx or adds new ?v=xxx
  // Handles both > and /> closing tags
  content = content.replace(
    /(href|src)="((?!https?:\/\/)[^"]+\.(css|js))(\?v=[^"]*)?"/g,
    (match, attr, filePath) => {
      totalReplaced++;
      return `${attr}="${filePath}?v=${version}"`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Stamped: ${path.relative(__dirname, file)}`);
  }
}

console.log(`\nVersion: ${version}`);
console.log(`Total references updated: ${totalReplaced}`);
console.log('\nNow upload the frontend/ folder to your server.');
