import React, { useState } from 'react';
import { FaTimes, FaEdit, FaClipboardList } from 'react-icons/fa';

/**
 * TaskForm - A fully responsive form for creating and editing tasks
 * 
 * Adapts layout for mobile devices and includes accessible form controls.
 * 
 * @param {function} addTask - Function to create a new task
 * @param {function} updateTask - Function to update an existing task
 * @param {object} task - Existing task data for edit mode (optional)
 * @param {array} groups - Available groups for sharing
 * @param {function} onCancel - Function called when form is cancelled
 */
const TaskForm = ({ addTask, updateTask, task, groups, onCancel }) => {
  // ✅ Updated priority color logic: Low is green now
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-green-400 hover:bg-green-500'; // ✅ Low changed to green
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
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
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
      priority
    };

    if (task) {
      updateTask(task._id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-neutral-200 w-full mb-6">
      {/* Form Header - Improved for mobile */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 flex items-center break-words pr-2">
          {task ? <FaEdit className="mr-2 flex-shrink-0" /> : <FaClipboardList className="mr-2 flex-shrink-0" />}
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-neutral-500 hover:text-neutral-700 p-2 rounded-full hover:bg-neutral-100"
          aria-label="Close form"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            placeholder="Task title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1" role="alert">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-20 sm:h-24 ${
              errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            placeholder="Task description"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1" role="alert">{errors.description}</p>}
        </div>

        {/* Priority Selector - Styled for desktop width and color adjustments */}
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2">
            Priority Level
          </label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            {['Low', 'Medium', 'High'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: value })}
                className={`py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  // ✅ Priority-specific widths on desktop
                  value === 'Low' ? 'sm:min-w-[5rem]' :
                  value === 'Medium' ? 'sm:min-w-[7rem]' :
                  value === 'High' ? 'sm:min-w-[10rem]' : ''
                } ${
                  formData.priority === value
                    ? getPriorityColor(value) + ' ring-2 ring-offset-2 ring-' + (
                        value === 'High' ? 'red' : 
                        value === 'Low' ? 'green' : 'yellow') + '-400' // ✅ Ring matches new priority colors
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="text-neutral-500 text-xs mt-1">
            Select the priority level for this task
          </p>
        </div>

        {/* Resource Link Field */}
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
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://example.com"
          />
        </div>

        {/* Tags Field */}
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
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="important, project X (comma separated)"
          />
          <p className="text-neutral-500 text-xs mt-1">Separate tags with commas</p>
        </div>

        {/* Access Level */}
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2">
            Access Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['private', 'group', 'public'].map((level) => (
              <label
                key={level}
                className="bg-white border border-neutral-300 rounded-md px-3 py-2 flex items-center cursor-pointer transition-colors hover:bg-neutral-50"
              >
                <input
                  type="radio"
                  name="accessLevel"
                  value={level}
                  checked={accessLevel === level}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-primary-600 mr-2"
                />
                <span className="text-neutral-700 capitalize">{level}</span>
              </label>
            ))}
          </div>
          <p className="text-neutral-500 text-xs mt-1">Choose who can see this task</p>
        </div>

        {/* Group Selector */}
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
              className={`w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.sharedWith ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
            >
              <option value="">Select a group</option>
              {groups?.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.sharedWith && <p className="text-red-500 text-xs mt-1" role="alert">{errors.sharedWith}</p>}
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md order-1 sm:order-2"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
