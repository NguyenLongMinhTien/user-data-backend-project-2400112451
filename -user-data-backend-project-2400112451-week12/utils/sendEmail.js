const nodemailer = require('nodemailer');

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
  host:
    process.env.SMTP_HOST || process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT || process.env.MAILTRAP_PORT || 2525),
  auth: {
    user: process.env.SMTP_USER || process.env.MAILTRAP_USER || '',
    pass: process.env.SMTP_PASS || process.env.MAILTRAP_PASS || '',
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
