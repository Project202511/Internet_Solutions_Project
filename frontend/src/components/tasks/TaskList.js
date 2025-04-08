import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTrash, FaEdit, FaLink, FaTag } from 'react-icons/fa';

const TaskList = ({ tasks, completeTask, deleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-neutral-500">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 p-5 border-l-4 ${
            task.completed ? 'border-secondary-500' : 'border-amber-500'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>
                {task.title}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => completeTask(task._id)}
                  className={`p-1.5 rounded-full ${
                    task.completed 
                      ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <FaCheck size={12} />
                </button>
                
                <Link
                  to={`/tasks/${task._id}`}
                  className="p-1.5 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
                  title="Edit task"
                >
                  <FaEdit size={12} />
                </Link>
                
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  title="Delete task"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center mb-2 space-x-2">
              <span
                className={`badge ${
                  task.completed ? 'badge-success' : 'badge-warning'
                }`}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </span>
              
              <span
                className={`badge ${
                  task.accessLevel === 'private'
                    ? 'badge-neutral'
                    : task.accessLevel === 'group'
                    ? 'badge-accent'
                    : 'badge-primary'
                }`}
              >
                {task.accessLevel.charAt(0).toUpperCase() + task.accessLevel.slice(1)}
              </span>
            </div>
            
            <p className={`text-neutral-600 mb-3 flex-grow ${task.completed ? 'line-through text-neutral-400' : ''}`}>
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="flex items-center text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded"
                  >
                    <FaTag className="mr-1 text-neutral-400" size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {task.resourceLink && (
              <a 
                href={task.resourceLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center mt-auto"
              >
                <FaLink className="mr-1" size={12} />
                Resource Link
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;