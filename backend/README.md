# Lunara Backend - Menstrual Wellness Intelligence Platform

Production-ready Node.js + Express + MongoDB backend with JWT authentication and comprehensive security.

## Folder Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── userController.js     # User CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   ├── errorHandler.js      # Centralized error handling
│   └── validator.js         # Input validation
├── models/
│   └── User.js              # User schema with bcrypt
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── userRoutes.js        # User endpoints
├── utils/
│   └── errorResponse.js     # Custom error class
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── server.js                # Entry point
```

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `PORT`: Server port (default: 5000)

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/v1/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/v1/auth/me` - Get current user (Protected)
  - Headers: `Authorization: Bearer <token>`

### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

All user routes require:
- Headers: `Authorization: Bearer <token>`
- Admin role

## Security Features

✅ **Helmet** - Sets security HTTP headers
✅ **Rate Limiting** - Prevents brute force attacks (100 requests per 15 min)
✅ **MongoDB Sanitization** - Prevents NoSQL injection
✅ **HPP** - Prevents HTTP parameter pollution
✅ **CORS** - Cross-origin resource sharing
✅ **JWT** - Secure token-based authentication
✅ **bcrypt** - Password hashing with 10 salt rounds
✅ **Input Validation** - express-validator on all routes

## Architecture Highlights

1. **MVC Pattern** - Separation of concerns
2. **Centralized Error Handling** - Consistent error responses
3. **Async/Await** - Modern async handling with try-catch
4. **Password Security** - bcrypt hashing, never stored plain
5. **JWT Token Management** - Secure generation and verification
6. **Role-Based Access Control** - Admin and user roles
7. **Input Validation** - Validation middleware on routes
8. **Database Connection** - Graceful connection with error handling
9. **Process Error Handling** - Unhandled rejection handling
10. **Environment-Based Config** - Separate dev/prod configs

## Testing the API

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (use token from login)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable MongoDB authentication
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for specific origins only
- [ ] Set up logging service (Winston, Morgan)
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backup strategy
- [ ] Review and adjust rate limits
- [ ] Set up CI/CD pipeline
- [ ] Configure firewall rules

## Next Steps

Extend the platform with:
- Cycle tracking model
- Symptom logging
- Mood tracking
- Predictions/analytics
- Notifications
- Data export features
