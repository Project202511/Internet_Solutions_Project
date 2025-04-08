# 🚀 SyncUp - Collaborative Task Management Platform

**SyncUp** is a full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) to enable efficient team collaboration via shared tasks, group management, and real-time updates. The frontend features a clean, responsive UI built with **Tailwind CSS**.

---

## ✨ Features

- 🔐 **User Authentication** – Secure registration and login
- ✅ **Task Management** – Create, view, update, delete, and mark tasks complete
- 🔒 **Task Privacy Levels** – Set tasks as private, group-shared, or public
- 🔗 **Resource Links** – Add URLs to tasks for extra context
- 🏷️ **Task Tags** – Organize tasks with customizable tags
- 👥 **Group Management** – Create and manage collaborative groups
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile
- 🎯 **User-friendly UI** – Intuitive interface with real-time feedback & notifications

---

## 🛠 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm or yarn
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/syncup.git
cd syncup
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/syncup
# For production:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/syncup
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
# For development
npm run dev

# For production
npm start
```

The backend server runs at: **http://localhost:5000**

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm start
```

The frontend will open in your browser at: **http://localhost:3000**

---

## 📁 Project Structure

```
syncup/
├── backend/
│   ├── config/               # DB config
│   ├── controllers/          # API logic
│   ├── middleware/           # Auth middlewares
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── .env
│   └── server.js             # Server entry
│
└── frontend/
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # UI components
    │   ├── context/          # Global state
    │   ├── pages/            # Routes/views
    │   ├── App.js
    │   └── index.js
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login               |
| POST   | `/api/auth/logout`   | Logout              |
| GET    | `/api/auth/profile`  | Get user profile    |

---

### 📋 Tasks

| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/tasks`                  | Get all tasks            |
| GET    | `/api/tasks/:id`              | Get task by ID           |
| POST   | `/api/tasks`                  | Create task              |
| PUT    | `/api/tasks/:id`              | Update task              |
| DELETE | `/api/tasks/:id`              | Delete task              |
| PATCH  | `/api/tasks/:id/complete`     | Toggle complete status   |

---

### 👥 Groups

| Method | Endpoint                                     | Description               |
|--------|----------------------------------------------|---------------------------|
| GET    | `/api/groups`                                | List user groups          |
| GET    | `/api/groups/:id`                            | Get group by ID           |
| POST   | `/api/groups`                                | Create a group            |
| PUT    | `/api/groups/:id`                            | Update group              |
| DELETE | `/api/groups/:id`                            | Delete group              |
| POST   | `/api/groups/:id/members`                    | Add group member          |
| DELETE | `/api/groups/:id/members/:userId`            | Remove group member       |

---

## 🧭 Usage Guide

### 🧑‍💼 Registration & Login

- Sign up with a valid email and password
- Log in to access your dashboard and tasks

### 📊 Dashboard

- View your recent activity
- Navigate easily to tasks and groups

### 📌 Task Management

- Add task title, description, resource links & tags
- Assign task privacy (private, group, public)
- Toggle completion and filter tasks by status

### 🤝 Group Collaboration

- Create project-specific groups
- Add or remove members via email
- Share and collaborate on tasks within groups

---

## ⚙️ Technologies Used

### 💻 Frontend

- React
- React Router
- Axios
- Tailwind CSS
- React Icons

### 🔧 Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push the branch  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

