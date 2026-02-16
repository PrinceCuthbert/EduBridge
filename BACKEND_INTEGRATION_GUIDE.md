# 🚀 EduBridge Backend Integration Guide

## Overview
This guide provides a complete roadmap for integrating your EduBridge frontend with a backend API.

---

## Current Frontend Status

Your EduBridge frontend is **fully prepared** for backend integration with:

✅ **AuthContext** with centralized authentication state  
✅ **API Service Layer** with Axios configured  
✅ **Token Management** infrastructure ready  
✅ **Form Validation** on the client side  
✅ **Error Handling** throughout the app  
✅ **Protected Routes** that check authentication  

---

## Architecture Overview

### Authentication Flow

```
User Registration:
SignUpPage → useAuth() → signUp(data) → authAPI.register() → 
Backend API → Returns token + user → Store in localStorage → 
Navigate to /dashboard

User Login:
SignInPage → useAuth() → login(credentials) → authAPI.login() →
Backend API → Returns token + user → Store in localStorage →
Navigate to /dashboard

Protected Routes:
Route accessed → Check localStorage for token → 
If valid: Render component → API calls include token in headers
If invalid: Redirect to /signin
```

---

## Step-by-Step Integration

### Step 1: Set Up Environment Variables

Create a `.env` file in your project root:

**Development:**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Admin emails (comma-separated)
VITE_ADMIN_EMAILS=admin@edubridge.africa
```

**Production:**
```env
VITE_API_URL=https://api.edubridge.africa
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_ADMIN_EMAILS=admin@edubridge.africa,super@edubridge.africa
```

---

### Step 2: Update AuthContext - signUp Method

**File:** `src/context/AuthContext.jsx`

**Find lines 91-116 (the mock signUp method):**
```javascript
const signUp = async (userData) => {
  // TODO: Replace with actual API call when backend is ready
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newUser = {
    id: `user_${Date.now()}`,
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    role: 'student',
    avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`
  };
  
  localStorage.setItem('edubridge_user', JSON.stringify(newUser));
  setUser(newUser);
  return newUser;
};
```

**Replace with:**
```javascript
const signUp = async (userData) => {
  const { authAPI } = await import('../api/services');
  
  // Call backend API
  const response = await authAPI.register(userData);
  
  // Store token from backend
  localStorage.setItem('token', response.token);
  
  // Store user data from backend
  const newUser = {
    id: response.user.id,
    name: response.user.name || `${userData.firstName} ${userData.lastName}`,
    email: response.user.email,
    role: response.user.role || 'student',
    avatar: response.user.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`
  };
  
  localStorage.setItem('edubridge_user', JSON.stringify(newUser));
  setUser(newUser);
  
  return newUser;
};
```

---

### Step 3: Update AuthContext - login Method (Optional)

**File:** `src/context/AuthContext.jsx`

**Find lines 46-80 (the mock login method):**
```javascript
const login = async ({ email, password }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock credentials check
  if (email === 'admin@edubridge.africa' && password === 'admin123') {
    // ... admin mock
  }
  
  if (email === 'student@test.com' && password === 'student123') {
    // ... student mock
  }
  
  throw new Error('Invalid email or password');
};
```

**Replace with:**
```javascript
const login = async ({ email, password }) => {
  const { authAPI } = await import('../api/services');
  
  // Call backend API
  const response = await authAPI.login({ email, password });
  
  // Store token from backend
  localStorage.setItem('token', response.token);
  
  // Store user data
  const user = {
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
    avatar: response.user.avatar || `https://ui-avatars.com/api/?name=${response.user.name}&background=random`
  };
  
  localStorage.setItem('edubridge_user', JSON.stringify(user));
  setUser(user);
  
  return user;
};
```

---

### Step 4: Verify API Service Configuration

**File:** `src/api/services.js`

Your API service is already configured correctly. Verify it looks like this:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
```

**No changes needed here!** ✅

---

## Backend API Contract

