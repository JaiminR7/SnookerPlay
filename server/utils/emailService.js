// emailService.js
import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config(); // Load .env variables

// Debug: Check environment variables
console.log("🔍 Environment check:", {
  hasEmailUser: !!process.env.EMAIL_USER,
  hasEmailPassword: !!process.env.EMAIL_PASSWORD,
  emailUser: process.env.EMAIL_USER ? "set" : "not set",
});

// Initialize nodemailer transporter
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
  });
  console.log("✅ Nodemailer transporter initialized successfully");
} else {
  console.log("⚠️ Email credentials not found, email service will not work");
}

// Test SMTP connection
const testEmailConfig = async () => {
  try {
    console.log("🔧 Testing nodemailer configuration...");
    if (!transporter) {
      console.error("❌ Transporter not initialized - no credentials");
      return false;
    }
    const verifyResult = await transporter.verify();
    console.log("✅ SMTP verification result:", verifyResult);
    return true;
  } catch (error) {
    console.error("❌ Email configuration test failed:", error);
    return false;
  }
};

// Send tournament notification email
const sendTournamentNotification = async (users, tournament) => {
  try {
    if (!transporter) {
      console.error("❌ Cannot send emails - transporter not initialized");
      return [];
    }

    const emailPromises = users.map(async (user) => {
      if (!user.email) return null;

      const mailOptions = {
        from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `🏆 New Snooker Tournament: ${tournament.title}`,
        html: `
  <h2>New Tournament Alert!</h2>
  <p>Hello ${user.name || "Player"},</p>
  <p><strong>${tournament.title}</strong></p>
  <ul>
    <li>Location: ${tournament.location}</li>
    <li>Date: ${new Date(tournament.date).toLocaleDateString()}</li>
    <li>Time: ${tournament.time}</li>
    <li>Fee: ${tournament.registrationFee}</li>
    <li>Prize: ${tournament.prizePool}</li>
  </ul>
  <a href="${process.env.CLIENT_URL}/events"
     style="background-color: #4CAF50; padding: 10px 20px; text-decoration: none; color: white; border-radius: 5px;">
    Register Now
  </a>
`,
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
    console.error("❌ Error sending notifications:", error);
    return [];
  }
};

// Send fixture confirmation email
const sendFixtureConfirmation = async (tournament, fixtures) => {
  if (!transporter) return [];

  const emailPromises = tournament.participants.map(async (participantId) => {
    const participant = await User.findById(participantId);
    if (!participant?.email) return null;

    const participantFixtures = fixtures.filter(
      (f) =>
        f.player1.toString() === participantId.toString() ||
        f.player2.toString() === participantId.toString()
    );

    return transporter.sendMail({
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      subject: `🎯 Fixtures: ${tournament.title}`,
      html: `
        <h2>Your Fixtures</h2>
        ${participantFixtures
          .map(
            (f) => `
          <div>
            Match ${f.matchNumber}: ${f.player1.name} vs ${f.player2.name}
          </div><br>
        `
          )
          .join("")}
        <p>Good luck!</p>
      `,
    });
  });

  return Promise.all(emailPromises);
};

// Send registration confirmation email
const sendRegistrationConfirmation = async (userEmail, userName, tournament) => {
  try {
    if (!transporter) {
      console.error("❌ Cannot send registration email - transporter not initialized");
      return false;
    }

    const mailOptions = {
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Registration Confirmed: ${tournament.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">🎉 Registration Confirmed!</h2>
          <p>Hello ${userName || "Player"},</p>
          <p>You have successfully registered for the following tournament:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">${tournament.title}</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>📍 Location:</strong> ${tournament.location}</li>
              <li><strong>📅 Date:</strong> ${new Date(tournament.date).toLocaleDateString()}</li>
              <li><strong>⏰ Time:</strong> ${tournament.time}</li>
              <li><strong>💰 Registration Fee:</strong> ${tournament.registrationFee}</li>
              <li><strong>🏆 Prize Pool:</strong> ${tournament.prizePool}</li>
            </ul>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Keep an eye on your email for fixture updates</li>
            <li>Arrive at the venue 30 minutes before your first match</li>
            <li>Bring your own cue if preferred</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/events/${tournament._id}" 
               style="background-color: #4CAF50; padding: 12px 24px; text-decoration: none; color: white; border-radius: 5px; display: inline-block;">
              View Tournament Details
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Good luck in the tournament!<br>
            - Team SnookerPlay
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Registration confirmation sent to ${userEmail}:`, info.response);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send registration confirmation to ${userEmail}:`, error.message);
    return false;
  }
};

// Send registration cancellation email
const sendRegistrationCancellation = async (userEmail, userName, tournament) => {
  try {
    if (!transporter) {
      console.error("❌ Cannot send cancellation email - transporter not initialized");
      return false;
    }

    const mailOptions = {
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `❌ Registration Cancelled: ${tournament.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f44336;">🔄 Registration Cancelled</h2>
          <p>Hello ${userName || "Player"},</p>
          <p>Your registration for the following tournament has been cancelled:</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #333; margin-top: 0;">${tournament.title}</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>📍 Location:</strong> ${tournament.location}</li>
              <li><strong>📅 Date:</strong> ${new Date(tournament.date).toLocaleDateString()}</li>
              <li><strong>⏰ Time:</strong> ${tournament.time}</li>
            </ul>
          </div>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Your registration has been successfully removed</li>
            <li>If you paid a registration fee, refund processing may take 3-5 business days</li>
            <li>You can register again anytime if spots are available</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/events" 
               style="background-color: #2196F3; padding: 12px 24px; text-decoration: none; color: white; border-radius: 5px; display: inline-block;">
              Browse Other Tournaments
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We hope to see you in future tournaments!<br>
            - Team SnookerPlay
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Registration cancellation sent to ${userEmail}:`, info.response);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send registration cancellation to ${userEmail}:`, error.message);
    return false;
  }
};

// Send test email
const sendTestEmail = async (to) => {
  if (!transporter) return false;

  try {
    const info = await transporter.sendMail({
      from: `"SnookerPlay" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Test Email from SnookerPlay",
      html: `<h1>This is a test email</h1><p>Sent at: ${new Date().toLocaleString()}</p>`,
    });

    console.log("✅ Test email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    return false;
  }
};

export { 
  sendTestEmail, 
  testEmailConfig, 
  sendTournamentNotification,
  sendFixtureConfirmation,
  sendRegistrationConfirmation, 
  sendRegistrationCancellation 
};
