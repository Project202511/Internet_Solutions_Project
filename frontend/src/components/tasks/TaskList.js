import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTrash, FaEdit, FaLink, FaTag } from 'react-icons/fa';

/**
 * TaskList - A responsive grid of task cards
 * 
 * Displays tasks in a responsive grid that adapts from single column on mobile
 * to three columns on large screens. Optimizes touch interactions for mobile.
 * 
 * @param {Array} tasks - Array of task objects to display
 * @param {function} completeTask - Function to toggle task completion status
 * @param {function} deleteTask - Function to delete a task
 */
const TaskList = ({ tasks, completeTask, deleteTask }) => {
  // Helper function for priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-blue-400';
      case 'High': return 'bg-red-500';
      case 'Medium':
      default: return 'bg-yellow-500';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
        <p className="text-neutral-500">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 p-4 sm:p-5 border-l-4 ${
            task.completed ? 'border-secondary-500' : 'border-amber-500'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Card Header - Improved for mobile touch targets */}
            <div className="flex flex-wrap items-start mb-1 sm:mb-2">
              {/* Priority Label */}
              <div className={`px-2 py-0.5 rounded-full text-xs text-white font-medium mr-2 mb-1 ${getPriorityColor(task.priority || 'Medium')}`}>
                {task.priority || 'Medium'}
              </div>
              
              {/* Action Buttons - Moved to its own row on very small screens */}
              <div className="flex space-x-2 ml-auto order-last w-full xs:w-auto xs:order-none mt-1 xs:mt-0">
                <button
                  onClick={() => completeTask(task._id)}
                  className={`p-2 rounded-full ${
                    task.completed 
                      ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <FaCheck size={12} />
                </button>
                
                <Link
                  to={`/tasks/${task._id}`}
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
                  title="Edit task"
                  aria-label="Edit task"
                >
                  <FaEdit size={12} />
                </Link>
                
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  title="Delete task"
                  aria-label="Delete task" 
                >
                  <FaTrash size={12} />
                </button>
              </div>
              
              {/* Task Title - Full width on small screens */}
              <h3 className={`text-base sm:text-lg font-semibold w-full xs:w-auto ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>
                {task.title}
              </h3>
            </div>
            
            {/* Status Badges - Improved visibility */}
            <div className="flex flex-wrap items-center mb-2 gap-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </span>
              
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.accessLevel === 'private'
                    ? 'bg-neutral-100 text-neutral-800'
                    : task.accessLevel === 'group'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {task.accessLevel.charAt(0).toUpperCase() + task.accessLevel.slice(1)}
              </span>
            </div>
            
            {/* Task Description - Appropriate font size */}
            <p className={`text-xs sm:text-sm text-neutral-600 mb-3 flex-grow ${task.completed ? 'line-through text-neutral-400' : ''}`}>
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
            
            {/* Tags - Improved for mobile */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="flex items-center text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded truncate max-w-[100px]"
                  >
                    <FaTag className="mr-1 text-neutral-400 flex-shrink-0" size={10} />
                    <span className="truncate">{tag}</span>
                  </span>
                ))}
              </div>
            )}
            
            {/* Resource Link - Larger touch target */}
            {task.resourceLink && (
              <a 
                href={task.resourceLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center mt-auto py-1"
              >
                <FaLink className="mr-1 flex-shrink-0" size={12} />
                <span className="truncate">Resource Link</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;