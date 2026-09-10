# INIB - Full Stack To-Do List Application

## Overview
INIB is a full-stack productivity application built to manage daily tasks with a modern dashboard interface, REST API integration, and MongoDB persistence. It is designed for portfolio and internship use, showcasing React, Express.js, MongoDB, and CRUD workflows in a polished SaaS-style UI.

## Features
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks complete or pending
- Set task priorities
- Add due dates
- Search tasks by title or description
- Filter by status and priority
- Dashboard statistics for total, pending, completed, and high-priority items
- Dark and light theme toggle
- Responsive layout for desktop and mobile
- REST API integration with MongoDB-backed persistence

## Tech Stack
### Frontend
- React
- Vite
- Axios
- CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Architecture
React
↓
Axios
↓
Express REST API
↓
Mongoose
↓
MongoDB Atlas

## API Endpoints
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/toggle

## Project Structure
```text
INIB/
├── client/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
├── .gitignore
└── .env
```

## Installation
### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## Environment Variables
Create and configure environment files locally without pushing secrets to GitHub.

### Frontend example
```env
VITE_API_URL=http://localhost:5000
```

### Backend example
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Authentication
- User registration and login are protected with password hashing and JWT-based sessions.
- All task routes require a valid bearer token and are scoped to the authenticated user.
- A task can only be read, updated, toggled, or deleted by its owner.

Do not commit the real environment files containing credentials.

## Screenshots
Screenshots can be added here after project demo capture.

## Future Improvements
- Authentication and user-specific task lists
- Reminder notifications
- Deployment to cloud hosting
- Advanced analytics and productivity insights
