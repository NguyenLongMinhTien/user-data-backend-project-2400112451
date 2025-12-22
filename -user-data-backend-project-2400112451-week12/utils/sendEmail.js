const nodemailer = require('nodemailer');

// Mailtrap credentials copied from dashboard (replace pass with your actual value)
const MAILTRAP_CREDENTIALS = {
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  user: 'd436ef15ef05f9',
  // NOTE: The screenshot shows a masked password (****7e91). Replace below with your real Mailtrap password
  pass: process.env.MAILTRAP_PASS || process.env.SMTP_PASS || 'REPLACE_WITH_MAILTRAP_PASS',
};

/**
 * sendEmail helper using Nodemailer.
 * Designed for Mailtrap Email Sandbox in development/testing.
 * Configure via environment variables:
 * - SMTP_HOST / MAILTRAP_HOST (default: sandbox.smtp.mailtrap.io)
 * - SMTP_PORT / MAILTRAP_PORT (default: 2525)
 * - SMTP_USER / MAILTRAP_USER
 * - SMTP_PASS / MAILTRAP_PASS
 * - FROM_EMAIL (optional)
 */
const transporter = nodemailer.createTransport({
  host: MAILTRAP_CREDENTIALS.host,
  port: MAILTRAP_CREDENTIALS.port,
  auth: {
    user: MAILTRAP_CREDENTIALS.user,
    pass: MAILTRAP_CREDENTIALS.pass,
  },
});

/**
 * Sends an email via configured transporter.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject line
 * @param {string} [params.html] - HTML body (preferred)
 * @param {string} [params.text] - Plain text body
 * @param {string} [params.from] - Sender email (defaults to FROM_EMAIL or 'no-reply@example.com')
 * @returns {Promise<Object>} Nodemailer info object
 */
async function sendEmail({ to, subject, html, text, from }) {
  if (!to || !subject || (!html && !text)) {
    throw new Error('sendEmail requires to, subject, and html or text');
  }

  const mailOptions = {
    from: from || process.env.FROM_EMAIL || 'no-reply@example.com',
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendEmail, transporter };
