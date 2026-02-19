// ═══════════════════════════════════════════════════════
// UPDATED doGet — replace existing doGet in your GAS project.
// Now handles both contact form AND toolkit auto-replies.
// ═══════════════════════════════════════════════════════

function doGet(e) {
  // Health check
  if (!e.parameter.to_email && !e.parameter.email) {
    return ContentService.createTextOutput(JSON.stringify({status: 'ok', message: 'ICG Auto-Reply is active'}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Route: toolkit download auto-reply
    if (e.parameter.action === 'toolkit') {
      return sendToolkitReply(e.parameter.email);
    }

    // Route: contact form auto-reply (existing)
    return sendReply(e.parameter.first_name, e.parameter.to_email, e.parameter.service, e.parameter.timeline, e.parameter.budget);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
