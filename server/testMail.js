import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting SMTP test...');
console.log('Environment variables check:', {
  hasEmailUser: !!process.env.EMAIL_USER,
  hasEmailPassword: !!process.env.EMAIL_PASSWORD,
  hasClientUrl: !!process.env.CLIENT_URL
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});

console.log('Testing SMTP connection...');

// First verify the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
  } else {
    console.log('SMTP server is ready to send messages');
    console.log('Success response:', success);

    // If verification successful, send a test email
    const mailOptions = {
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to: '173jaiminradia@gmail.com',
      subject: 'Test Email from SnookerPlay',
      html: `
        <h1>This is a test email</h1>
        <p>If you receive this, the email system is working correctly.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send test email:', {
          message: error.message,
          stack: error.stack,
          code: error.code,
          command: error.command
        });
      } else {
        console.log('Test email sent successfully:', info.response);
      }
    });
  }
}); 