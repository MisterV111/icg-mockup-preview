// ═══════════════════════════════════════════════════════════════
// ICG TOOLKIT Auto-Reply — Google Apps Script
// Project: "ICG Toolkit Auto-Reply"  (web app id begins AKfycbyB…)
// Sends the toolkit-download confirmation email.
//
// SECURITY (2026-06-08): every send is gated behind a Cloudflare
// Turnstile token verified server-side BEFORE any email is sent.
// The old open `doGet` send path has been REMOVED — bots were
// hammering it to mail fake addresses, flooding info@ with bounces.
//
// ── ONE-TIME SETUP ─────────────────────────────────────────────
// 1. Apps Script editor → Project Settings (gear) → Script Properties
//    → Add property:
//        TURNSTILE_SECRET = <your Cloudflare Turnstile SECRET key>
// 2. Deploy → Manage deployments → (edit the existing web app) →
//    Version: "New version" → Deploy.  Keep the SAME deployment so
//    the /exec URL the website calls does not change.
// 3. Execute as: Me.  Who has access: Anyone.
// ═══════════════════════════════════════════════════════════════

var ALLOWED_HOSTS = [
  'inspiredcreativegroupinc.com',
  'www.inspiredcreativegroupinc.com',
  'localhost'
];

// doGet is now a HEALTH CHECK ONLY. It never sends email.
function doGet(e) {
  return jsonOut({ status: 'ok', message: 'ICG Toolkit Auto-Reply is active' });
}

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var token = p['cf-turnstile-response'] || '';
    var email = p.email || p.to_email || '';

    if (!verifyTurnstile(token)) {
      return jsonOut({ status: 'rejected', reason: 'failed_verification' });
    }
    if (!isValidEmail(email)) {
      return jsonOut({ status: 'rejected', reason: 'invalid_email' });
    }
    return sendToolkitReply(email);
  } catch (error) {
    return jsonOut({ status: 'error', message: error.toString() });
  }
}

// ── Cloudflare Turnstile server-side verification ───────────────
function verifyTurnstile(token) {
  if (!token) return false;
  var secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) return false; // fail CLOSED if not configured

  var resp = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });
  var outcome = JSON.parse(resp.getContentText());
  if (!outcome.success) return false;
  if (outcome.hostname && ALLOWED_HOSTS.indexOf(outcome.hostname) === -1) return false;
  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── The branded confirmation email (unchanged) ──────────────────
function sendToolkitReply(email) {
  var downloadUrl = 'https://www.inspiredcreativegroupinc.com/assets/downloads/ai-image-toolkit-2026.zip';

  var subject = "Your AI Image Toolkit is ready";

  var htmlBody = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;max-width:560px;line-height:1.7;">'

    + '<p>Hey — thanks for grabbing the toolkit.</p>'

    + '<p>In case your browser blocked the download, here\'s a direct link:</p>'

    + '<p style="margin:20px 0;">'
    + '<a href="' + downloadUrl + '" '
    + 'style="display:inline-block;padding:12px 24px;background:#E8000D;color:#ffffff;'
    + 'text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;">'
    + 'Download the Toolkit'
    + '</a>'
    + '</p>'

    + '<p><strong>What\'s inside:</strong></p>'
    + '<ul style="padding-left:20px;color:#555;">'
    + '<li>The <strong>Image Prompt Engineer</strong> skill — works with ChatGPT, Claude, Gemini, and any LLM</li>'
    + '<li>Real photography parameters mapped across 6 AI models — film stocks, lenses, lighting setups</li>'
    + '<li>Anti-AI realism recipes that make generated images look authentically photographic</li>'
    + '<li>A 14-page PDF companion guide with model comparisons and techniques</li>'
    + '</ul>'

    + '<p>This is one piece of a 40+ agent system we built for creative production. '
    + 'If you\'re curious what that looks like at scale — video, music, design, and strategy '
    + 'all working together — I\'d love to show you.</p>'

    + '<p style="margin:20px 0;">'
    + '<a href="https://www.inspiredcreativegroupinc.com/partners.html#partners-contact" '
    + 'style="color:#E8000D;font-weight:bold;text-decoration:none;">'
    + 'Schedule a discovery call →'
    + '</a>'
    + '</p>'

    + '<p>Cheers,<br>'
    + '<strong>Juan Carlos Valencia</strong><br>'
    + '<span style="color:#888;font-size:13px;">Inspired Creative Group Inc.</span></p>'

    + '</div>';

  var plainBody = 'Thanks for grabbing the toolkit.\n\n'
    + 'Download link: ' + downloadUrl + '\n\n'
    + 'What\'s inside:\n'
    + '- The Image Prompt Engineer skill (works with ChatGPT, Claude, Gemini, any LLM)\n'
    + '- Real photography parameters mapped across 6 AI models\n'
    + '- Anti-AI realism recipes for authentically photographic results\n'
    + '- A 14-page PDF companion guide\n\n'
    + 'This is one piece of a 40+ agent system we built for creative production. '
    + 'If you\'re curious what that looks like at scale, I\'d love to show you.\n\n'
    + 'Schedule a call: https://www.inspiredcreativegroupinc.com/partners.html#partners-contact\n\n'
    + 'Cheers,\nJuan Carlos Valencia\nInspired Creative Group Inc.';

  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    name: 'Juan Carlos Valencia',
    replyTo: 'info@inspiredcreativegroupinc.com'
  });

  return jsonOut({ status: 'ok' });
}


// ═══════════════════════════════════════════════════════════════
// TEST FUNCTION — run directly in the Apps Script editor to preview
// the email without going through the form. Change the address first.
// ═══════════════════════════════════════════════════════════════
function testToolkitReply() {
  sendToolkitReply('juan@inspiredcreativegroupinc.com');
  Logger.log('Test email sent!');
}
