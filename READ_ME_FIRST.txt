SIP REALITY CHECK — RELIABILITY FIX (Nov 5, 2026)

WHAT IS FIXED:
- Live Gemini request remains the primary experience.
- Transient 503/429/5xx/network failures get bounded automatic retries.
- If Gemini is still unavailable, the app shows useful, explicitly labeled
  "Guided reflection · AI temporarily unavailable" questions and user-reported
  facts. It does NOT pretend this content came from AI.
- An invalid or unsafe AI response does not reach users.
- If even the Netlify function is unreachable, the frontend can show a clearly
  labeled minimal guided reflection.
- AI mode still labels its safety gate as limited; no claims of perfect accuracy.

HOW TO REPLACE YOUR EXISTING GITHUB PROJECT IN ONE COMMIT:
1. Download this ZIP and choose Extract All.
2. Open the extracted folder with index.html and netlify.toml visible.
3. On github.com/ShreyaKoujalagi/sip-reality-check, click Add file -> Upload files.
4. Upload the CONTENTS of this extracted folder (not the ZIP or outer folder),
   including the netlify folder. The paths should begin app.js, index.html,
   styles.css, netlify.toml, and netlify/functions/reflect.cjs.
5. Commit the files once. Netlify should automatically deploy from main.
   If GitHub prevents replacing existing filenames using this interface,
   replace just app.js and netlify/functions/reflect.cjs using GitHub's pencil
   editor or another Git client; do not create duplicate files or folders.
6. In Netlify, verify deployment status is Published. Keep your existing
   GEMINI_API_KEY (secret) and GEMINI_MODEL (gemini-3.5-flash-lite).
7. Test the same negative-returns input at https://sip-reality-check.netlify.app
   and observe the status above the reflection:
   - "AI reflection checked..." = model-generated answer, passed local checks.
   - "Guided reflection · AI temporarily unavailable" = a limited, non-AI fallback.
8. In Netlify Functions -> reflect, you can see status and attempt number,
   but no raw user text, API key, or provider response body is logged.

TESTED OFFLINE: 29 automated checks covering model success, transient outage,
format failure, safety-gate failure, network failure, and guided fallback.
NOT TESTED: a real live Gemini call using your private key or the new deployment.

SAFETY: This is an educational prototype, not a regulated investment adviser.
It does not read Groww accounts or verify performance. The rule-based checks are
limited; model outputs can still be incorrect. Do not collect real financial
identifiers. A temporary provider failure may still result in guided rather than
AI-generated output, which must not be reported as successful AI inference.
