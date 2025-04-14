import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';
import { useNotification } from '../context/NotificationContext';

/**
 * GroupsPage - A responsive page to display and manage groups
 * 
 * Features:
 * - Responsive header with adaptive spacing
 * - Full-width action button on mobile
 * - Mobile-optimized loading state
 * - Responsive group creation form
 */
const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const { success, error: showError } = useNotification();

  // Fetch groups with useCallback to prevent unnecessary re-renders
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/groups');
      setGroups(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch groups');
      console.error(err);
      showError('Could not load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Add group
  const addGroup = async (group) => {
    try {
      const res = await axios.post('/groups', group);
      setGroups([...groups, res.data]);
      setShowGroupForm(false);
      success('Group created successfully!');
    } catch (err) {
      console.error('Failed to create group', err);
      showError(err.response?.data?.message || 'Error creating group');
    }
  };

  // Toggle group form and close it when clicking outside
  const toggleGroupForm = () => {
    setShowGroupForm(!showGroupForm);
  };

  return (
    <div className="px-2 sm:px-0">
      {/* Responsive header with adaptive spacing and full-width button on mobile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Groups</h1>
        <button
          onClick={toggleGroupForm}
          className="w-full sm:w-auto btn btn-primary flex items-center justify-center sm:justify-start bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          aria-label="Add new group"
        >
          <FaPlus className="mr-2" /> Add Group
        </button>
      </div>

      {/* Group form with proper spacing */}
      {showGroupForm && (
        <div className="mb-4 sm:mb-6">
          <GroupForm 
            addGroup={addGroup} 
            onCancel={() => setShowGroupForm(false)} 
          />
        </div>
      )}

      {/* Responsive loading, error and content states */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-neutral-200">
          <p className="text-neutral-500">No groups found. Create your first group to get started!</p>
        </div>
      ) : (
        <GroupList groups={groups} />
      )}
    </div>
  );
};

export default GroupsPage;