const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    resourceLink: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium', // Medium priority by defaul
    },
      tags: [
      {
        type: String,
        trim: true,
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    accessLevel: {
      type: String,
      enum: ['private', 'group', 'public'],
      default: 'private',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
taskSchema.index({ createdBy: 1 });
taskSchema.index({ accessLevel: 1 });
taskSchema.index({ tags: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;