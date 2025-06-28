// hash-deployment.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

// Config
const appDir = path.resolve(__dirname, 'your-electron-app-folder'); // root folder of your app
const dbFile = path.resolve(__dirname, 'file_hashes.db');

// Helper to recursively list files
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Hash a file
function hashFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Create or overwrite DB
const db = new Database(dbFile);
db.exec(`DROP TABLE IF EXISTS file_hashes;`);
db.exec(`
  CREATE TABLE file_hashes (
    file_path TEXT PRIMARY KEY,
    sha256 TEXT
  );
`);

const insert = db.prepare(`INSERT INTO file_hashes (file_path, sha256) VALUES (?, ?)`);

const allFiles = getAllFiles(appDir);
for (const file of allFiles) {
  // Optional: filter to only hash .js/.html/.css/etc
  // if (!/\.(js|css|html)$/.test(file)) continue;

  const hash = hashFile(file);
  // Store relative path for portability
  const relPath = path.relative(appDir, file);
  insert.run(relPath, hash);
  console.log(`${relPath}: ${hash}`);
}
console.log(`Done! Hashed ${allFiles.length} files.`);
db.close();
