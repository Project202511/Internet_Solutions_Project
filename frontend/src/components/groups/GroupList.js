import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserShield } from 'react-icons/fa';

const GroupList = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No groups found. Create a new group to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Link
          to={`/groups/${group._id}`}
          key={group._id}
          className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
            {group.owner._id === group.owner._id ? (
              <FaUserShield className="text-primary-600" title="You are the owner" />
            ) : (
              <FaUsers className="text-gray-500" title="You are a member" />
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {group.description || 'No description provided'}
          </p>
          
          <div className="text-xs text-gray-500">
            {group.members?.length} {group.members?.length === 1 ? 'member' : 'members'}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;