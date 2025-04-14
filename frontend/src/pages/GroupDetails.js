import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaTrash, FaUserPlus, FaUserMinus, FaEdit, 
  FaUsers, FaUserShield, FaClipboardList, FaCalendarAlt,
  FaEllipsisV
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import GroupForm from '../components/groups/GroupForm';
import TaskList from '../components/tasks/TaskList';

/**
 * GroupDetails - Display and manage group information
 * 
 * A responsive component that handles:
 * - Group information display
 * - Member management
 * - Group task display
 * - Optimized layouts for mobile and desktop
 */
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
  const [showActionMenu, setShowActionMenu] = useState(false);

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

  // Toggle the mobile action menu
  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
  };

  // Close action menu if user clicks elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (showActionMenu) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showActionMenu]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
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
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
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
    <div className="px-2 sm:px-0">
      {/* Back button - Same on all screen sizes */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-4 sm:mb-6"
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-neutral-200 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 sm:mb-6">
            {/* Group title section - Stacked on mobile */}
            <div>
              <div className="flex flex-wrap items-center mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 mr-2">{group.name}</h1>
                {isOwner && (
                  <span className="mt-1 sm:mt-0 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <FaUserShield className="mr-1" /> Owner
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 flex items-center">
                <FaCalendarAlt className="mr-1" /> Created {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Action Buttons - Different display for mobile/desktop */}
            {isOwner && (
              <>
                {/* Desktop actions */}
                <div className="hidden sm:flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary flex items-center px-3 py-2 bg-primary-600 text-white rounded-md"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={deleteGroup}
                    className="btn btn-danger flex items-center px-3 py-2 bg-red-600 text-white rounded-md"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
                
                {/* Mobile actions menu */}
                <div className="sm:hidden relative mt-3 self-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActionMenu();
                    }}
                    className="p-2 rounded-full bg-neutral-100 text-neutral-700"
                    aria-label="Group actions"
                  >
                    <FaEllipsisV />
                  </button>
                  
                  {showActionMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-neutral-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowActionMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                        >
                          <FaEdit className="mr-2 text-primary-600" /> Edit Group
                        </button>
                        <button
                          onClick={() => {
                            deleteGroup();
                            setShowActionMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                        >
                          <FaTrash className="mr-2 text-red-600" /> Delete Group
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Description box */}
          <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Description</h3>
            <p className="text-neutral-700 text-sm sm:text-base">
              {group.description || 'No description provided.'}
            </p>
          </div>

          {/* Members section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <FaUsers className="mr-2 text-primary-500" /> 
              Members ({group.members?.length || 0})
            </h3>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-neutral-200">
                {group.members?.map((member) => (
                  <li key={member._id} className="p-3 sm:p-4 flex justify-between items-center hover:bg-neutral-50">
                    <div className="flex items-center min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-800 text-sm sm:text-base truncate">
                          {member.name}
                          {member._id === group.owner._id && (
                            <span className="ml-1 sm:ml-2 text-xs bg-primary-100 text-primary-800 px-1 sm:px-2 py-0.5 rounded-full">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-neutral-500 text-xs sm:text-sm truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {isOwner && member._id !== group.owner._id && (
                      <button
                        onClick={() => removeMember(member._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 flex-shrink-0 ml-2"
                        title="Remove from group"
                        aria-label="Remove from group"
                      >
                        <FaUserMinus size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Member form - Same on mobile but with responsive padding */}
            {isOwner && (
              <div className="mt-4 sm:mt-6 bg-neutral-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-3 text-sm sm:text-base">Add Member</h4>
                <form onSubmit={addMember} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserPlus className="text-neutral-500" />
                    </div>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md ${
                      addingMember ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={addingMember}
                  >
                    {addingMember ? 'Adding...' : 'Add Member'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 flex items-center">
            <FaClipboardList className="mr-2 text-primary-500" /> Group Tasks
          </h2>
          <div className="text-neutral-500 text-sm sm:text-base">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
        
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-neutral-200">
            <p className="text-neutral-500">No tasks in this group yet.</p>
            <p className="text-neutral-500 text-xs sm:text-sm mt-2">
              Tasks with group access level shared with this group will appear here.
            </p>
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