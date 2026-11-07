# Consolidated accuracy & safety review — 7 November 2026

This release builds on the approved balanced two-stage layout.

## Changes
- AI instructions distinguish cash-buffer constraints from fund market risk.
- AI instructions prohibit inventing a belief that a decline means permanent loss.
- Reject generated reflections matching either error and show the existing clearly-labelled guided worksheet instead.
- Clarify the success banner: automated checks do not verify the user’s investments or guarantee complete accuracy.
- Keep existing context-based resource selection, override selector, Partly/Not yet paths, local starting-point memory and Edit answers.

## Deployment
Upload the contents of this ZIP to the existing GitHub repository root and commit once. Netlify deploys from GitHub. Do not create another Netlify site.

## Manual checks after publication
1. Starting screen shows balanced two columns; submit and verify single wide results view.
2. Enter starting reason `To grow money` and concern `I have less savings and feel scared about a market crash`. Ensure it does not assert that lower savings increases the fund's market volatility, or invent a belief about permanent loss.
3. Try a failed-payment concern and disappointing-returns concern; check learning topic, Quick Read, and video-link behavior.
4. Check Partly and Not yet variations, Edit my answers, Saved starting point, and mobile layout.

Automated checks are not a substitute for manual acceptance tests or independent financial advice. AI outputs are not guaranteed error-free.
