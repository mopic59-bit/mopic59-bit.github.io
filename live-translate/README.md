# Lecture Note · Live Translate

A static, local-first lecture notebook at https://mopic59-bit.github.io/live-translate/.
Uses the homepage's white/navy/light-blue palette. Does not change the existing homepage or local Whisper app.

## Use

1. Open the site in Chrome, choose **연결 · 사용 안내**, download the bridge ZIP.
2. Unzip it. In `chrome://extensions`, enable Developer mode, load the `Lecture-Note-Bridge` folder, then refresh the site.
3. Choose lecture language and **기록 시작**. In the newly opened Google Translate tab, click its microphone and permit microphone access when prompted.
4. Keep both windows visible. Google may stop microphone input; resume it manually. Near Google's 5,000-character limit, verify capture, clear Google's original text, and restart its microphone.
5. **종료 · 저장** ends collection; turn off Google's microphone separately. Word/TXT export oldest first; PDF uses the browser's print-to-PDF dialog. Library includes rename, recoverable trash, backup and import.

The site is not affiliated with Google. It does not invoke undocumented translation APIs, provide a Google API key, bypass cross-origin restrictions, or save audio files. Audio/text supplied to Google is processed by Google. This website makes no paid API calls. Internet and Google service availability are required.

## Capture behavior

- Extension reads only the visible source `textarea[role=combobox]` and visible translation `span[jsname=W297wb]` in the specific Google tab opened by the active session. These selectors were checked against the live Google page on 2026-10-23. Google DOM changes may break the adapter.
- 800 ms observation, 1.2 s site polling, 15 s application heartbeat lease. Capture is explicit; other Google tabs are ignored. The storage-only extension does not request broad tabs/history/cookie/network permissions.
- Revisions replace the current input block rather than append duplicates. Clearing the Google source starts a new block. Equal sentence counts are paired by position; unequal counts remain a whole block so the tool does not invent sentence-level alignment.
- Stable means unchanged for 2.2 s, **not** a final speech-recognition signal. Missing translations stay tentative. Timestamps are first-observed local time, not real speech time. If sentence alignment changes, timing may use the block's first observation.
- Stop updates local UI immediately, bounds final bridge request to 3 s, preserves the last received state if disconnected, and isolates subsequent session IDs. Google microphone is separate and must be stopped on Google.
- Pausing collection does not pause Google's microphone. Stop Google input too, and clear its input before resuming to avoid capturing cumulative text from the pause interval.
- Data is in browser localStorage, with active capture also in extension local storage. It is not uploaded to GitHub, synchronized across devices, or saved to a server. Export a JSON backup before clearing browser data. Site storage quota failures are shown explicitly.
- Chrome required for the bridge. Other modern browsers can use manual notes and document export; their storage is separate.

## Development / validation

No build step, packages, CDN or API credentials. ES modules and modern browser APIs. `core.mjs` is mirrored into `extension/core.mjs`; keep them identical.

```
node --test live-translate/tests/*.test.mjs
```

Tests cover revisions, reset boundaries, first observation timestamps, ordering, tentative content, ZIP/DOCX structure, worker sender validation, pause/resume, stop, stale tabs, expired leases and new-session isolation. Browser QA checks manual input, newest-first display and reload persistence. Real Mac microphone + installed extension end-to-end validation remains a user-device check; a successful synthetic test is not evidence of real microphone capture.

The extension download is assembled from these versioned source files in the browser using a dependency-free ZIP writer. Word exports are valid OOXML `.docx` ZIPs, not HTML renamed as Word files. PDF uses print styles and the user's Save as PDF destination.
