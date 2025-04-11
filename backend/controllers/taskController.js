const Task = require('../models/Task');
const Group = require('../models/Group');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, resourceLink, tags, accessLevel, sharedWith, priority } = req.body;

    // Validate sharedWith if accessLevel is group
    if (accessLevel === 'group' && sharedWith) {
      const group = await Group.findById(sharedWith);
      
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      // Check if user is a member of the group
      if (!group.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'You are not a member of this group' });
      }
    }

    const task = await Task.create({
      title,
      description,
      resourceLink: resourceLink || '',
      tags: tags || [],
      accessLevel: accessLevel || 'private',
      sharedWith: accessLevel === 'group' ? sharedWith : null,
      priority: priority || 'Medium', // Default to medium if not specified
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Get user's personal tasks and public tasks
    const personalTasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { accessLevel: 'public' }
      ]
    }).populate('createdBy', 'name email');

    // Get tasks shared with the user through groups
    const userGroups = await Group.find({ members: req.user._id });
    const groupIds = userGroups.map(group => group._id);
    
    const groupTasks = await Task.find({
      accessLevel: 'group',
      sharedWith: { $in: groupIds },
      // Exclude tasks created by the user to avoid duplicates
      createdBy: { $ne: req.user._id }
    }).populate('createdBy', 'name email').populate('sharedWith', 'name');

    // Combine tasks without duplicates
    const allTasks = [...personalTasks, ...groupTasks];
    
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('sharedWith', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to view this task
    if (task.accessLevel === 'private' && task.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    if (task.accessLevel === 'group') {
      const group = await Group.findById(task.sharedWith);
      
      if (!group || !group.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to view this task' });
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the creator of the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // If changing to group access, verify the group exists and user is a member
    if (req.body.accessLevel === 'group' && req.body.sharedWith) {
      const group = await Group.findById(req.body.sharedWith);
      
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      if (!group.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'You are not a member of this group' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('sharedWith', 'name');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the creator of the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to mark as completed
    // For private tasks, only the creator can mark as completed
    if (task.accessLevel === 'private' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this task' });
    }

    // For group tasks, only group members can mark as completed
    if (task.accessLevel === 'group') {
      const group = await Group.findById(task.sharedWith);
      
      if (!group || !group.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to complete this task' });
      }
    }

    task.completed = !task.completed; // Toggle completion status
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('sharedWith', 'name');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
};