const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-card text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
        <p className="text-gray-600 mb-6">
          Update your profile, preferences, and security settings.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;