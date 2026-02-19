// ═══════════════════════════════════════════════════════
// ICG Toolkit Auto-Reply — Google Apps Script
// Sends a confirmation email when someone downloads
// the Image Prompt Engineer toolkit via lead magnet form.
//
// Deployment: Add as a new function in the EXISTING
// GAS project (same one as contact form auto-reply).
// ═══════════════════════════════════════════════════════

/**
 * Called from the partners page after Formspree submission.
 * Uses doGet with ?action=toolkit&email=... to distinguish
 * from contact form auto-replies.
 */
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

  return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}


// ═══════════════════════════════════════════════════════
// TEST FUNCTION — Run this directly in Apps Script editor
// to preview the email WITHOUT using Formspree.
// Change the email address to your own.
// ═══════════════════════════════════════════════════════
function testToolkitReply() {
  sendToolkitReply('juan@inspiredcreativegroupinc.com');
  Logger.log('Test email sent!');
}
