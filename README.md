SyncUp - Collaborative Task Management Platform
SyncUp is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables efficient collaboration through shared tasks and group management. It features a clean, responsive UI built with Tailwind CSS.
Show Image
Features

User Authentication: Secure registration and login system
Task Management: Create, read, update, delete, and mark tasks as complete
Task Privacy Levels: Set tasks as private, group-shared, or public
Resource Links: Attach URLs to tasks for context and references
Task Tags: Categorize tasks with custom tags for better organization
Group Management: Create groups to collaborate with specific team members
Responsive Design: Fully compatible with desktop and mobile devices
User-friendly UI: Modern interface with notifications and real-time feedback

Prerequisites

Node.js (v14.0.0 or higher)
npm or yarn
MongoDB (local installation or MongoDB Atlas account)
Git

Installation
Clone the Repository
bashCopygit clone https://github.com/yourusername/syncup.git
cd syncup
Backend Setup

Navigate to the backend directory:

bashCopycd backend

Install dependencies:

bashCopynpm install

Create a .env file in the backend directory with the following content:

CopyNODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/syncup
# For production, use your MongoDB Atlas URI
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/syncup
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
Replace your_jwt_secret_key_here with a strong random string for security.

Start the backend server:

bashCopy# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
The backend server will run on http://localhost:5000
Frontend Setup

Open a new terminal and navigate to the frontend directory:

bashCopycd frontend

Install dependencies:

bashCopynpm install

Start the frontend development server:

bashCopynpm start
The frontend application will open in your browser at http://localhost:3000
Project Structure
Copysyncup/
├── backend/                  # Backend code
│   ├── config/               # Configuration files
│   │   └── db.js             # Database connection
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   └── taskController.js
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Group.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   └── taskRoutes.js
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Entry point
│
└── frontend/                 # Frontend code
    ├── public/               # Static files
    ├── src/
    │   ├── components/       # Reusable components
    │   │   ├── auth/         # Authentication components
    │   │   ├── groups/       # Group management components
    │   │   ├── layout/       # Layout components
    │   │   └── tasks/        # Task management components
    │   ├── context/          # React context providers
    │   │   ├── AuthContext.js
    │   │   └── NotificationContext.js
    │   ├── pages/            # Page components
    │   │   ├── Dashboard.js
    │   │   ├── GroupDetails.js
    │   │   ├── GroupsPage.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── TaskDetails.js
    │   │   └── TasksPage.js
    │   ├── App.js            # Main component
    │   └── index.js          # Entry point
    └── package.json
API Endpoints
Authentication

POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
POST /api/auth/logout - Logout a user
GET /api/auth/profile - Get user profile

Tasks

GET /api/tasks - Get all accessible tasks
GET /api/tasks/:id - Get task by ID
POST /api/tasks - Create a new task
PUT /api/tasks/:id - Update a task
DELETE /api/tasks/:id - Delete a task
PATCH /api/tasks/:id/complete - Toggle task completion status

Groups

GET /api/groups - Get all user's groups
GET /api/groups/:id - Get group by ID
POST /api/groups - Create a new group
PUT /api/groups/:id - Update a group
DELETE /api/groups/:id - Delete a group
POST /api/groups/:id/members - Add a member to a group
DELETE /api/groups/:id/members/:userId - Remove a member from a group

Usage Guide

Registration & Login

Create a new account or log in with existing credentials


Dashboard

View summary information and recent activity
Quick navigation to tasks and groups


Managing Tasks

Create tasks with title, description, optional resource link, and tags
Set privacy level (private, group, public)
Filter tasks by completion status
Mark tasks as complete when finished


Group Collaboration

Create groups for teams or projects
Add members by email address
Share tasks with specific groups
Manage group membership



Technologies Used

Frontend:

React
React Router
Axios
Tailwind CSS
React Icons


Backend:

Node.js
Express.js
MongoDB
Mongoose
JSON Web Tokens (JWT)
bcryptjs



Contributing

Fork the repository
Create your feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add some amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
