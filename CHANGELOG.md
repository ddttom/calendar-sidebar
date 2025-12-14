# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created `meeting.ics` file for upcoming user meeting.
- Added `*.ics` to `.gitignore`.
- Added GitHub Action workflow (`.github/workflows/lint.yml`) for automated linting on push/PR.
- Added `lint` script to `package.json`.
- Added `eslint.config.js` for ESLint v9+ configuration.

### Fixed
- Updated `README.md` and `SETUP.md` to reference the correct project root directory instead of `upcoming-events-extension`.
- Fixed broken Google Cloud Console link in `SETUP.md`.
