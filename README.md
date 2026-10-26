# ADS COMMAND — macOS Apple Silicon

Electron desktop **foundation** for a TikTok-first Spotify playlist promotion agency.

## Current functionality
- Create client campaigns with a Spotify playlist URL.
- Split customer budgets 70% ad spend / 30% management fee.
- Record file names of user-supplied creatives (files **are not persisted yet**).
- Enter cumulative TikTok spend manually.
- Log Spotify playlist save counts manually.
- Stop/restart campaigns **locally** and add manual budget records.
- Export data to JSON.
- macOS arm64 DMG/ZIP build workflow and GitHub update hooks.

**This does not yet publish or pause actual TikTok ads, collect payment, call OpenAI or autonomously optimize campaigns.** Save growth is not proven ad-attributed.

## Run on Mac
Install Node.js 22+, clone repository and run:
```bash
npm install
npm start
```
To package locally: `npm run dist:mac`.

## Build a downloadable Mac test installer
Go to GitHub **Actions → macOS ARM64 Release → Run workflow**. After completion, download the build artifact containing the unsigned .dmg and .zip. macOS Gatekeeper may block unsigned apps; do not disable system protection indiscriminately. For distribution and automatic updates, configure an Apple Developer ID certificate, hardened runtime and notarization. The workflow currently creates draft releases on a `v*` tag; do not release as production before signing and testing.

## Secrets and security
Never commit OpenAI or TikTok secrets, customer data, or payment credentials. Production integration requires a secure backend, API authorization, logging, spend guardrails and safe credential storage.

## v1 integration milestones
1. Real creative file storage and preview.
2. OAuth-backed TikTok Business API connection and read-only reporting.
3. Test-mode campaign creation with explicit budget approvals.
4. Controlled publishing, monitoring and pause operations.
5. Reliable Spotify save checkpoints and attribution estimates.
6. OpenAI-powered recommendations backed by verified results.
7. Signed/notarized updates and cloud-based background jobs.

## Windows x64 test installer
Open [GitHub Actions](https://github.com/lukemoremusic/ads-command/actions/workflows/windows-build.yml), select **Windows Installer → Run workflow → main**. After the job completes, download the **ADS-COMMAND-Windows-x64** artifact and unpack it. Run the included `ADS-COMMAND-Setup-1.0.0-x64.exe`. It is currently unsigned, so Windows SmartScreen may warn. Verify the origin before running and do not disable security protections globally.

For local Windows development, install Node.js 22+, then run `npm install`, `npm start`, or `npm run dist:win` to produce the installer. The app's data is local to each machine: it does not sync between Windows and Mac yet. Automatic updates are not production-ready until a trusted signing and release process is established.


## v1.1.0 — TikTok integration preparation
- New **TikTok Connect** tab showing actual readiness; connection disabled until app verification, backend OAuth callback and API authorization.
- **Creative images imported into persistent app data** using a native file picker. Only image filenames and generated IDs are stored in campaign records. Files are stored per machine in the Electron user data directory. Import currently does NOT upload creatives to TikTok or sync them to the cloud.
- No OpenAI integration and no live ad creation yet. This release is **not** a fully autonomous ad manager.
- To build Windows use **GitHub Actions → Windows Installer → Run workflow** on main. Builds are not automatically pushed to already-installed apps unless a release/update publishing pipeline is configured.