### 1. Registration Endpoint

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+250 788 123 456",
  "country": "Rwanda",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "avatar": "https://storage.example.com/avatars/user_123456.jpg",
    "phoneNumber": "+250 788 123 456",
    "country": "Rwanda",
    "createdAt": "2026-02-16T15:19:42.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already exists"
}
```

**Error Response (422):**
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters with a number and symbol"
  }
}
```

---

### 2. Login Endpoint

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "avatar": "https://storage.example.com/avatars/user_123456.jpg"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. Protected Endpoint Authentication

All authenticated requests should include:
```http
Authorization: Bearer {token}
```

Backend should:
- Validate JWT signature
- Check token expiration
- Return 401 if invalid/expired
- Extract user ID from token for queries

---

## Validation Requirements

### Frontend Validation (Already Implemented)

**SignUp Form:**
- ✅ First name required
- ✅ Last name required
- ✅ Valid email format
- ✅ Password min 8 characters
- ✅ Password must contain number
- ✅ Password must contain symbol
- ✅ Passwords must match
- ✅ Country required
- ✅ Terms agreement required

### Backend Validation (Your Responsibility)

**Registration:**
- [ ] Email uniqueness check
- [ ] Email format validation
- [ ] Password strength validation
- [ ] Sanitize all inputs
- [ ] Hash password (bcrypt/argon2)
- [ ] Validate phone number format (if provided)
- [ ] Validate country from allowed list

**Login:**
- [ ] Email exists check
- [ ] Password hash comparison
- [ ] Rate limiting (max 5 attempts per minute)
- [ ] Account lockout after failed attempts (optional)

---

## Testing Guide

### Pre-Integration Tests

1. **Form Validation:**
   ```
   - Try submitting empty form → Should show errors
   - Enter weak password → Should reject
   - Mismatch passwords → Should show error
   - Don't check terms → Should prevent submit
   ```

2. **Mock Authentication:**
   ```
   - Fill valid form → Should create mock user
   - Check localStorage → Should have 'edubridge_user'
   - Navigate to /dashboard → Should work
   ```

### Post-Integration Tests

1. **Backend Connection:**
   ```bash
   # Verify backend is running
   curl http://localhost:5000/api/auth/register
   
   # Should return method not allowed or similar (not 404)
   ```

2. **Network Tab Verification:**
   ```
   - Open DevTools → Network
   - Submit registration form
   - Check request:
     * Method: POST
     * URL: http://localhost:5000/api/auth/register
     * Status: 200 OK
     * Response: Contains token and user
   ```

3. **LocalStorage Verification:**
   ```javascript
   // Open DevTools Console
   localStorage.getItem('token')           // Should return JWT
   localStorage.getItem('edubridge_user')  // Should return user JSON
   ```

4. **End-to-End Flow:**
   ```
   a. Register new user → Success toast → Redirect to dashboard
   b. Logout → Redirect to signin
   c. Login with new credentials → Redirect to dashboard
   d. Access protected route → Should work
   e. Clear token → Access protected route → Redirect to signin
   ```

---

## Troubleshooting

### Issue: "Network Error"

**Possible Causes:**
1. Backend not running
2. Wrong API URL in `.env`
3. CORS not configured on backend
4. Firewall blocking port

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:5000/api/health

# 2. Verify .env file
cat .env | grep VITE_API_URL

# 3. Check backend CORS config allows frontend URL
# Backend should whitelist: http://localhost:5173

# 4. Check firewall
netstat -an | findstr :5000
```

---

### Issue: "Cannot read property 'token' of undefined"

**Cause:** Backend response doesn't match expected format

**Expected:**
```json
{
  "token": "...",
  "user": {...}
}
```

**Solution:** Update backend or frontend to match structure

---

### Issue: "401 Unauthorized" on protected routes

**Possible Causes:**
1. Token expired
2. Token not in localStorage
3. Interceptor not adding Authorization header
4. Backend JWT secret mismatch

**Solutions:**
```javascript
// 1. Check token exists
console.log('Token:', localStorage.getItem('token'));

