
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">ID</label>
          <p className="text-sm text-gray-900">{user.id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <p className={`text-sm font-medium ${
            user.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">Name</label>
        <p className="text-sm text-gray-900">{user.name}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">Email</label>
        <p className="text-sm text-gray-900">{user.email}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">Role</label>
        <p className="text-sm text-gray-900">{user.role}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Join Date</label>
          <p className="text-sm text-gray-900">{user.joinDate}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Last Active</label>
          <p className="text-sm text-gray-900">{user.lastActive}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
