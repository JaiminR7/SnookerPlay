# SnookerPlay - Tournament Management System

A full-stack web application for managing snooker tournaments, built with React (frontend) and Node.js/Express (backend).

## Features

- 🏆 Tournament creation and management
- 👥 User registration and authentication (Clerk)
- 📧 Email notifications for new tournaments
- 🎯 Tournament registration system
- 📊 Fixture generation and management
- 📱 Responsive design

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Clerk Authentication

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer (Gmail)
- CORS

## Project Structure

```
snookerplay/
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                 # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── index.js
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)

```
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLIENT_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

## Local Development

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Deployment

### Render Deployment

1. **Backend Deployment:**

   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Set Root Directory to `server`
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Add environment variables in Render dashboard

2. **Frontend Deployment:**
   - Create a new Static Site
   - Set Root Directory to `client`
   - Set Build Command: `npm run build`
   - Set Publish Directory: `dist`
   - Add environment variables

## API Endpoints

- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments` - Create new tournament
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments/:id/register` - Register for tournament
- `GET /api/tournaments/test-email` - Test email service
- `GET /api/tournaments/send-all-users` - Send test emails to all users

## License

ISC
