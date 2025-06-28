// check-integrity.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

// Config
const appDir = path.resolve(__dirname, 'your-electron-app-folder'); // same as before
const dbFile = path.resolve(__dirname, 'file_hashes.db');

function hashFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

const db = new Database(dbFile, { readonly: true });
const rows = db.prepare(`SELECT file_path, sha256 FROM file_hashes`).all();

let allMatch = true;
for (const { file_path, sha256 } of rows) {
  const absPath = path.join(appDir, file_path);
  if (!fs.existsSync(absPath)) {
    console.error(`Missing file: ${file_path}`);
    allMatch = false;
    continue;
  }
  const newHash = hashFile(absPath);
  if (sha256 !== newHash) {
    console.error(`File changed: ${file_path}`);
    allMatch = false;
  }
}

if (allMatch) {
  console.log('All files match original deployment.');
} else {
  console.error('Integrity check failed! Some files have changed or are missing.');
}
db.close();
