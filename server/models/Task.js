const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    default: 'TO DO',
    enum: ['TO DO', 'IN PROGRESS', 'DONE']
  }
});

module.exports = mongoose.model('Task', TaskSchema);
