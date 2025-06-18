import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Webhook handler for Clerk user events
router.post('/clerk', async (req, res) => {
  try {
    console.log('Received webhook from Clerk:', req.body);
    const { type, data } = req.body;

    // Handle user creation
    if (type === 'user.created') {
      console.log('Processing user.created event');
      const { id, email_addresses, first_name, last_name, image_url } = data;
      
      console.log('User data:', {
        id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`.trim(),
        hasImage: !!image_url
      });

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log('User already exists:', existingUser);
        return res.status(200).json({ message: 'User already exists' });
      }
      
      // Create new user in our database
      const user = new User({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`.trim(),
        avatarUrl: image_url
      });

      await user.save();
      console.log('Created new user:', user);
    }

    // Handle user update
    if (type === 'user.updated') {
      console.log('Processing user.updated event');
      const { id, email_addresses, first_name, last_name, image_url } = data;
      
      console.log('Updated user data:', {
        id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`.trim(),
        hasImage: !!image_url
      });

      // Update user in our database
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address,
          name: `${first_name} ${last_name}`.trim(),
          avatarUrl: image_url
        },
        { new: true }
      );

      if (!user) {
        console.log('User not found for update:', id);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Updated user:', user);
    }

    // Handle user deletion
    if (type === 'user.deleted') {
      console.log('Processing user.deleted event');
      const { id } = data;
      
      // Delete user from our database
      const result = await User.findOneAndDelete({ clerkId: id });
      if (!result) {
        console.log('User not found for deletion:', id);
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('Deleted user:', id);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Error processing webhook', error: error.message });
  }
});

export default router; 