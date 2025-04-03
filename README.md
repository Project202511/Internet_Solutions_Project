# 🗂️ Project Management App

A full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**, featuring a simple authentication system using **bcryptjs**.

---

## 📁 Project Structure

```
project-management-app/
├── client/       # React frontend
├── server/       # Express backend with MongoDB
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v14+)
- MongoDB installed and running locally (or MongoDB Atlas for cloud)
- Git

---

## 🔙 Backend Setup (`server/`)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB connection

If you're using **MongoDB locally**, no changes needed.  
If you're using **MongoDB Atlas**, update the URI in `server/index.js`:

```js
mongoose.connect("mongodb+srv://<user>:<password>@cluster.mongodb.net/pm_app");
```

> 🔐 You can also use a `.env` file and `dotenv` package to manage secrets.

### 3. Start the backend server

```bash
node index.js
```

Runs on: `http://localhost:5000`

---

## 🖥️ Frontend Setup (`client/`)

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Start the React app

```bash
npm start
```

Runs on: `http://localhost:3000`

---

## 🔐 Authentication (bcrypt-based)

The app features a simple login/register system:

- `/register`: Create new user with hashed password
- `/login`: Compare password using bcrypt
- On successful login, the task board is unlocked

---

## 🧪 Testing the App

1. Start **MongoDB** server locally:
   ```bash
   mongod
   ```
2. Run the backend:
   ```bash
   cd server
   node index.js
   ```
3. Run the frontend:
   ```bash
   cd client
   npm start
   ```

Visit `http://localhost:3000`, register or login, then create/manage tasks.

---

## ✨ Features

- 👥 User registration and login (no duplicate usernames)
- ✅ Add, view, and update tasks
- 📊 Kanban-style board (`TO DO`, `IN PROGRESS`, `DONE`)
- 🧩 Built with Tailwind CSS for a modern UI

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: bcryptjs

---

## 📌 Future Improvements

- JWT authentication for route protection
- User-specific tasks
- Due dates, priority, and assignee fields
- Drag & drop support (React DnD or similar)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📝 License

This project is licensed under the MIT License.
