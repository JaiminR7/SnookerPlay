import express from 'express';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import { sendRegistrationConfirmation, sendRegistrationCancellation } from '../utils/emailService.js';

const router = express.Router();

// Get user's registered tournaments
router.get("/user/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Fetching registrations for user:", req.params.userId);
    
    const registrations = await Registration.find({ userId: req.params.userId })
      .populate('tournamentId');
    
    console.log("Found registrations:", registrations);
    
    if (!registrations || registrations.length === 0) {
      return res.json([]); // Return empty array if no registrations found
    }

    const tournaments = registrations.map(reg => reg.tournamentId);
    console.log("Returning tournaments:", tournaments);
    
    res.json(tournaments);
  } catch (err) {
    console.error("Error in /user/:userId endpoint:", err);
    res.status(500).json({ 
      message: "Server error while fetching registrations",
      error: err.message 
    });
  }
});

router.post("/", async (req, res) => {
  const { userId, tournamentId, userDetails } = req.body;

  // Add detailed logging to debug the issue
  console.log("📝 Registration request received:");
  console.log("  - userId:", userId);
  console.log("  - tournamentId:", tournamentId);
  console.log("  - userDetails:", JSON.stringify(userDetails, null, 2));

  try {
    // Prevent duplicate registration
    const existing = await Registration.findOne({ userId, tournamentId });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "You are already registered for this tournament." 
      });
    }

    // Get user and tournament information for email
    let user = await User.findOne({ clerkId: userId });
    
    // If user not found by clerkId, try to find/create user
    if (!user) {
      console.log(`⚠️ User with clerkId ${userId} not found, attempting to find by email or create...`);
      
      // Check if userDetails contains email information
      if (userDetails && userDetails.email) {
        console.log(`📧 Found email in userDetails: ${userDetails.email}`);
        // Try to find existing user by email
        user = await User.findOne({ email: userDetails.email });
        
        if (user) {
          // Update the user's clerkId to the current one
          user.clerkId = userId;
          await user.save();
          console.log(`✅ Updated user ${user.email} with new clerkId: ${userId}`);
        } else {
          // Create new user for any email (not just known users)
          console.log(`📝 Creating new user for: ${userDetails.email}`);
          user = new User({
            clerkId: userId,
            email: userDetails.email,
            name: userDetails.name || userDetails.firstName || 'Player',
            skillLevel: userDetails.skillLevel || 'Beginner',
            bio: userDetails.bio || 'Snooker Player'
          });
          await user.save();
          console.log(`✅ Created new user: ${user.email} with clerkId: ${userId}`);
        }
      } else {
        console.log(`⚠️ No email provided in userDetails for userId: ${userId}`);
        console.log(`⚠️ userDetails content: ${JSON.stringify(userDetails)}`);
      }
    } else {
      console.log(`✅ Found existing user: ${user.email} for clerkId: ${userId}`);
    }
    
    const tournament = await Tournament.findById(tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ 
        success: false,
        message: "Tournament not found" 
      });
    }

    const registration = new Registration({ 
      userId, 
      tournamentId,
      userDetails: userDetails || {}
    });
    await registration.save();

    // Send registration confirmation email
    if (user && user.email) {
      try {
        console.log(`📧 Sending registration confirmation to ${user.email} for tournament: ${tournament.title}`);
        await sendRegistrationConfirmation(user.email, user.name, tournament);
        console.log(`✅ Registration confirmation email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send registration confirmation email:`, emailError);
        // Don't fail the registration if email fails
      }
    } else {
      console.log(`⚠️ User not found or no email available for userId: ${userId}`);
    }

    res.status(201).json({ 
      success: true,
      message: "Registration successful" 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error during registration" 
    });
  }
});

// Cancel/withdraw registration
router.delete("/:userId/:tournamentId", async (req, res) => {
  const { userId, tournamentId } = req.params;

  try {
    console.log("Attempting to cancel registration for user:", userId, "tournament:", tournamentId);
    
    // Get user and tournament information before deleting registration
    let user = await User.findOne({ clerkId: userId });
    
    // If user not found by clerkId, try to find by matching registration data
    if (!user) {
      console.log(`⚠️ User with clerkId ${userId} not found for cancellation`);
      
      // Try to find user by checking existing registrations for this tournament
      const existingRegistration = await Registration.findOne({ userId, tournamentId });
      if (existingRegistration && existingRegistration.userDetails && existingRegistration.userDetails.email) {
        user = await User.findOne({ email: existingRegistration.userDetails.email });
        console.log(`🔍 Found user by email from registration: ${user?.email}`);
      }
    }
    
    const tournament = await Tournament.findById(tournamentId);
    
    const registration = await Registration.findOneAndDelete({ 
      userId, 
      tournamentId 
    });

    if (!registration) {
      return res.status(404).json({ 
        success: false,
        message: "Registration not found" 
      });
    }

    console.log("Registration cancelled successfully:", registration);
    
    // Send registration cancellation email
    if (user && user.email && tournament) {
      try {
        console.log(`📧 Sending registration cancellation to ${user.email} for tournament: ${tournament.title}`);
        await sendRegistrationCancellation(user.email, user.name, tournament);
        console.log(`✅ Registration cancellation email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send registration cancellation email:`, emailError);
        // Don't fail the cancellation if email fails
      }
    } else {
      console.log(`⚠️ User or tournament not found, or no email available for userId: ${userId}`);
    }
    
    res.json({ 
      success: true,
      message: "Registration cancelled successfully" 
    });
  } catch (err) {
    console.error("Error canceling registration:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error while canceling registration",
      error: err.message 
    });
  }
});

export default router;
