import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  User,
  Settings,
  LogOut,
  Edit,
  Save,
  Shield,
  Key,
  Bell,
  Moon,
  Sun,
  Monitor,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Download,
  HelpCircle,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme/ThemeProvider';
import { toast } from 'sonner';

interface UserProfileMenuProps {
  trigger?: React.ReactNode;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  lastLogin: string;
  permissions: string[];
  preferences: {
    notifications: boolean;
    emailDigest: boolean;
    darkMode: boolean;
    language: string;
    timezone: string;
  };
}

// Mock user data
const mockUser: UserProfile = {
  id: '1',
  username: 'admin',
  email: 'admin@wem-energy.com',
  fullName: 'System Administrator',
  role: 'Administrator',
  department: 'IT Operations',
  avatar: '',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Experienced system administrator managing energy infrastructure systems.',
  joinDate: '2023-01-15',
  lastLogin: new Date().toISOString(),
  permissions: ['read', 'write', 'admin', 'manage_users', 'manage_settings', 'export'],
  preferences: {
    notifications: true,
    emailDigest: false,
    darkMode: true,
    language: 'en',
    timezone: 'America/Los_Angeles'
  }
};

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ trigger }) => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // Reset form
    setPasswordForm({ current: '', new: '', confirm: '' });
    setShowChangePassword(false);
    toast.success('Password changed successfully');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = e.target?.result as string;
        setEditForm(prev => ({ ...prev, avatar }));
        setUser(prev => ({ ...prev, avatar }));
        toast.success('Avatar updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'write': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'manage_users': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'manage_settings': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'export': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <User className="w-4 h-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-slate-900 border-slate-700" align="end">
          <DropdownMenuLabel className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="bg-slate-700 text-white">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.fullName}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                    {user.role}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Last login: {formatLastLogin(user.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 cursor-pointer">
                <User className="w-4 h-4 mr-3" />
                View Profile
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Profile
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  View and manage your account information and preferences.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Profile Header */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={isEditing ? editForm.avatar : user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-slate-700 text-white text-xl">
                        {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 p-2 bg-slate-700 rounded-full cursor-pointer hover:bg-slate-600 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-400">Full Name</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.fullName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                          />
                        ) : (
                          <p className="text-white font-medium mt-1">{user.fullName}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Email</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                          />
                        ) : (
                          <p className="text-white mt-1">{user.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-400">Phone</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                          />
                        ) : (
                          <p className="text-white mt-1">{user.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Location</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                          />
                        ) : (
                          <p className="text-white mt-1">{user.location || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <Label className="text-xs text-slate-400">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white mt-1 resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white mt-1">{user.bio || 'No bio provided'}</p>
                  )}
                </div>

                {/* Account Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Role:</span>
                      <p className="text-white font-medium">{user.role}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Department:</span>
                      <p className="text-white font-medium">{user.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Join Date:</span>
                      <p className="text-white font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Login:</span>
                      <p className="text-white font-medium">{formatLastLogin(user.lastLogin)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Permissions */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className={`text-xs capitalize ${getPermissionColor(permission)}`}
                        >
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <span className="text-white text-sm">Notifications</span>
                      </div>
                      <Switch
                        checked={user.preferences.notifications}
                        onCheckedChange={(checked) => 
                          setUser(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, notifications: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-white text-sm">Email Digest</span>
                      </div>
                      <Switch
                        checked={user.preferences.emailDigest}
                        onCheckedChange={(checked) => 
                          setUser(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, emailDigest: checked }
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setEditForm(user);
                          setIsEditing(false);
                        }}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  onClick={() => setShowChangePassword(true)}
                  variant="outline"
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-slate-300 hover:bg-slate-800">
              <Monitor className="w-4 h-4 mr-3" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-slate-900 border-slate-700">
              <DropdownMenuItem 
                onClick={() => setTheme('light')}
                className="text-slate-300 hover:bg-slate-800"
              >
                <Sun className="w-4 h-4 mr-3" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme('dark')}
                className="text-slate-300 hover:bg-slate-800"
              >
                <Moon className="w-4 h-4 mr-3" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme('system')}
                className="text-slate-300 hover:bg-slate-800"
              >
                <Monitor className="w-4 h-4 mr-3" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem className="text-slate-300 hover:bg-slate-800">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem className="text-slate-300 hover:bg-slate-800">
            <HelpCircle className="w-4 h-4 mr-3" />
            Help & Support
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter your current password and choose a new secure password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white text-sm">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white pr-10"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPassword.current ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-white text-sm">New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white pr-10"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPassword.new ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-white text-sm">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white pr-10"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowChangePassword(false)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};