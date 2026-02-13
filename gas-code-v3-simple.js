function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return sendReply(data.first_name, data.to_email, data.service, data.timeline, data.budget);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (!e.parameter.to_email) {
    return ContentService.createTextOutput(JSON.stringify({status: 'ok', message: 'ICG Auto-Reply is active'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    return sendReply(e.parameter.first_name, e.parameter.to_email, e.parameter.service, e.parameter.timeline, e.parameter.budget);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

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

  return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
