const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
const User = require('./models/User');
const bcrypt = require('bcryptjs');



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/pm_app');

// GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST a task
app.post('/tasks', async (req, res) => {
  const task = await Task.create({ name: req.body.name });
  res.json(task);
});

// PUT update task status
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(task);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Username already taken' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

  res.json({ message: 'Login successful' });
});

