// Configuration file for API endpoints and app settings
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  clientUrl: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173',
  
  // Stripe configuration
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  
  // App settings
  appName: 'SnookerPlay',
  version: '1.0.0'
};

export default config;
