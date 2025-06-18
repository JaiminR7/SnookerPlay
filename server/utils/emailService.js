// emailService.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

// Debug: Check environment variables
console.log('🔍 Environment check:', {
  hasEmailUser: !!process.env.EMAIL_USER,
  hasEmailPassword: !!process.env.EMAIL_PASSWORD,
  emailUser: process.env.EMAIL_USER ? 'set' : 'not set'
});

// ✅ FIXED: Correct method name is createTransport, not createTransporter
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true,
    logger: true
  });
  console.log('✅ Nodemailer transporter initialized successfully');
} else {
  console.log('⚠️ Email credentials not found, email service will not work');
}

// ✅ TEST transporter configuration
const testEmailConfig = async () => {
  try {
    console.log('🔧 Testing nodemailer configuration...');
    if (!transporter) {
      console.error('❌ Transporter not initialized - no credentials');
      return false;
    }
    const verifyResult = await transporter.verify();
    console.log('✅ SMTP verification result:', verifyResult);
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
};

// ✅ Send tournament notification email to all users
export const sendTournamentNotification = async (users, tournament) => {
  try {
    if (!transporter) {
      console.error('❌ Cannot send emails - transporter not initialized');
      return [];
    }

    const emailPromises = users.map(async user => {
      if (!user.email) return null;

      const mailOptions = {
        from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `🏆 New Snooker Tournament: ${tournament.title}`,
        html: `
          <h2>New Tournament Alert!</h2>
          <p>Hello ${user.name || 'Player'},</p>
          <p><strong>${tournament.title}</strong></p>
          <ul>
            <li>Location: ${tournament.location}</li>
            <li>Date: ${new Date(tournament.date).toLocaleDateString()}</li>
            <li>Time: ${tournament.time}</li>
            <li>Fee: ${tournament.registrationFee}</li>
            <li>Prize: ${tournament.prizePool}</li>
          </ul>
          <a href="${process.env.CLIENT_URL}/tournaments/${tournament._id}/register"
             style="background-color: #4CAF50; padding: 10px 20px; text-decoration: none; color: white; border-radius: 5px;">
            Register Now
          </a>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${user.email}:`, info.response);
        return info;
      } catch (error) {
        console.error(`❌ Failed to send to ${user.email}:`, error.message);
        return null;
      }
    });

    const results = await Promise.all(emailPromises);
    return results;
  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    return [];
  }
};

// ✅ Send fixture confirmation
export const sendFixtureConfirmation = async (tournament, fixtures) => {
  if (!transporter) return [];

  const emailPromises = tournament.participants.map(async (participantId) => {
    const participant = await User.findById(participantId);
    if (!participant?.email) return null;

    const participantFixtures = fixtures.filter(f =>
      f.player1.toString() === participantId.toString() ||
      f.player2.toString() === participantId.toString()
    );

    return transporter.sendMail({
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      subject: `🎯 Fixtures: ${tournament.title}`,
      html: `
        <h2>Your Fixtures</h2>
        ${participantFixtures.map(f => `
          <div>
            Match ${f.matchNumber}: ${f.player1.name} vs ${f.player2.name}
          </div><br>
        `).join('')}
        <p>Good luck!</p>
      `
    });
  });

  return Promise.all(emailPromises);
};

// ✅ Simple test mail function
const sendTestEmail = async (to) => {
  if (!transporter) return false;

  try {
    const info = await transporter.sendMail({
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Test Email from SnookerPlay',
      html: `<h1>This is a test email</h1><p>Sent at: ${new Date().toLocaleString()}</p>`
    });

    console.log('✅ Test email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return false;
  }
};

export {
  sendTestEmail,
  testEmailConfig
};
