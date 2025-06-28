# Thor
Protection against Electron backdoor vulnerability.

Electron deployments may have vulnerabilities to backdooring as exposed by github.com/boku7/Loki.

This vulnerability was been shown to exist in April 2025 for Cursor AI's desktop application in Windows and may exist for other desktop applications such as Microsoft Teams, Discord and other major applicaions used by millions of people and many companies.

I believe this can be mitigated by process of creating a hash list of existing files at deployment, stored in a secure database, and checked against with the same hashing processes at runtime.

Obviously this may not protect against a changed file that might be cleverly designed to output the same hash, but this would drastically mitigate the vulnerability of deploying a persistent backdoor process that dependently executes at runtime.