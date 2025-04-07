import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTrash, FaEdit, FaLink, FaTag } from 'react-icons/fa';

const TaskList = ({ tasks, completeTask, deleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`bg-white rounded-lg shadow-md p-5 transition-all ${
            task.completed ? 'border-l-4 border-green-500' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                {task.accessLevel !== 'private' && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    task.accessLevel === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {task.accessLevel === 'public' ? 'Public' : 'Group'}
                  </span>
                )}
              </div>
              
              <p className={`text-gray-600 mb-3 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.description}
              </p>
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      <FaTag className="mr-1 text-gray-400" size={10} />
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
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <FaLink className="mr-1" size={12} />
                  Resource Link
                </a>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => completeTask(task._id)}
                className={`p-2 rounded-full ${
                  task.completed 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <FaCheck size={14} />
              </button>
              
              <Link
                to={`/tasks/${task._id}`}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Edit task"
              >
                <FaEdit size={14} />
              </Link>
              
              <button
                onClick={() => deleteTask(task._id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                title="Delete task"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;