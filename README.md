# 🎯 Feedback Review and Management System – Frontend (React.js)

## 📘 Overview
The **Feedback Review and Management System (FRMS)** frontend is a web-based interface built using **React.js**.  
It allows users to submit feedback, view responses, and for administrators to review, manage, and analyze feedback efficiently.

This frontend application communicates with the backend (Spring Boot) through **RESTful APIs**, providing a responsive, secure, and user-friendly experience.

---

## 🧩 Key Features

### 👤 User Features
- Register and Login using secure authentication.
- Submit feedback with category, description, and rating.
- View personal feedback submissions and status updates.
- Edit or delete own feedback.

### 🛠️ Admin Features
- View all submitted feedback.
- Manage user accounts and roles.
- Filter feedback based on category, date, or user.
- Respond to user feedback or mark it as resolved.

### 💡 UI Features
- Built using **React Components** and **React Router**.
- Responsive design (works across desktop and mobile).
- Real-time data rendering using **Axios** API calls.
- Smooth navigation and modern UI built with **CSS3 / Tailwind (optional)**.

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend Framework** | React.js (Vite or Create React App) |
| **UI/Styling** | HTML5, CSS3, JavaScript (ES6), Bootstrap / Tailwind |
| **State Management** | React Hooks (useState, useEffect) |
| **API Communication** | Axios (RESTful API integration) |
| **Routing** | React Router DOM |
| **Authentication** | JWT (via backend integration) |

---

## 🚀 Installation and Setup

### **1️⃣ Prerequisites**
Ensure the following tools are installed:
- [Node.js](https://nodejs.org/en/download) (v16+)
- npm or yarn
- Backend (Spring Boot) running locally or on a server

---

### **2️⃣ Clone the Repository**
```bash
git clone https://github.com/727724EUAI506-SreeHaranS/Feedback_Review_and_Management_System_Frontend.git
cd REACT_APP
```
---

### 3️⃣ Install Dependencies
```
npm install
# or
yarn install
```

---

### 🧠 Main Components Overview
## Component	Description
  - Login.jsx	Handles user authentication and token storage.
  - Register.jsx	Allows new user registration.
  - Dashboard.jsx	Displays user summary and feedback overview.
  - FeedbackForm.jsx	Used for creating and submitting feedback.
  - FeedbackList.jsx	Shows all feedback for users or admins.
  - AdminDashboard.jsx	Allows admin to manage users and feedbacks.
  - ProtectedRoute.jsx	Restricts unauthorized access to private routes.

---

### 🛡️ Authentication Workflow
- User logs in → React sends credentials to backend.
- Backend returns a JWT token.
- React stores the token in localStorage.
- Axios attaches token in Authorization header for subsequent requests.
- Backend verifies token for each API call.

---

### 🎨 UI/UX Design Highlights
- Clean and consistent color palette (blue/white gradients recommended).
- Intuitive navigation bar and form layouts.
- Responsive grids for feedback listing.
- Smooth hover and click animations using CSS transitions.

---

### 🔐 Security Considerations
- JWT stored in browser localStorage for session handling.
- Sensitive environment variables stored in .env.
- All API requests validated through backend authentication.
- Input fields sanitized to prevent XSS attacks.

---

### 📈 Future Enhancements
- Add data visualization for feedback statistics.
- Implement dark/light theme toggle.
- Real-time notifications for new feedback (WebSocket).
- Multi-language support (i18n).

---

### 🧾 License

This project is licensed under the MIT License – feel free to use and modify it for educational or personal projects.

---

### 🌐 Connect

- 💻 Project Type: MERN-like (React + Spring Boot + MySQL)
- 📧 Contact: sreeharansathya10@gmail.com
- 📍 Location: India

---

#### “Your feedback deserves a system that listens, manages, and improves — efficiently.” 🚀
