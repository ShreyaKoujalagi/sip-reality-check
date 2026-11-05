SIP REALITY CHECK — RETURNING VISIT + DECISION CLARITY RELEASE

This package combines the last full MVP with the latest guardrail correction and adds:
1. Optional consent-based 'Remember my starting point' stored ONLY in this browser's localStorage.
2. Returning visits: starting-point question is hidden and reused automatically; Edit and Forget controls remain visible.
3. An 'I'm not sure why I started' shortcut; no invented original goal.
4. 'Your Way Forward': one neutral, contextual understanding/verification step for financial pressure, payment failure, direct advice requests, guarantees, uncertain goals, performance, or other concerns.
5. Simple 'Do you feel clearer?' choice. Feedback is NOT sent, stored, or counted by this prototype. It is an interaction demonstration, not an analytics system.
6. Reflection text download now includes the next step.

IMPORTANT HONEST LIMITATIONS
- This is not a Groww integration. Starting points do not sync across browsers/devices.
- No account, verified investment data, or transaction status is accessed.
- LocalStorage is opt-in only; saved data may be accessible to others sharing the same browser profile; delete with Forget.
- The current concern and results are sent to the AI service for processing; they are not saved as a conversation by this prototype. Provider terms apply.
- Your Way Forward is a conservative, contextual rule-generated action, not a financial recommendation or fund-selection output.
- 'Do you feel clearer?' is not stored; no measurable adoption/clarity metric can be claimed from this prototype.
- AI availability is dependent on provider and may fall back to clearly labeled non-AI guided mode.
- Automated tests cannot replace live testing with the connected Gemini key.

DEPLOY
In your EXISTING Github repo sip-reality-check, replace root index.html, app.js, styles.css and netlify/functions/reflect.cjs. Preserve netlify.toml and your Netlify environment variables (GEMINI_API_KEY and GEMINI_MODEL). GitHub's web upload may reject overwriting files; edit existing files or use the GitHub desktop/git workflow. Once committed, Netlify redeploys automatically.

ACCEPTANCE CHECK
A. Clear site data or use private window. Enter 'I am not sure why I started my SIP'; check 'Remember my starting point'; submit a concern. On reload, the starting point is shown rather than asked again. Edit and Forget work.
B. Test negative returns -> 'Your Way Forward' tells you what to verify, never to buy/sell/continue.
C. Test rising expenses -> next step prioritizes budget/affordability, not generic returns.
D. Test payment failure -> check the bank/app status, no invented reason.
E. Test direct fund-advice request -> no fund recommendation; neutral next step.
F. Test AI green response and a provider failure yellow fallback; both should have a next step.

CLOSING HELP UPDATE: New general-information section after reflection. Selecting Partly or Not yet reveals three optional help routes; links to official SEBI investment adviser register and Groww support. No user inputs, personal worries, or clarity choices are transmitted by those links. All explanations use transparent predefined content and do not imply live portfolio access.
