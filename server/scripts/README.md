# Scripts Directory

This directory contains utility and testing scripts for the SnookerPlay server.

## Testing Scripts

### Email Testing

- **`testEmail.js`** - Basic email configuration and delivery test
- **`testMail.js`** - Alternative email testing script
- **`testRegistrationEmails.js`** - Tests registration confirmation and cancellation email functions
- **`testRegistrationAPI.js`** - Tests the complete registration API flow with email notifications

### Tournament Testing

- **`testTournamentCreation.js`** - Tests tournament creation through API with email notifications
- **`testTournamentNotifications.js`** - Tests tournament announcement emails to all users

### Environment Testing

- **`testEnv.js`** - Tests environment variable configuration

## Utility Scripts

### Data Management

- **`addUsers.js`** - Script to add sample users to the database
- **`getTestData.js`** - Retrieves test data (users, tournaments) for API testing

## How to Run Scripts

From the server directory, run any script with:

```bash
# Email tests
node scripts/testEmail.js
node scripts/testRegistrationEmails.js
node scripts/testRegistrationAPI.js

# Tournament tests
node scripts/testTournamentCreation.js
node scripts/testTournamentNotifications.js

# Data utilities
node scripts/getTestData.js
node scripts/addUsers.js

# Environment test
node scripts/testEnv.js
```

## Prerequisites

- Make sure the server dependencies are installed: `npm install`
- Ensure environment variables are properly configured in `.env`
- For email tests, Gmail SMTP credentials must be set up
- For API tests, the server should be running (`npm start`)

## Notes

- All scripts are designed to be run from the server root directory
- Scripts that interact with the database will automatically connect and disconnect
- Email scripts will send real emails to configured addresses during testing
- API test scripts require the server to be running on localhost:5000
