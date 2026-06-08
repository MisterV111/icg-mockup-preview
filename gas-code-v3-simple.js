// ═══════════════════════════════════════════════════════════════
// ICG CONTACT FORM Auto-Reply — Google Apps Script
// Project: "ICG Auto Reply"   (web app id begins AKfycbzB…)
//
// SECURITY (2026-06-08): every send is gated behind a Cloudflare
// Turnstile token that is verified server-side BEFORE any email is
// sent. The old open `doGet` send path has been REMOVED — bots were
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
  return jsonOut({ status: 'ok', message: 'ICG Auto-Reply is active' });
}

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var token = p['cf-turnstile-response'] || '';
    var email = p.to_email || p.email || '';

    if (!verifyTurnstile(token)) {
      return jsonOut({ status: 'rejected', reason: 'failed_verification' });
    }
    if (!isValidEmail(email)) {
      return jsonOut({ status: 'rejected', reason: 'invalid_email' });
    }
    return sendReply(p.first_name, email, p.service, p.timeline, p.budget);
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
  // belt-and-suspenders: reject tokens solved on a hostname we don't own
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
function sendReply(firstName, email, service, timeline, budget) {
  firstName = firstName || 'there';
  service = service || 'Not specified';
  timeline = timeline || 'Not specified';
  budget = budget || 'Not specified';

  var subject = "Thanks for reaching out, " + firstName + " — we got your message";

  var htmlBody = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;max-width:600px;line-height:1.6;">'
    + '<p>Hi ' + firstName + ',</p>'
    + '<p>Thanks for getting in touch with Inspired Creative Group. We\'ve received your inquiry and wanted to confirm the details:</p>'
    + '<p style="margin:20px 0;padding:16px 20px;background:#f7f7f7;border-left:3px solid #c0392b;border-radius:4px;">'
    + '<strong>Service:</strong> ' + service + '<br>'
    + '<strong>Timeline:</strong> ' + timeline + '<br>'
    + '<strong>Budget:</strong> ' + budget
    + '</p>'
    + '<p><strong>Here\'s what happens next:</strong></p>'
    + '<ol style="padding-left:20px;">'
    + '<li>We\'ll review your project details within the next 24 hours</li>'
    + '<li>A team member will reach out to schedule a free discovery call</li>'
    + '<li>We\'ll discuss your vision and how we can bring it to life</li>'
    + '</ol>'
    + '<p>In the meantime, feel free to reply to this email with any additional details — reference files, inspiration, or anything that helps us understand your project better.</p>'
    + '<p>Looking forward to connecting,</p>'
    + '<p><strong>The ICG Team</strong><br>'
    + '<span style="color:#666;font-size:13px;">Inspired Creative Group Inc.</span><br>'
    + '<span style="color:#666;font-size:13px;">inspiredcreativegroupinc.com</span></p>'
    + '</div>';

  GmailApp.sendEmail(email, subject,
    'Hi ' + firstName + ', thanks for reaching out to Inspired Creative Group. We received your inquiry (Service: ' + service + ', Timeline: ' + timeline + ', Budget: ' + budget + '). We will review your details and reach out within 24 hours to schedule a free discovery call. Reply to this email with any additional details. — The ICG Team',
    {
      htmlBody: htmlBody,
      name: 'Inspired Creative Group',
      replyTo: 'info@inspiredcreativegroupinc.com'
    }
  );

  return jsonOut({ status: 'ok' });
}
