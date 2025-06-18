import express from 'express';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';

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
  const { userId, tournamentId } = req.body;

  try {
    // Prevent duplicate registration
    const existing = await Registration.findOne({ userId, tournamentId });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this tournament." });
    }

    const registration = new Registration({ userId, tournamentId });
    await registration.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

export default router;
