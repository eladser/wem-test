import React, { useState } from 'react';
import { Users, UserPlus, Edit, Trash2, Shield, Mail, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { theme } from '@/lib/theme';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  permissions: string[];
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const ROLES = [
  { value: 'admin', label: 'Administrator', color: 'bg-red-500/20 text-red-400' },
  { value: 'manager', label: 'Manager', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'operator', label: 'Operator', color: 'bg-green-500/20 text-green-400' },
  { value: 'viewer', label: 'Viewer', color: 'bg-gray-500/20 text-gray-400' }
];

const PERMISSIONS = [
  'read',
  'write', 
  'delete',
  'export',
  'manage_users',
  'manage_settings',
  'manage_sites',
  'view_analytics',
  'manage_reports'
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@wemdashboard.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-06-27T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['read', 'write', 'delete', 'export', 'manage_users', 'manage_settings', 'manage_sites', 'view_analytics', 'manage_reports']
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'manager@wemdashboard.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-06-27T09:15:00Z',
      createdAt: '2024-02-15T00:00:00Z',
      permissions: ['read', 'write', 'export', 'view_analytics', 'manage_reports']
    },
    {
      id: '3',
      name: 'Mike Operator',
      email: 'operator@wemdashboard.com',
      role: 'operator',
      status: 'active',
      lastLogin: '2024-06-27T08:45:00Z',
      createdAt: '2024-03-10T00:00:00Z',
      permissions: ['read', 'write']
    },
    {
      id: '4',
      name: 'Lisa Viewer',
      email: 'viewer@wemdashboard.com',
      role: 'viewer',
      status: 'active',
      lastLogin: '2024-06-26T16:20:00Z',
      createdAt: '2024-04-05T00:00:00Z',
      permissions: ['read']
    },
    {
      id: '5',
      name: 'Demo User',
      email: 'demo@wemdashboard.com',
      role: 'viewer',
      status: 'pending',
      lastLogin: 'Never',
      createdAt: '2024-06-27T00:00:00Z',
      permissions: ['read']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'viewer',
    permissions: ['read']
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role as User['role'],
        status: 'pending',
        lastLogin: 'Never',
        createdAt: new Date().toISOString(),
        permissions: formData.permissions
      };

      setUsers(prev => [...prev, newUser]);
      setFormData({ name: '', email: '', role: 'viewer', permissions: ['read'] });
      setIsAddDialogOpen(false);
      toast.success('User added successfully!');
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role as User['role'],
              permissions: formData.permissions
            }
          : user
      ));

      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'viewer', permissions: ['read'] });
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === '1') {
      toast.error('Cannot delete the main admin user');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as User['status'] }
          : user
      ));
      toast.success('User status updated!');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
  };

  const getRoleConfig = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[3];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    if (lastLogin === 'Never') return 'Never';
    const date = new Date(lastLogin);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map(role => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`${theme.gradients.primary} text-white`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className={theme.colors.text.primary}>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={theme.colors.text.secondary}>Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className={theme.colors.text.secondary}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className={theme.colors.text.secondary}>Role</Label>
                  <Select value={formData.role} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, role: value }))
                  }>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={theme.colors.text.secondary}>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map(permission => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, permission]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== permission)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-300 capitalize">{permission.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={editingUser ? handleEditUser : handleAddUser}
                  disabled={isLoading}
                  className={`${theme.gradients.primary} text-white w-full`}
                >
                  {isLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{users.length}</div>
            <div className="text-sm text-slate-400">Total Users</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{users.filter(u => u.status === 'pending').length}</div>
            <div className="text-sm text-slate-400">Pending Users</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-sm text-slate-400">Administrators</div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            return (
              <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-emerald-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      Last login: {formatLastLogin(user.lastLogin)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={roleConfig.color}>
                    {roleConfig.label}
                  </Badge>
                  
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(user.id)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Shield className="w-3 h-3" />
                    </Button>

                    {user.id !== '1' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No users found matching your criteria.
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className={theme.colors.text.primary}>
                Edit User: {editingUser?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className={theme.colors.text.secondary}>Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email" className={theme.colors.text.secondary}>Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className={theme.colors.text.secondary}>Role</Label>
                <Select value={formData.role} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, role: value }))
                }>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme.colors.text.secondary}>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-300 capitalize">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleEditUser}
                disabled={isLoading}
                className={`${theme.gradients.primary} text-white w-full`}
              >
                {isLoading ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
