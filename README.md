# 🌸 Lunara - Menstrual Wellness Intelligence Platform

A modern, secure, and beautiful MERN stack application for menstrual cycle tracking and wellness management.

![Lunara](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with 7-day expiration
- Secure password hashing with bcrypt (10 salt rounds)
- Password reset with secure token (15-minute expiry)
- Protected routes with role-based access control
- Rate limiting (3-tier strategy)
- NoSQL injection prevention
- Input validation on all routes

### 📊 Cycle Tracking
- Log menstrual cycles with dates
- Track cycle length (20-45 days)
- Track period length (1-10 days)
- Monitor flow intensity (light/medium/heavy)
- Record symptoms and notes
- View cycle statistics (average length, period length)
- Date range filtering
- Pagination support

### 💭 Symptom Tracking
- Daily symptom logging
- Mood tracking (8 options)
- Energy level tracking (1-10 scale)
- 12 symptom types (cramps, headache, bloating, etc.)
- Severity levels (mild/moderate/severe)
- Date-based filtering
- Notes support

### 🎨 Beautiful UI
- Soft pastel wellness theme (lavender, peach, mint, rose)
- Smooth animations and transitions
- Mobile-responsive design
- Loading states and error handling
- Soothing color palette

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/lunara.git
cd lunara
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

**Environment Variables (.env):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lunara
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Environment Variables (.env):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🎯 Usage

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:3000

3. **Access Application**
   - Open http://localhost:3000
   - Register a new account
   - Start tracking your wellness journey!

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login user
GET    /api/v1/auth/me                - Get current user
PUT    /api/v1/auth/updatedetails     - Update user details
PUT    /api/v1/auth/updatepassword    - Update password
POST   /api/v1/auth/request-reset     - Request password reset
POST   /api/v1/auth/reset-password    - Reset password with token
DELETE /api/v1/auth/deleteaccount     - Delete account
```

### Cycle Endpoints
```
GET    /api/v1/cycles                 - Get all cycles (paginated)
GET    /api/v1/cycles/stats           - Get cycle statistics
GET    /api/v1/cycles/:id             - Get single cycle
POST   /api/v1/cycles                 - Create cycle
PUT    /api/v1/cycles/:id             - Update cycle
DELETE /api/v1/cycles/:id             - Delete cycle
```

### Symptom Endpoints
```
GET    /api/v1/symptoms               - Get all symptoms (paginated)
GET    /api/v1/symptoms/:id           - Get single symptom
POST   /api/v1/symptoms               - Create symptom log
PUT    /api/v1/symptoms/:id           - Update symptom
DELETE /api/v1/symptoms/:id           - Delete symptom
```

See [API_EXAMPLES.md](./backend/API_EXAMPLES.md) for detailed examples.

## 🔒 Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication (7-day expiry)
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Write operations: 30 requests per 15 minutes
  - Auth endpoints: 5 attempts per 15 minutes
- **Input Validation**: express-validator on all routes
- **NoSQL Injection Prevention**: express-mongo-sanitize
- **Security Headers**: Helmet middleware
- **CORS**: Configured cross-origin resource sharing
- **Data Isolation**: User-scoped queries
- **Password Reset**: Secure token with 15-minute expiry

## 📱 Screenshots

### Home Page
Beautiful landing page with wellness theme

### Dashboard
Track your cycles and symptoms at a glance

### Login/Register
Smooth authentication with error handling

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📖 Documentation

- [Backend README](./backend/README.md) - Backend architecture and setup
- [Authentication Guide](./backend/AUTHENTICATION.md) - Auth system details
- [Security Documentation](./backend/SECURITY.md) - Security implementation
- [API Examples](./backend/API_EXAMPLES.md) - API usage examples
- [Features List](./FEATURES.md) - Complete feature list

## 🛠️ Development

### Project Structure
```
lunara/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── pages/       # Page components
│       ├── utils/       # Utilities
│       └── App.jsx      # Main app component
└── README.md
```

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Consistent naming conventions
- Comprehensive comments

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Inspired by the need for better menstrual health tracking
- Built with modern web technologies
- Designed with user wellness in mind

## 📧 Contact

For questions or support, please open an issue or contact:
- Email: your.email@example.com
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🔮 Future Enhancements

- [ ] Email notifications for cycle predictions
- [ ] Data export (CSV/PDF)
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Social features (optional)
- [ ] Integration with health apps

---

Made with 💜 for wellness and health tracking
