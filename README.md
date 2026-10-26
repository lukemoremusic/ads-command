# ADS COMMAND

Windows desktop app for managing Spotify playlist promotion campaigns, initially focused on TikTok Ads.

## Status
Early prototype (v0.2). Campaign creation and budget tracking are local-only. There is no live TikTok Ads publishing, OpenAI analysis or payment processing yet.

## Intended workflow
1. Register client, playlist URL and total budget.
2. Allocate 30% agency fee and 70% ad budget.
3. Upload user-produced two-image creatives.
4. Test creatives using a limited budget (after TikTok integration).
5. Record daily playlist saves manually, with clear attribution caveats.
6. Review results, optimize and either stop or add budget.

## Desktop updates
Use Electron/electron-updater with GitHub Releases after publishing a signed or appropriately tested Windows installer. Do not commit tokens, API secrets or customer data.

The full desktop source needs to be added to this repository before it can build releases.
