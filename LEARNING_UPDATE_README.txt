SIP REALITY CHECK — LEARN BEFORE YOU DECIDE UPDATE

WHAT CHANGED
After "Partly" or "Not yet", visitors still see the existing assistance options
(Explain simply / What should I check? / I need personal guidance).
They now also see "Learn Before You Decide" with three choices:
- Quick read: 3 brief concern-specific points and a practical takeaway
- Watch a video: a relevant topic suggestion with a link to SEBI's official video library
- Maybe later: a reassuring exit, with no pressure to take action

Topics matched from their current concern: market returns, affordability,
failed payments, unclear starting goal, or general SIP basics.
No user details are appended to educational links and no learning choices are
stored or sent to the AI backend.

DEPLOY (NETLIFY)
Upload the ZIP by dragging it into Netlify's manual deploy area. If updating
an existing Netlify site, deploy to that SAME site to keep its URL.
Retain your existing Gemini API environment-variable configuration for AI mode.
Without the key, the website still provides its clearly labeled guided fallback.

IMPORTANT
Links go to official SEBI education pages, AMFI educational pages, or Groww
support. The SEBI video link goes to the topic library, not a specific playable
video; users select a video there. Resources are general education only.

TEST
Run `node tests/run-tests.cjs`, `node tests/closing-help-tests.cjs`,
`node tests/new-experience-tests.cjs`, and `node tests/learning-corner-tests.cjs`.
These are automated local checks, not live end-user testing or a live Gemini test.
