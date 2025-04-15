import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserShield, FaUser } from 'react-icons/fa';

/**
 * GroupList - A responsive grid of group cards
 * 
 * @param {Array} groups - Array of group objects to display
 */
const GroupList = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
        <p className="text-neutral-500">No groups found. Create a new group to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {groups.map((group) => (
        <Link
          to={`/groups/${group._id}`}
          key={group._id}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-neutral-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="flex items-start sm:items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mr-2 break-words">
              {group.name}
            </h3>
            {group.isOwner || (group.owner && group.owner._id === localStorage.getItem('userId')) ? (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0 mt-1 sm:mt-0">
                <FaUserShield className="mr-1" size={12} /> 
                <span className="hidden xs:inline">Owner</span>
              </span>
            ) : (
              <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0 mt-1 sm:mt-0">
                <FaUser className="mr-1" size={12} /> 
                <span className="hidden xs:inline">Member</span>
              </span>
            )}
          </div>
          
          <p className="text-neutral-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 min-h-8 sm:min-h-10 flex-grow">
            {group.description || 'No description provided'}
          </p>
          
          <div className="flex items-center text-neutral-500 text-xs sm:text-sm mt-auto">
            <FaUsers className="mr-1 sm:mr-2" size={14} />
            <span>{group.members?.length || 0} {group.members?.length === 1 ? 'member' : 'members'}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;