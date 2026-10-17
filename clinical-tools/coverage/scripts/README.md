# Official coverage revision checks

Run from a repository checkout with Python 3 (standard library only):

    python clinical-tools/coverage/scripts/check_revision.py --cache /tmp/coverage-revision-cache

The script follows the rule's **dynamic Korean-name URL**, fetches current metadata and all current annex/form originals, validates file signatures, and compares SHA-256 hashes against `revision/applied.json`. It uses conditional HTTP headers when provided and a local cache; it never downloads all historical editions. MOHW title-filtered notice rows and stable text previews are independently compared with `secondary-baseline.json`; notices, Q&A/guidance, and proposals have separate classifications. HIRA is a contextual cross-check, not a claimed comprehensive daily source.

Commit only the script's outputs under `clinical-tools/coverage/revision/` after each check. The script never edits applied.json, secondary-baseline.json, data.json, annex tables, search records, or source-manifest. An unchanged run updates timestamps/history only. Failure retains the previous successful timestamp; partial secondary failure is labeled partial and cannot establish no-change across all sources.

If latest-check.json has notifyChange=true, report the changed metadata/attachments or supplemental source to the owner and request approval. Repeat the same pending finding only when new evidence changes it. Never treat observation, a new effective date, or successful download as permission to apply. New originals and comparison reports are preserved under revision/pending/<fingerprint> for review. Public files contain public official legal sources only; caches and credentials must not be committed.

After explicit owner approval, a separate reviewed process must update the clinical extraction, tables, original downloads, applied baseline, and effective version together and run regression/source verification before publishing. This checker deliberately contains no apply command.

Tests: python clinical-tools/coverage/scripts/test_revision.py

The status header links original downloads and version history. Status JSON and check-history.json are independently readable. Keep the current site assets and all existing table views untouched when committing check outputs. Deploy through the site's existing GitHub Pages workflow and verify the exact public status after it finishes.
