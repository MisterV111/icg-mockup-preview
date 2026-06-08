# Form Auto-Reply Security — Cloudflare Turnstile

**Why this exists:** the contact + toolkit forms send a branded auto-reply email
via Google Apps Script (GAS). The old setup exposed an open `doGet` endpoint —
a plain URL hit triggered an email send — so bots abused it to mail fake
addresses, flooding `info@` with bounce notices (diagnosed 2026-06-08).

**The fix:** every send is now gated behind a **Cloudflare Turnstile** token that
GAS verifies server-side *before* sending. The `doGet` send path is removed; sends
happen only via `doPost` with a valid token.

---

## Architecture

```
Visitor submits form
   │
   ├─► Formspree  ........... captures the lead, emails YOU the notification
   │
   └─► Google Apps Script ... sends the branded auto-reply to the visitor,
                              ONLY IF the Cloudflare Turnstile token verifies
```

- **Site key** (public) lives in the page HTML: `data-sitekey="…"` on each
  `.cf-turnstile` widget.
- **Secret key** (private) lives ONLY in each GAS project's Script Properties as
  `TURNSTILE_SECRET`. It is never committed to this repo.

Two GAS projects, two web-app URLs:
| Project | Handles | Web-app id starts |
|---|---|---|
| ICG Auto Reply | contact form | `AKfycbzB…` |
| ICG Toolkit Auto-Reply | toolkit download | `AKfycbyB…` |

---

## Deploy steps (do BOTH projects)

For **each** project — "ICG Auto Reply" and "ICG Toolkit Auto-Reply":

1. Open the project at [script.google.com](https://script.google.com).
2. Replace the code in `Code.gs` with the matching file from this repo:
   - ICG Auto Reply → `gas-code-v3-simple.js`
   - ICG Toolkit Auto-Reply → `gas-toolkit-autoreply.js`
3. **Project Settings** (gear icon) → **Script Properties** → **Add script property**:
   - Property: `TURNSTILE_SECRET`
   - Value: *your Cloudflare Turnstile secret key*
   - Save.
4. **Deploy → Manage deployments** → click the pencil on the active web app →
   **Version: New version** → **Deploy**.
   - ⚠️ Edit the EXISTING deployment (don't create a new one) so the `/exec` URL
     the website calls stays the same.
   - Execute as: **Me**. Who has access: **Anyone**.

## Then deploy the website

Push this repo to GitHub (Pages auto-deploys to inspiredcreativegroupinc.com).
The forms now render the Turnstile widget and POST the token to GAS.

## Test it

1. Visit the live contact form, fill it with your own email, submit.
2. You should: see the success state, receive the Formspree notification, and
   receive the branded auto-reply at the address you entered.
3. Sanity-check abuse is dead: hit a `…/exec` URL directly in a browser. It must
   return `{"status":"ok","message":"… is active"}` and send NO email.

## Recovery note

If auto-replies stop, check (a) `TURNSTILE_SECRET` is set in Script Properties,
(b) the Turnstile widget's allowed hostnames include the live domain, (c) the GAS
deployment was redeployed as a new version after the code change.
