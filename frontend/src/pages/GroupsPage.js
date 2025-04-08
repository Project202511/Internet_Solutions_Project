import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';
import { useNotification } from '../context/NotificationContext';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const { success, error: showError } = useNotification();

  // Fetch groups
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/groups');
      setGroups(res.data);
    } catch (err) {
      setError('Failed to fetch groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> Add Group
        </button>
      </div>

      {showGroupForm && (
        <div className="mb-6">
          <GroupForm 
            addGroup={addGroup} 
            onCancel={() => setShowGroupForm(false)} 
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <GroupList groups={groups} />
      )}
    </div>
  );
};

export default GroupsPage;