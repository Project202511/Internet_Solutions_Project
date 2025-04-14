import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus, FaFilter, FaTimes } from 'react-icons/fa';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useNotification } from '../context/NotificationContext';

/**
 * TasksPage - A responsive page for viewing and managing tasks
 * 
 * Features:
 * - Mobile-first responsive design
 * - Filter controls optimized for touch devices
 * - Responsive task layout
 * - Improved loading states
 */
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { success, error: showError } = useNotification();

  // Fetch tasks using useCallback to prevent unnecessary re-renders
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
      showError('Could not load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Fetch groups (for task form)
  const fetchGroups = useCallback(async () => {
    try {
      const res = await axios.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    }
  }, []);

  useEffect(() => {
    // Fetch data on component mount
    Promise.all([fetchTasks(), fetchGroups()]);
  }, [fetchTasks, fetchGroups]);

  // Add task
  const addTask = async (task) => {
    try {
      const res = await axios.post('/tasks', task);
      setTasks([...tasks, res.data]);
      setShowTaskForm(false);
      success('Task created successfully!');
    } catch (err) {
      console.error('Failed to create task', err);
      showError(err.response?.data?.message || 'Error creating task');
    }
  };

  // Complete task
  const completeTask = async (id) => {
    try {
      const res = await axios.patch(`/tasks/${id}/complete`);
      setTasks(tasks.map(task => 
        task._id === id ? res.data : task
      ));
      success('Task status updated!');
    } catch (err) {
      console.error('Failed to update task', err);
      showError('Error updating task status');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
        success('Task deleted successfully!');
      } catch (err) {
        console.error('Failed to delete task', err);
        showError('Error deleting task');
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

  // Toggle task form and close filter dropdown
  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    if (!showTaskForm) {
      setShowMobileFilter(false);
    }
  };

  return (
    <div className="px-2 sm:px-0">
      {/* Page Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={toggleTaskForm}
          className="w-full sm:w-auto btn btn-primary flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          aria-label="Add new task"
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>

      {/* Filter Controls - Different on mobile vs desktop */}
      <div className="mb-4">
        {/* Desktop filter - hidden on mobile */}
        <div className="hidden sm:flex items-center">
          <FaFilter className="text-neutral-500 mr-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            aria-label="Filter tasks"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="pending">Pending Tasks</option>
          </select>
        </div>
        
        {/* Mobile filter button */}
        <div className="sm:hidden">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center justify-between w-full text-left bg-white border border-neutral-300 rounded-md px-3 py-2"
          >
            <div className="flex items-center">
              <FaFilter className="text-neutral-500 mr-2" /> 
              <span>Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            </div>
            {showMobileFilter ? <FaTimes className="text-neutral-500" /> : <span className="text-neutral-500">▼</span>}
          </button>
          
          {/* Mobile filter dropdown */}
          {showMobileFilter && (
            <div className="mt-2 bg-white border border-neutral-200 rounded-md shadow-sm">
              <div className="grid grid-cols-1 gap-0 divide-y divide-neutral-200">
                {['all', 'completed', 'pending'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowMobileFilter(false);
                    }}
                    className={`py-3 px-4 text-left ${
                      filter === option
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-neutral-700'
                    }`}
                  >
                    {option === 'all' ? 'All Tasks' : 
                     option === 'completed' ? 'Completed Tasks' : 
                     'Pending Tasks'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <div className="mb-4 sm:mb-6">
          <TaskForm 
            addTask={addTask} 
            groups={groups} 
            onCancel={() => setShowTaskForm(false)} 
          />
        </div>
      )}

      {/* Loading, Error and Task List States */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-neutral-200">
          <p className="text-neutral-500">No {filter !== 'all' ? filter : ''} tasks found.</p>
          <p className="text-neutral-500 text-sm mt-1">
            {filter !== 'all' 
              ? `Try changing the filter or create a new task.` 
              : `Click "Add Task" to create your first task.`}
          </p>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          completeTask={completeTask} 
          deleteTask={deleteTask} 
        />
      )}

      {/* Task count display */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="mt-4 text-center text-sm text-neutral-500">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {filter !== 'all' ? ` (${filter})` : ''}
        </div>
      )}
    </div>
  );
};

export default TasksPage;