// 2. Verify interceptor runs
// In services.js, add debug log:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Adding token:', token ? 'Yes' : 'No');
  // ... rest
});

// 3. Check backend JWT validation
// Ensure backend uses same secret for signing and verification
```

---

### Issue: Google Sign-Up not working

**Causes:**
1. Missing `VITE_GOOGLE_CLIENT_ID`
2. Google Console not configured
3. Authorized domains not set

**Solutions:**
```env
# 1. Add to .env
VITE_GOOGLE_CLIENT_ID=your_actual_id_here

# 2. Google Console:
# - Enable Google+ API
# - Add authorized JavaScript origins:
#   http://localhost:5173
#   https://edubridge.africa
# - Add authorized redirect URIs:
#   http://localhost:5173/dashboard
#   https://edubridge.africa/dashboard
```

---

## Security Checklist

### Frontend (Already Implemented ✅)
- [x] Password not logged to console
- [x] HTTPS in production (deployment config)
- [x] Input sanitization (trim, lowercase)
- [x] Form validation before submission
- [x] XSS protection (React escapes by default)

### Backend (Required)
- [ ] Password hashing (bcrypt with salt rounds ≥ 10)
- [ ] Email uniqueness validation
- [ ] SQL injection prevention (use ORM or parameterized queries)
- [ ] Rate limiting (express-rate-limit)
- [ ] JWT expiration (7 days recommended)
- [ ] Refresh token implementation
- [ ] CORS whitelist (no wildcard in production)
- [ ] HTTPS only in production
- [ ] Environment variables for secrets
- [ ] Input validation library (Joi, Yup)
- [ ] Helmet.js for security headers
- [ ] CSRF protection (if using cookies)

---

## Production Deployment

### Environment Setup

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.edubridge.africa
VITE_GOOGLE_CLIENT_ID=production_client_id
VITE_ADMIN_EMAILS=admin@edubridge.africa
```

**Backend:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/edubridge
JWT_SECRET=very_long_random_secret_key_here
JWT_EXPIRATION=7d
FRONTEND_URL=https://edubridge.africa
ALLOWED_ORIGINS=https://edubridge.africa
```

### Deployment Checklist
- [ ] Environment variables set in hosting platform
- [ ] HTTPS enabled (Let's Encrypt, Cloudflare)
- [ ] Database migrations run
- [ ] CORS configured for production frontend URL only
- [ ] Rate limiting enabled
- [ ] Error logging configured (Sentry, LogRocket)
- [ ] Health check endpoint working
- [ ] Backup strategy in place
- [ ] CDN configured for static assets (optional)

---

## Next Steps

1. ✅ **Environment Setup**
   - Create `.env` file with backend URL
   - Add Google Client ID

2. ✅ **Code Changes**
   - Update `signUp` in AuthContext (1 change)
   - Update `login` in AuthContext (1 change)

3. ✅ **Testing**
   - Start backend server
   - Test registration flow
   - Test login flow
   - Test protected routes

4. ✅ **Deployment**
   - Deploy backend to hosting service
   - Deploy frontend to Netlify/Vercel
   - Configure production environment variables
   - Test production deployment

---

## Summary

Your EduBridge frontend is **production-ready** for backend integration!

**What's configured:**
- ✅ Full authentication flow with AuthContext
- ✅ API service layer with Axios
- ✅ Token management infrastructure
- ✅ Form validation and error handling
- ✅ Protected routes system
- ✅ Google OAuth integration

**What you need:**
- [ ] Backend API with `/auth/register` and `/auth/login` endpoints
- [ ] `.env` file with backend URL
- [ ] 2 code changes in AuthContext (replace mock with API)

**Time to integrate:** 10-15 minutes when backend is ready ⚡

---

**Last Updated:** 2026-02-16  
**Version:** 2.0 (Backend-ready)
