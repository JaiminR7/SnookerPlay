import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', eventId, userId, userEmail } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: {
        eventId,
        userId,
        userEmail,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

// Confirm payment and complete registration
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve the payment intent to get its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful, complete the registration
      const { eventId, userId, userEmail } = paymentIntent.metadata;

      // Here you would typically:
      // 1. Update the registration in your database
      // 2. Send confirmation email
      // 3. Update tournament participants

      res.json({
        success: true,
        paymentStatus: 'succeeded',
        message: 'Payment successful and registration completed!',
      });
    } else {
      res.status(400).json({
        success: false,
        paymentStatus: paymentIntent.status,
        message: 'Payment was not successful',
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).send({ error: error.message });
  }
});

// Get payment status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back from cents
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).send({ error: error.message });
  }
});

export default router;