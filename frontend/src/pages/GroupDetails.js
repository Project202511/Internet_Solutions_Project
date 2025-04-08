import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaTrash, FaUserPlus, FaUserMinus, FaEdit, 
  FaUsers, FaUserShield, FaClipboardList, FaCalendarAlt 
} from 'react-icons/fa';
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-neutral-800">{group.name}</h1>
                {isOwner && (
                  <span className="ml-3 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <FaUserShield className="mr-1" /> Owner
                  </span>
                )}
              </div>
              <p className="text-neutral-500 flex items-center">
                <FaCalendarAlt className="mr-1" /> Created {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
            {isOwner && (
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={deleteGroup}
                  className="btn btn-danger flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-neutral-700">
              {group.description || 'No description provided.'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUsers className="mr-2 text-primary-500" /> 
              Members ({group.members?.length || 0})
            </h3>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-neutral-200">
                {group.members?.map((member) => (
                  <li key={member._id} className="p-4 flex justify-between items-center hover:bg-neutral-50">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">
                          {member.name}
                          {member._id === group.owner._id && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-neutral-500 text-sm">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {isOwner && member._id !== group.owner._id && (
                      <button
                        onClick={() => removeMember(member._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        title="Remove from group"
                      >
                        <FaUserMinus />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {isOwner && (
              <div className="mt-6 bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-3">Add Member</h4>
                <form onSubmit={addMember} className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserPlus className="text-neutral-500" />
                    </div>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="input pl-10 flex-1"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-primary ${
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

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 flex items-center">
            <FaClipboardList className="mr-2 text-primary-500" /> Group Tasks
          </h2>
          <div className="text-neutral-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
        
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-neutral-200">
            <p className="text-neutral-500">No tasks in this group yet.</p>
            <p className="text-neutral-500 text-sm mt-2">
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