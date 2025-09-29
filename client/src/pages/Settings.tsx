import { useState, useEffect } from 'react';
import { User, Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authApi.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your account information</p>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <p className="text-gray-600">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <span className="ml-2 text-gray-900">{user?.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <span className="ml-2 text-gray-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Business:</span>
              <span className="ml-2 text-gray-900">{user?.businessName || 'Personal'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center space-x-2"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <p className="text-gray-600 mb-4">
            Manage your account preferences and security settings.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;