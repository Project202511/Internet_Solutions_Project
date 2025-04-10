import React, { useState } from 'react';
import { FaTimes, FaEdit, FaClipboardList } from 'react-icons/fa';

const TaskForm = ({ addTask, updateTask, task, groups, onCancel }) => {
  // Helper function for priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-blue-400 hover:bg-blue-500';
      case 'High': return 'bg-red-500 hover:bg-red-600';
      case 'Medium':
      default: return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    resourceLink: task?.resourceLink || '',
    tags: task?.tags?.join(', ') || '',
    accessLevel: task?.accessLevel || 'private',
    sharedWith: task?.sharedWith?._id || '',
    priority: task?.priority || 'Medium', // Default to medium priority
  });
  
  const [errors, setErrors] = useState({});
  
  const { title, description, resourceLink, tags, accessLevel, sharedWith, priority } = formData;
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is changed
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''});
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (accessLevel === 'group' && !sharedWith) newErrors.sharedWith = 'Please select a group';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Process tags
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const taskData = {
      title,
      description,
      resourceLink,
      tags: tagsArray,
      accessLevel,
      sharedWith: accessLevel === 'group' ? sharedWith : null,
      priority // Include priority in the task data
    };
    
    if (task) {
      updateTask(task._id, taskData);
    } else {
      addTask(taskData);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          {task ? <FaEdit className="mr-2" /> : <FaClipboardList className="mr-2" />}
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="Task title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            className={`input h-24 ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="Task description"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        
        {/* Priority Level Selection */}
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2">
            Priority Level
          </label>
          <div className="flex space-x-2">
            {['Low', 'Medium', 'High'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: value })}
                className={`flex-1 py-2 rounded-md text-white font-medium transition-colors ${
                  formData.priority === value
                    ? getPriorityColor(value) + ' ring-2 ring-offset-2 ring-' + (
                        value === 'High' ? 'red' : 
                        value === 'Low' ? 'blue' : 'yellow') + '-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="resourceLink">
            Resource Link (Optional)
          </label>
          <input
            type="url"
            id="resourceLink"
            name="resourceLink"
            value={resourceLink}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags (Optional)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tags}
            onChange={handleChange}
            className="input"
            placeholder="important, project X (comma separated)"
          />
          <p className="text-neutral-500 text-xs mt-1">Separate tags with commas</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2">
            Access Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="bg-white border border-neutral-300 rounded-md px-3 py-2 flex items-center cursor-pointer transition-colors hover:bg-neutral-50">
              <input
                type="radio"
                name="accessLevel"
                value="private"
                checked={accessLevel === 'private'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-primary-600 mr-2"
              />
              <span className="text-neutral-700">Private</span>
            </label>
            
            <label className="bg-white border border-neutral-300 rounded-md px-3 py-2 flex items-center cursor-pointer transition-colors hover:bg-neutral-50">
              <input
                type="radio"
                name="accessLevel"
                value="group"
                checked={accessLevel === 'group'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-primary-600 mr-2"
              />
              <span className="text-neutral-700">Group</span>
            </label>
            
            <label className="bg-white border border-neutral-300 rounded-md px-3 py-2 flex items-center cursor-pointer transition-colors hover:bg-neutral-50">
              <input
                type="radio"
                name="accessLevel"
                value="public"
                checked={accessLevel === 'public'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-primary-600 mr-2"
              />
              <span className="text-neutral-700">Public</span>
            </label>
          </div>
        </div>
        
        {accessLevel === 'group' && (
          <div className="mb-4">
            <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="sharedWith">
              Share with Group *
            </label>
            <select
              id="sharedWith"
              name="sharedWith"
              value={sharedWith}
              onChange={handleChange}
              className={`w-full border border-neutral-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.sharedWith ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            >
              <option value="">Select a group</option>
              {groups?.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.sharedWith && <p className="text-red-500 text-xs mt-1">{errors.sharedWith}</p>}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;