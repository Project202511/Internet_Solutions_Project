import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaFilter } from 'react-icons/fa';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filter, setFilter] = useState('all'); // all, completed, pending

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, []);

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

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`btn ${activeTab === 'groups' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Groups
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tasks' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-700">My Tasks</h2>
              <div className="ml-4 flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="btn btn-primary flex items-center"
            >
              <FaPlus className="mr-2" /> Add Task
            </button>
          </div>

          {showTaskForm && (
            <div className="mb-6">
              <TaskForm 
                addTask={addTask} 
                groups={groups} 
                onCancel={() => setShowTaskForm(false)} 
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
            <TaskList 
              tasks={filteredTasks} 
              completeTask={completeTask} 
              deleteTask={deleteTask} 
            />
          )}
        </div>
      )}

      {activeTab === 'groups' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">My Groups</h2>
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

          <GroupList groups={groups} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;