# 🚀 Quick Backend Integration - EduBridge

## When Your Backend is Ready

This guide provides the exact code changes needed to connect your EduBridge frontend to a backend API.

---

## 1️⃣ Create Environment File

**File:** `.env` (in project root)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Admin emails (comma-separated)
VITE_ADMIN_EMAILS=admin@edubridge.africa
```

**For Production:**
```env
VITE_API_URL=https://api.edubridge.africa
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_ADMIN_EMAILS=admin@edubridge.africa,super@edubridge.africa
```

---

## 2️⃣ Update AuthContext - signUp Method

**File:** `src/context/AuthContext.jsx`

### Current Code (Lines 91-116):
```javascript
const signUp = async (userData) => {
  // TODO: Replace with actual API call when backend is ready
  // import { authAPI } from '../api/services';
  // const response = await authAPI.register(userData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock successful registration
  const newUser = {
    id: `user_${Date.now()}`,
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    role: 'student',
    avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`
  };

  // Store token (when backend is ready, get this from response)
  // localStorage.setItem('token', response.token);
  
  // Store user data
  localStorage.setItem('edubridge_user', JSON.stringify(newUser));
  setUser(newUser);
  
  return newUser;
};
```

### Replace With:
```javascript
const signUp = async (userData) => {
  const { authAPI } = await import('../api/services');
  
  // Call real backend API
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

## 3️⃣ Update AuthContext - login Method

**File:** `src/context/AuthContext.jsx`

### Current Code (Lines 46-80):
```javascript
const login = async ({ email, password }) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Dummy Admin Credentials
  if (email === 'admin@edubridge.africa' && password === 'admin123') {
    const adminUser = {
      id: 'admin_01',
      name: 'Admin User',
      email: email,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
    };
    localStorage.setItem('edubridge_user', JSON.stringify(adminUser));
    setUser(adminUser);
    return adminUser;
  }

  // Dummy Student Credentials
  if (email === 'student@test.com' && password === 'student123') {
    const studentUser = {
      id: 'student_01',
      name: 'John Doe',
      email: email,
      role: 'student',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    };
    localStorage.setItem('edubridge_user', JSON.stringify(studentUser));
    setUser(studentUser);
    return studentUser;
  }

  // Invalid Credentials
  throw new Error('Invalid email or password');
};
```

### Replace With:
```javascript
const login = async ({ email, password }) => {
  const { authAPI } = await import('../api/services');
  
  // Call real backend API
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

## 4️⃣ Verify API Configuration

**File:** `src/api/services.js`

This file should already be configured correctly:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor adds token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles errors
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
};
```

**✅ No changes needed!**

---

## Backend API Contract

### Registration Endpoint

**URL:** `POST /api/auth/register`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+250 788 123 456",
  "country": "Rwanda",
  "password": "SecurePass123!"
}
```

**Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "avatar": "https://...",
    "phoneNumber": "+250 788 123 456",
    "country": "Rwanda",
    "createdAt": "2026-02-16T15:19:42.000Z"
  }
}
```

**Error (400):**
```json
{
  "message": "Email already exists"
}
```

---

### Login Endpoint

**URL:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "avatar": "https://..."
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

## Testing Steps

### 1. Verify Backend is Running
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return 200 OK
```

### 2. Test Registration
1. Fill out signup form
2. Open DevTools → Network
3. Submit form
4. Verify request:
   - Method: `POST`
   - URL: `{VITE_API_URL}/auth/register`
   - Status: `200`
   - Response contains `token` and `user`

### 3. Verify LocalStorage
```javascript
// DevTools → Console
localStorage.getItem('token')
localStorage.getItem('edubridge_user')

// Both should have values
```

### 4. Test Protected Routes
1. After signup, should redirect to `/dashboard`
2. Dashboard should load without errors
3. API requests should include Authorization header

### 5. Test Logout & Login
1. Click logout
2. Should redirect to `/signin`
3. Login with credentials
4. Should redirect to `/dashboard`

---

## Common Issues

### "Network Error"
**Causes:**
- Backend not running
- Wrong `VITE_API_URL` in `.env`
- CORS not configured

**Fix:**
```bash
# Check backend is running
curl http://localhost:5000/api

# Backend CORS should allow: http://localhost:5173
```

---

### "Cannot read property 'token'"
**Cause:** Backend response structure doesn't match

**Fix:** Ensure backend returns:
```json
{
  "token": "...",
  "user": {...}
}
```

---

### "401 Unauthorized"
**Causes:**
- Token not being sent
- Backend not validating token correctly

**Fix:**
```javascript
// Verify token in localStorage
console.log(localStorage.getItem('token'));

// Check API interceptor adds it to headers
```

---

## Security Checklist

### Frontend ✅
- [x] Password validation
- [x] Input sanitization
- [x] Form validation
- [x] HTTPS in production

### Backend Required
- [ ] Password hashing (bcrypt)
- [ ] Email uniqueness
- [ ] Rate limiting
- [ ] JWT expiration (7d)
- [ ] CORS whitelist
- [ ] Input validation
- [ ] SQL injection protection
- [ ] Environment secrets

---

## Production Setup

**Frontend .env.production:**
```env
VITE_API_URL=https://api.edubridge.africa
VITE_GOOGLE_CLIENT_ID=production_id
```

**Backend .env:**
```env
JWT_SECRET=very_long_random_secret
DATABASE_URL=postgresql://...
FRONTEND_URL=https://edubridge.africa
```

---

## Summary

**Changes Needed:**
1. Create `.env` file (1 file)
2. Update `signUp` method (1 code block)
3. Update `login` method (1 code block)

**Time:** 10-15 minutes ⚡

**Your frontend is ready!** 🎉
