# Upgrade Notes

This document summarizes the updates made to the site dependencies and the status of pending PRs.

## PR #317 - Phonetrack Article ✅ COMPLETED

The phonetrack article from PR #317 has been successfully integrated into this branch. The article provides a guide on how to import Google Location History data into Phonetrack/Nextcloud.

**File added:** `src/posts/importer-google-location-phonetrack.md`

## PR #321 - Site Rework ⚠️ CANNOT BE MERGED

PR #321 is a major rework of the site from February 2022. Unfortunately, this PR:
- Has merge conflicts with the current main branch
- Contains 21 commits with 9,656 additions and 7,863 deletions across 204 files
- Is marked as "dirty" and not mergeable by GitHub
- Would require significant manual conflict resolution

**Recommendation:** The changes in PR #321 are too extensive and outdated to merge cleanly. It would be better to cherry-pick specific features from that PR if needed, or close the PR and create new, focused PRs for individual improvements.

## Dependency Updates Completed

### Major Version Updates
- **Eleventy:** v2.0.1 → v3.1.2
  - Updated RSS feed filters: `rssLastUpdatedDate` → `getNewestCollectionItemDate | dateToRfc3339`
  - Updated date filters: `rssDate` → `dateToRfc3339`
- **Rollup:** v3.29.5 → v4.52.4
- **@rollup/plugin-commonjs:** v25.0.2 → v28.0.8
- **@rollup/plugin-node-resolve:** v15.1.0 → v16.0.3
- **Prettier:** v2.8.8 → v3.6.2
- **Concurrently:** v8.2.0 → v9.2.1
- **cross-env:** v7.0.3 → v10.1.0
- **jsdom:** v22.1.0 → v27.0.0
- **html-validate:** v8.0.5 → v10.1.2
- **markdown-it-anchor:** v8.6.7 → v9.2.0

### Minor/Patch Updates
- **@11ty/eleventy-plugin-rss:** v1.2.0 → v2.0.4
- **@11ty/eleventy-plugin-syntaxhighlight:** v5.0.0 → v5.0.2
- **sass:** v1.63.6 → v1.93.2
- **semver:** v7.5.3 → v7.7.3
- Many other dependencies updated via `npm update`

### Security Updates
- Fixed all 23 npm security vulnerabilities
- Removed unused `html-minifier` package (had a high severity vulnerability)
- Updated `make-dir-cli` to v4.0.0 to fix `trim-newlines` vulnerability

### Not Updated
- **image-size:** Kept at v1.2.1 (v2.0.2 available but requires code changes for new API)

## Known Issues

### Sass Deprecation Warnings
The build produces deprecation warnings about Sass `@import` rules and global built-in functions. These will need to be addressed when migrating to Dart Sass 3.0.0, but they are not blocking issues currently:
- `@import` should be replaced with `@use`/`@forward`
- Global `map-get()` should be replaced with `map.get()`

**Note:** These warnings come from the stalfos dependency which is a third-party library loaded from GitHub. A full migration would require updating the stalfos library or forking it.

## Site Performance

- Build time: ~2.2 seconds for 63 files
- CSS size: 17KB (compressed)
- Total dist size: 19MB
- All existing security headers in place (CSP, HSTS, etc.)

## Testing

- ✅ All builds complete successfully
- ✅ Site generates 63 HTML files
- ✅ RSS feed working correctly
- ✅ Sitemap generated properly
- ✅ No security vulnerabilities detected
- ✅ CodeQL security check passed
