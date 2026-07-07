const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Ensure SMTP authentication credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not set. Please configure SMTP_USER and SMTP_PASS in your server/.env file to send real emails.');
    return { success: false, mock: true };
  }

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // True for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Prevents local self-signed certificate blocking issues
    }
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'Resume AI'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📬 Real email sent successfully:', info.messageId);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
