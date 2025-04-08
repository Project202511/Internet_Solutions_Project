import React, { useState } from 'react';
import { FaTimes, FaUsers, FaEdit } from 'react-icons/fa';

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
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          {group ? <FaEdit className="mr-2" /> : <FaUsers className="mr-2" />}
          {group ? 'Edit Group' : 'Create New Group'}
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
          <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="name">
            Group Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
            className="input h-24"
            placeholder="Describe the purpose of this group"
          ></textarea>
        </div>
        
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
            {group ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;