import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCheck, FaTrash, FaEdit, FaLink, FaTag, FaUser, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import TaskForm from '../components/tasks/TaskForm';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Helper function for priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-blue-400';
      case 'High': return 'bg-red-500';
      case 'Medium':
      default: return 'bg-yellow-500';
    }
  };

  useEffect(() => {
    const fetchTaskAndGroups = async () => {
      setLoading(true);
      try {
        // Fetch task and groups in parallel
        const taskPromise = axios.get(`/tasks/${id}`);
        const groupsPromise = axios.get('/groups');
        
        const [taskRes, groupsRes] = await Promise.all([taskPromise, groupsPromise]);
        
        if (taskRes.data) {
          setTask(taskRes.data);
        }
        
        if (groupsRes.data) {
          setGroups(groupsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndGroups();
  }, [id]);

  const updateTask = async (taskId, taskData) => {
    try {
      const res = await axios.put(`/tasks/${taskId}`, taskData);
      setTask(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
      alert(err.response?.data?.message || 'Error updating task');
    }
  };

  const completeTask = async () => {
    try {
      const res = await axios.patch(`/tasks/${id}/complete`);
      setTask(res.data);
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
      alert(err.response?.data?.message || 'Error updating task status');
    }
  };

  const deleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/tasks/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete task:', err);
        alert(err.response?.data?.message || 'Error deleting task');
      }
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

  if (!task) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-medium">Task not found</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-3 text-yellow-700 underline hover:no-underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      {isEditing ? (
        <TaskForm
          task={task}
          updateTask={updateTask}
          groups={groups}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <div className="flex items-center mb-3">
                <h1 className="text-2xl font-bold text-neutral-800 mr-3">{task.title}</h1>
                <div className={`px-3 py-1 rounded-full flex items-center text-white text-sm font-medium ${getPriorityColor(task.priority || 'Medium')}`}>
                  {task.priority || 'Medium'} Priority
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                    task.completed
                      ? 'bg-secondary-100 text-secondary-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <FaCheck className="mr-1" />
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.accessLevel === 'private'
                      ? 'bg-neutral-100 text-neutral-800'
                      : task.accessLevel === 'group'
                      ? 'bg-accent-100 text-accent-800'
                      : 'bg-primary-100 text-primary-800'
                  }`}
                >
                  {task.accessLevel.charAt(0).toUpperCase() + task.accessLevel.slice(1)}
                </span>
                {task.accessLevel === 'group' && task.sharedWith && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 flex items-center">
                    <FaUsers className="mr-1" />
                    {task.sharedWith.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={completeTask}
                className={`btn ${
                  task.completed
                    ? 'btn-secondary'
                    : 'btn-success'
                } flex items-center`}
                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <FaCheck className="mr-2" />
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={deleteTask}
                className="btn btn-danger flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-neutral-700">Description</h3>
            <p className="text-neutral-700 whitespace-pre-line">{task.description}</p>
          </div>

          {task.resourceLink && (
            <div className="mb-6 p-4 border border-neutral-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-neutral-700 flex items-center">
                <FaLink className="mr-2 text-primary-500" /> Resource Link
              </h3>
              <a
                href={task.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline break-all"
              >
                {task.resourceLink}
              </a>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-neutral-700 flex items-center">
                <FaTag className="mr-2 text-neutral-500" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-4 mt-6 text-sm text-neutral-500 grid grid-cols-1 md:grid-cols-2 gap-2">
            {task.createdBy && (
              <div className="flex items-center">
                <FaUser className="mr-2 text-neutral-400" />
                <span>Created by: {task.createdBy.name || 'Unknown user'}</span>
              </div>
            )}
            {task.createdAt && (
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-neutral-400" />
                <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
              </div>
            )}
            {task.updatedAt && task.createdAt && task.updatedAt !== task.createdAt && (
              <div className="flex items-center col-span-full">
                <FaCalendarAlt className="mr-2 text-neutral-400" />
                <span>Last updated: {new Date(task.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;