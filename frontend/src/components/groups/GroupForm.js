import React, { useState } from 'react';
import { FaTimes, FaUsers, FaEdit } from 'react-icons/fa';

/**
 * GroupForm - A responsive form component for creating and editing groups
 * 
 * @param {function} addGroup - Function to create a new group
 * @param {function} updateGroup - Function to update an existing group
 * @param {object} group - Existing group data for edit mode (optional)
 * @param {function} onCancel - Function to call when form is cancelled
 */
const GroupForm = ({ addGroup, updateGroup, group, onCancel }) => {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || ''
  });
  
  const [errors, setErrors] = useState({});
  
  const { name, description } = formData;
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is changed
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ''});
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Group name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const groupData = {
      name,
      description
    };
    
    if (group) {
      updateGroup(group._id, groupData);
    } else {
      addGroup(groupData);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-neutral-200 w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 flex items-center break-words pr-2">
          {group ? <FaEdit className="mr-2 flex-shrink-0" /> : <FaUsers className="mr-2 flex-shrink-0" />}
          {group ? 'Edit Group' : 'Create New Group'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-neutral-500 hover:text-neutral-700 p-2 rounded-full hover:bg-neutral-100"
          aria-label="Close form"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="name">
            Group Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            className={`input w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            placeholder="Enter group name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            className="input w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24 sm:h-32"
            placeholder="Describe the purpose of this group"
          ></textarea>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary w-full sm:w-auto px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white order-1 sm:order-2"
          >
            {group ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;