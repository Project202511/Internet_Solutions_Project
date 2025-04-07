import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCheck, FaTrash } from 'react-icons/fa';
import TaskForm from '../components/tasks/TaskForm';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTaskAndGroups = async () => {
      setLoading(true);
      try {
        const taskPromise = axios.get(`/tasks/${id}`);
        const groupsPromise = axios.get('/groups');
        const [taskRes, groupsRes] = await Promise.all([taskPromise, groupsPromise]);

        if (taskRes.data) setTask(taskRes.data);
        if (groupsRes.data) setGroups(groupsRes.data);
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

  if (!task) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {task.title || 'Untitled Task'}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    task.accessLevel === 'private'
                      ? 'bg-gray-100 text-gray-800'
                      : task.accessLevel === 'group'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {task.accessLevel.charAt(0).toUpperCase() + task.accessLevel.slice(1)}
                </span>
                {task.accessLevel === 'group' && task.sharedWith && (
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                    Group: {task.sharedWith.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={completeTask}
                className={`p-2 rounded-full ${
                  task.completed
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <FaCheck size={14} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit
              </button>
              <button
                onClick={deleteTask}
                className="btn btn-danger"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
          </div>

          {task.resourceLink && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Resource</h3>
              <a
                href={task.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                {task.resourceLink}
              </a>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 text-sm text-gray-500">
            {task.createdBy?.name && <p>Created by: {task.createdBy.name}</p>}
            {task.createdAt && (
              <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            )}
            {task.updatedAt &&
              task.updatedAt !== task.createdAt && (
                <p>Last updated: {new Date(task.updatedAt).toLocaleString()}</p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
