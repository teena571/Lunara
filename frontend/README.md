# Lunara Frontend - Menstrual Wellness Intelligence Platform

Modern React frontend built with Vite, Tailwind CSS, and a beautiful pastel wellness theme.

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS with custom wellness theme
- **React Router** - Client-side routing
- **Axios** - HTTP client with JWT interceptor
- **Context API** - State management for authentication

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route protection HOC
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # User dashboard
│   │   └── NotFound.jsx        # 404 page
│   ├── utils/
│   │   └── axios.js            # Axios instance with interceptors
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js          # Custom wellness theme
├── postcss.config.js
├── package.json
└── .env.example
```

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

Create `.env` file:
```bash
cp .env.example .env
```

Update `VITE_API_URL` if your backend runs on a different port.

## Running the App

```bash
# Development mode (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### 🎨 Wellness Theme
- Soft pastel color palette (peach, lavender, mint, rose)
- Custom Tailwind configuration
- Google Fonts: Inter (body) + Poppins (headings)
- Smooth transitions and hover effects
- Mobile-responsive design

### 🔐 Authentication
- JWT token management
- Axios interceptors for automatic token injection
- Token expiration handling
- Protected routes with redirect
- Auth context for global state

### 🛡️ Protected Routes
- `ProtectedRoute` component wraps authenticated pages
- Automatic redirect to login if not authenticated
- Loading state during auth check

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI elements

## Custom Tailwind Classes

```css
.btn-primary       /* Primary button with wellness shadow */
.btn-secondary     /* Secondary button style */
.card              /* Card container with soft shadow */
.input-field       /* Form input with focus states */
.wellness-gradient /* Pastel gradient background */
```

## Color Palette

```js
primary: Pink shades (#ec5590)
secondary: Purple shades (#8b5cf6)
wellness: {
  peach: '#FFE5D9',
  lavender: '#E8D5F2',
  mint: '#D4F1E8',
  rose: '#FFD6E8',
  cream: '#FFF8F0',
  sage: '#E8F3E8'
}
```

## Axios Setup

The axios instance (`src/utils/axios.js`) includes:
- Base URL configuration
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors and token expiration

## Routes

- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/dashboard` - User dashboard (protected)

## Next Steps

Add these features:
- Cycle tracking interface
- Symptom logging forms
- Mood tracking calendar
- Analytics dashboard
- Profile settings
- Data visualization charts

## Production Build

```bash
npm run build
```

Output will be in `dist/` folder, ready for deployment.

## Deployment

Deploy to:
- Vercel (recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Remember to set environment variables in your hosting platform!
