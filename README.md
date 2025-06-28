# Thor
Protection against Electron backdoor vulnerability.

Electron deployments may have vulnerabilities to backdooring as exposed by https://github.com/boku7/Loki, see John Hammond's video demo on it: https://www.youtube.com/watch?v=FYok3diZY78.

This vulnerability was been shown to exist in April 2025 for Cursor AI's desktop application in Windows and may exist for other desktop applications such as Microsoft Teams, Discord and other major applicaions used by millions of people and many companies.

I believe this can be mitigated by process of creating a hash list of existing files at deployment, stored in a secure database, and checked against with the same hashing processes at runtime.

Obviously this may not protect against a changed file that might be cleverly designed to output the same hash, but this would drastically mitigate the vulnerability of deploying a persistent backdoor process that dependently executes at runtime.

---------------------------
### Using a local SQLite database. ###

## 1. Dependencies ##
You'll need these Node.js modules:

- sqlite3 for SQLite database (or better: better-sqlite3 for sync/async options)
- crypto (built-in) for hashing
- fs and path (built-in) for file system walking

```bash
npm install sqlite3
```

OR for better-sqlite3 (faster, synchronous, recommended):

```bash
npm install better-sqlite3
```

## 2. Deployment Script (hash and store) ##
This script recursively hashes files in a directory and stores (path, hash) in SQLite.
See [hash-deployment.js](./hash-deployment.js) for the hash-list generation and storage at deployment script.

## 3. Runtime Check Script (to be run by Electron at startup) ##
At app runtime, check each file’s hash against the DB.
See [check-integrity.js](./check-integrity.js) for the runtime integrity check script.

## 4. How to Use
At deployment (before packaging):
Run node hash-deployment.js to create file_hashes.db.

At runtime (on app start):
Run node check-integrity.js (or invoke in main process).

## 5. Integrate with Electron
Place file_hashes.db in your app’s resources or next to app root.

Add the runtime check as an early step in your Electron main.js:

```js
require('./check-integrity.js');
// If check fails, show error dialog and exit or warn user
```

## 6. Security Notes & Tips ##
Hash the exact files distributed to users, not just your dev copy.

You can exclude files that change at runtime (like logs or cache).

For tamper-proofing, consider signing the database or storing the hash of file_hashes.db somewhere secure.
