# 💕 Kenya Dating

A modern, full-featured dating website built with Node.js, Express, and SQLite. Find your perfect match!

## Features

✨ **User Authentication** - Secure registration and login
👤 **User Profiles** - Create and edit your dating profile
💞 **Matching System** - Like profiles and see your matches
💬 **Messaging** - Chat with your matches in real-time
🔍 **Profile Discovery** - Browse and discover singles
🎨 **Beautiful UI** - Modern, responsive design

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Security**: JWT Authentication, bcryptjs Password Hashing
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kenyandating.git
   cd kenyandating
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run db:init
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

The app will be running at `http://localhost:5000`

## Project Structure

```
kenyandating/
├── public/              # Frontend files
│   ├── index.html       # Main HTML page
│   ├── css/
│   │   └── styles.css   # Styling
│   └── js/
│       └── app.js       # Frontend JavaScript
├── src/
│   ├── db/
│   │   └── database.js  # Database connection
│   ├── middleware/
│   │   └── auth.js      # JWT authentication
│   └── routes/
│       ├── auth.js      # Authentication routes
│       ├── profiles.js  # Profile routes
│       ├── matches.js   # Matching routes
│       └── messages.js  # Messaging routes
├── scripts/
│   └── initDb.js        # Database initialization
├── server.js            # Express server
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/me` - Get current user profile
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/:id` - Update profile

### Matches
- `GET /api/matches` - Get user matches
- `POST /api/matches/like/:profileId` - Like a profile
- `PUT /api/matches/:matchId/accept` - Accept a match

### Messages
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark message as read

## How to Use

1. **Register** - Create an account with email and password
2. **Create Profile** - Add your details, age, location, and interests
3. **Browse** - Discover singles in your area
4. **Like & Match** - Like profiles to create matches
5. **Chat** - Message with your matches
6. **Connect** - Find your perfect match!

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
DATABASE_PATH=./data/dating.db
```

## Deployment

To deploy this application:

1. Change `NODE_ENV` to `production` in `.env`
2. Use a production database (PostgreSQL recommended)
3. Deploy to services like Heroku, AWS, or DigitalOcean
4. Set strong JWT_SECRET

## Future Enhancements

- [ ] Advanced search filters
- [ ] Profile verification system
- [ ] Photo upload functionality
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Video chat feature
- [ ] Subscription tiers
- [ ] Payment integration

## License

MIT License - feel free to use this for your own dating app!

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for Kenya
