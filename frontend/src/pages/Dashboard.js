import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaFilter, FaTasks, FaUsers, FaCheckCircle, 
  FaClock, FaTimes, FaEllipsisV 
} from 'react-icons/fa';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';

/**
 * Dashboard - Main dashboard component with responsive layout
 * 
 * Features:
 * - Responsive stats cards grid (3 columns on desktop, 1 on mobile)
 * - Mobile-optimized action buttons and filtering
 * - Responsive tabs that transform to a dropdown on smaller screens
 * - Optimized forms display for different screen sizes
 */
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch tasks with optimized error handling
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    try {
      const res = await axios.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    }
  }, []);

  useEffect(() => {
    // Load both data sources
    Promise.all([fetchTasks(), fetchGroups()]);
  }, [fetchTasks, fetchGroups]);

  // Add task
  const addTask = async (task) => {
    try {
      const res = await axios.post('/tasks', task);
      setTasks([...tasks, res.data]);
      setShowTaskForm(false);
    } catch (err) {
      console.error('Failed to create task', err);
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  // Add group
  const addGroup = async (group) => {
    try {
      const res = await axios.post('/groups', group);
      setGroups([...groups, res.data]);
      setShowGroupForm(false);
    } catch (err) {
      console.error('Failed to create group', err);
      alert(err.response?.data?.message || 'Error creating group');
    }
  };

  // Complete task
  const completeTask = async (id) => {
    try {
      const res = await axios.patch(`/tasks/${id}/complete`);
      setTasks(tasks.map(task => 
        task._id === id ? res.data : task
      ));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Toggle form and handle closing other forms
  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    if (!showTaskForm) {
      setShowGroupForm(false); // Close other form if opening this one
      setShowMobileFilter(false); // Close mobile filter dropdown
    }
  };

  const toggleGroupForm = () => {
    setShowGroupForm(!showGroupForm);
    if (!showGroupForm) {
      setShowTaskForm(false); // Close other form if opening this one
      setShowMobileFilter(false); // Close mobile filter dropdown
    }
  };

  return (
    <div className="px-2 sm:px-0">
      {/* Page Header - Responsive text size */}
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 sm:mb-8">Dashboard</h1>
      
      {/* Stats Section - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Tasks Card */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-500 p-3 sm:p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-primary-700 text-xs sm:text-sm font-medium">Total Tasks</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-900">{tasks.length}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-primary-500 rounded-lg text-white">
              <FaTasks size={20} />
            </div>
          </div>
        </div>
        
        {/* Completed Tasks Card */}
        <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100 border-l-4 border-secondary-500 p-3 sm:p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-secondary-700 text-xs sm:text-sm font-medium">Completed</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary-900">{completedTasks}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-secondary-500 rounded-lg text-white">
              <FaCheckCircle size={20} />
            </div>
          </div>
        </div>
        
        {/* Pending Tasks Card */}
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-500 p-3 sm:p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-amber-700 text-xs sm:text-sm font-medium">Pending</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-900">{pendingTasks}</h3>
            </div>
            <div className="p-2 sm:p-3 bg-amber-500 rounded-lg text-white">
              <FaClock size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Full width on mobile */}
      <div className="flex border-b border-neutral-200 mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2 px-4 font-medium text-sm whitespace-nowrap flex-1 ${
            activeTab === 'tasks' 
              ? 'text-primary-600 border-b-2 border-primary-500' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <FaTasks className="inline mr-2" /> Tasks
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`py-2 px-4 font-medium text-sm whitespace-nowrap flex-1 ${
            activeTab === 'groups' 
              ? 'text-primary-600 border-b-2 border-primary-500' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <FaUsers className="inline mr-2" /> Groups
        </button>
      </div>

      {/* Tasks Tab Content */}
      {activeTab === 'tasks' && (
        <div className="mb-6">
          {/* Task Header with responsive actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
            {/* Title and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-semibold text-neutral-700">My Tasks</h2>
              
              {/* Desktop Filter */}
              <div className="hidden sm:flex items-center ml-0 sm:ml-4">
                <FaFilter className="text-neutral-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Filter tasks"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              {/* Mobile Filter Button */}
              <div className="sm:hidden flex justify-between items-center">
                <button 
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="flex items-center text-neutral-600 bg-white border border-neutral-300 rounded-md px-3 py-1.5"
                >
                  <FaFilter className="mr-2" /> 
                  <span>Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons - Full width on mobile */}
            <button
              onClick={toggleTaskForm}
              className="w-full sm:w-auto btn btn-primary flex items-center justify-center sm:justify-start bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              <FaPlus className="mr-2" /> Add Task
            </button>
          </div>
          
          {/* Mobile Filter Dropdown */}
          {showMobileFilter && (
            <div className="sm:hidden mb-4 bg-white border border-neutral-200 rounded-md shadow-sm p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Filter Tasks</h3>
                <button 
                  onClick={() => setShowMobileFilter(false)}
                  className="text-neutral-400"
                  aria-label="Close filter"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'completed', 'pending'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowMobileFilter(false);
                    }}
                    className={`py-2 px-3 rounded-md text-center text-sm ${
                      filter === option
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Task Form */}
          {showTaskForm && (
            <div className="mb-6">
              <TaskForm 
                addTask={addTask} 
                groups={groups} 
                onCancel={() => setShowTaskForm(false)} 
              />
            </div>
          )}

          {/* Loading, Error or Task List */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              completeTask={completeTask} 
              deleteTask={deleteTask} 
            />
          )}
        </div>
      )}

      {/* Groups Tab Content */}
      {activeTab === 'groups' && (
        <div>
          {/* Group Header with responsive actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-xl font-semibold text-neutral-700">My Groups</h2>
            <button
              onClick={toggleGroupForm}
              className="w-full sm:w-auto btn btn-primary flex items-center justify-center sm:justify-start bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              <FaPlus className="mr-2" /> Add Group
            </button>
          </div>

          {/* Group Form */}
          {showGroupForm && (
            <div className="mb-6">
              <GroupForm 
                addGroup={addGroup} 
                onCancel={() => setShowGroupForm(false)} 
              />
            </div>
          )}

          {/* Group List */}
          <GroupList groups={groups} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;