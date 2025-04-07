import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrash, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import GroupForm from '../components/groups/GroupForm';
import TaskList from '../components/tasks/TaskList';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    const fetchGroupAndTasks = async () => {
      setLoading(true);
      try {
        // Fetch group details
        const groupRes = await axios.get(`/groups/${id}`);
        setGroup(groupRes.data);

        // Fetch tasks associated with this group
        const tasksRes = await axios.get('/tasks');
        const groupTasks = tasksRes.data.filter(
          task => task.accessLevel === 'group' && task.sharedWith?._id === id
        );
        setTasks(groupTasks);
      } catch (err) {
        setError('Failed to fetch group details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndTasks();
  }, [id]);

  const updateGroup = async (groupId, groupData) => {
    try {
      const res = await axios.put(`/groups/${groupId}`, groupData);
      setGroup(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update group', err);
      alert(err.response?.data?.message || 'Error updating group');
    }
  };

  const deleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await axios.delete(`/groups/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete group', err);
        alert(err.response?.data?.message || 'Error deleting group');
      }
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setAddingMember(true);
    try {
      const res = await axios.post(`/groups/${id}/members`, { email: newMemberEmail });
      setGroup(res.data);
      setNewMemberEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const removeMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member from the group?')) {
      try {
        const res = await axios.delete(`/groups/${id}/members/${memberId}`);
        setGroup(res.data);
      } catch (err) {
        console.error('Failed to remove member', err);
        alert(err.response?.data?.message || 'Error removing member');
      }
    }
  };

  const completeTask = async (taskId) => {
    try {
      const res = await axios.patch(`/tasks/${taskId}/complete`);
      setTasks(tasks.map(task => 
        task._id === taskId ? res.data : task
      ));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error:</p>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-3 text-red-700 underline hover:no-underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-medium">Group not found</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-3 text-yellow-700 underline hover:no-underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = group.owner._id === user?._id;

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      {isEditing ? (
        <GroupForm
          group={group}
          updateGroup={updateGroup}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{group.name}</h1>
              <p className="text-sm text-gray-500">
                Owner: {group.owner?.name || 'Unknown user'}
              </p>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={deleteGroup}
                  className="btn btn-danger"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">
              {group.description || 'No description provided.'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Members ({group.members?.length || 0})</h3>
            <ul className="divide-y divide-gray-200">
              {group.members?.map((member) => (
                <li key={member._id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {member.name}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      {member.email}
                    </span>
                    {member._id === group.owner._id && (
                      <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                  {isOwner && member._id !== group.owner._id && (
                    <button
                      onClick={() => removeMember(member._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove from group"
                    >
                      <FaUserMinus />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isOwner && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Add Member</h4>
                <form onSubmit={addMember} className="flex space-x-2">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="input flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className={`btn btn-primary flex items-center ${
                      addingMember ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={addingMember}
                  >
                    <FaUserPlus className="mr-1" />
                    {addingMember ? 'Adding...' : 'Add'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Tasks</h2>
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No tasks in this group yet.</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            completeTask={completeTask}
            deleteTask={deleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default GroupDetails;