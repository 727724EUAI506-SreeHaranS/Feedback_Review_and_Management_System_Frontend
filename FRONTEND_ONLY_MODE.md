# Frontend-Only Mode

This React application has been configured to run entirely in the browser without requiring a backend server.

## Features Available

✅ **User Authentication** - Login/Register with mock users  
✅ **Feedback Submission** - Submit and store feedback locally  
✅ **User Dashboard** - View your submitted feedback  
✅ **Admin Dashboard** - Manage all feedback (approve/reject/delete)  
✅ **Data Persistence** - All data stored in browser localStorage  

## Pre-configured Test Accounts

### Regular User
- **Username:** `testuser`
- **Password:** `password123`

### Administrator
- **Username:** `admin`
- **Password:** `admin123`

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

## Mock Data

The application uses localStorage to simulate a backend database:
- User accounts are stored in `mockUsers`
- Feedback submissions are stored in `mockFeedbacks`
- Authentication tokens are mock tokens

## Testing the Application

1. **Register a new account** or use the pre-configured test accounts
2. **Submit feedback** as a regular user
3. **Switch to admin account** to manage feedback
4. **All data persists** in your browser until you clear localStorage

## Resetting Data

To reset all mock data, open browser developer tools and run:
```javascript
localStorage.clear();
```

Then refresh the page to reinitialize with default mock data.