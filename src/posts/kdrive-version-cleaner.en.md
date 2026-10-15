---
title: 'kdvc: cleaning up old versions on a kDrive'
tags:
  - projet
  - rust
  - infomaniak
date: "2026-10-15"
draft: true
metaDesc: My kDrive kept filling up on its own. The culprit was old file versions, which the web interface can neither measure nor delete in bulk.
excerpt: My kDrive kept filling up on its own. The culprit was old file versions, which the web interface can neither measure nor delete in bulk.
noToc: false
---

[Sources (Github)](https://github.com/sylvainmetayer/kdrive-version-cleaner) [Latest release](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest)

## The idea

My [kDrive](https://www.infomaniak.com/en/kdrive) kept filling up, even though I was hardly adding anything to it. After a bit of digging, the culprit showed up quickly: **old versions** of files. Every time a file changes, kDrive keeps a copy of the previous version. That's very handy to go back in time, much less so when a file edited every day ends up weighing several times its own size.

<!-- TODO Sylvain: real figure -->
In total, these versions took up XX GB on my drive.

The problem: Infomaniak's web interface doesn't show which folders are affected, and only lets you delete versions one at a time, file by file. 😩

However, Infomaniak provides an [API](https://developer.infomaniak.com/docs/api) to list files and their versions, and to delete them. Good enough for a small tool!

## kdvc

`kdvc` (for _kDrive Version Cleaner_) is a small terminal application, written in [Rust](https://www.rust-lang.org/) with [ratatui](https://ratatui.rs/). It scans the drive once, keeps the file tree in a local SQLite cache, then shows:

- global statistics: number of files, space used by old versions;
- a file explorer, with the versions' size summed up per folder;
- the files whose versions take up the most space;
- a search by name, extension, size or number of versions;
- the deletion log, which can be exported to CSV.

To clean up, you select a file or a folder and pick a rule: keep the last N versions, delete those older than X days, or delete everything except the current version.

## Deleting, yes, but carefully

A tool that deletes data in bulk deserves a few safeguards. Here are the ones I set for myself:

- **The current version is never deleted.** The API normally only returns old versions, but the tool checks that the list exactly matches what the scan saw. At the slightest doubt, the most recent one is protected: worst case, one extra version is kept.
- **Versions marked "keep forever" are never touched.**
- **Every deletion goes through a preview**, listing the affected versions and the space freed, then through a confirmation where you have to type `oui`.
- Versions are deleted **one at a time**, and each deletion is written to the log, whether it succeeded or not.
- A deletion is **never retried** after a timeout: the server may have applied it.

The API is also limited to 60 requests per minute. The tool spaces out its calls, and shows an estimated time remaining while scanning and loading versions.

## Written with a coding agent

<!-- TODO Sylvain: rephrase with your own take -->
This project was also an experiment: I built it with a coding agent ([Claude Code](https://www.anthropic.com/claude-code)), in two days. My role was mostly to set the rules, then review.

The rules live in an [AGENTS.md](https://github.com/sylvainmetayer/kdrive-version-cleaner/blob/main/AGENTS.md) file: architecture, conventions, and above all the safety invariants above, which must never be broken. Any change to the deletion rules must come with tests, and end-to-end runs go against a fake server, never against my real drive.

The code then went through nine successive code reviews, each one fixing its share of edge cases (pagination, a folder renamed during a scan, network errors…). CI does the rest: tests on Linux, macOS and Windows, clippy, coverage, cargo-deny, CodeQL and SonarQube Cloud.

## Installation

The easiest way is through [mise](https://mise.jdx.dev):

```sh
mise use -g github:sylvainmetayer/kdrive-version-cleaner
```

Binaries for Linux, macOS and Windows are also available on the [releases page](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest), with their SHA-256 checksum and a provenance attestation.

You'll then need to create an [Infomaniak API token](https://manager.infomaniak.com/v3/ng/profile/user/token/list) with the `drive` scope (and `accounts` so the tool finds your accounts on its own), then export it as `KDRIVE_TOKEN`. The [README](https://github.com/sylvainmetayer/kdrive-version-cleaner#readme) covers the rest. Note that the tool's interface is in French.

The project's sources are available on [Github](https://github.com/sylvainmetayer/kdrive-version-cleaner).
