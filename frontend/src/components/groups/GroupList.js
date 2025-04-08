import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserShield, FaUser } from 'react-icons/fa';

const GroupList = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-neutral-500">No groups found. Create a new group to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Link
          to={`/groups/${group._id}`}
          key={group._id}
          className="bg-white rounded-lg shadow-sm p-5 border border-neutral-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-neutral-800">{group.name}</h3>
            {group.owner._id === group.owner._id ? (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full flex items-center">
                <FaUserShield className="mr-1" /> Owner
              </span>
            ) : (
              <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full flex items-center">
                <FaUser className="mr-1" /> Member
              </span>
            )}
          </div>
          
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2 h-10">
            {group.description || 'No description provided'}
          </p>
          
          <div className="flex items-center text-neutral-500 text-sm mt-auto">
            <FaUsers className="mr-2" />
            <span>{group.members?.length || 0} {group.members?.length === 1 ? 'member' : 'members'}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;