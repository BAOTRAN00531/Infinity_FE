
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import { Switch } from '@/components/reusable-components/switch';
import UserForm from '@/components/inmutable-components/UserForm';
import UserDetails from '@/components/inmutable-components/UserDetails';
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

const UsersCRUD = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Student',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-06-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Teacher',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2024-06-14'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Student',
      status: 'inactive',
      joinDate: '2024-03-10',
      lastActive: '2024-05-20'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
    };
    setUsers([...users, newUser]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (userData: Omit<User, 'id'>) => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...userData, id: selectedUser.id }
          : user
      ));
      setIsEditOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">Users Management</h2>
            <p className="text-gray-600">Manage platform users and roles</p>
          </div>
        </div>
        
        {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button_admin className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </Button_admin>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black ">Create New User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog> */}
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input_admin
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-800 mb-1">{user.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                <Badge className={`text-xs font-bold rounded-full ${
                  user.role === 'Teacher' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={user.status === 'active'}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                  />
                  <span className={`text-sm ${
                    user.status === 'active' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Joined:</span>
                <span className="text-sm font-bold text-gray-800">{user.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Last Active:</span>
                <span className="text-sm font-bold text-gray-800">{user.lastActive}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
              <Button_admin
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(user);
                  setIsViewOpen(true);
                }}
                className="rounded-xl hover:bg-blue-100"
              >
                <Eye className="w-4 h-4" />
              </Button_admin>
              <Button_admin
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditOpen(true);
                }}
                className="rounded-xl hover:bg-yellow-100"
              >
                <Edit className="w-4 h-4" />
              </Button_admin>
              <Button_admin
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteOpen(true);
                }}
                className="rounded-xl hover:bg-red-100 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button_admin>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black ">Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              initialData={selectedUser}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black ">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetails user={selectedUser} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black ">Delete User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <DeleteConfirmation
              userName={selectedUser.name}
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersCRUD;
