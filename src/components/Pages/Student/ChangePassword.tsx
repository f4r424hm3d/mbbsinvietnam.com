import { User, Pencil, BookOpen, LogOut, Lock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../../Homepage/Header';
import Footer from '../../Homepage/Footer';
import { changePassword, logoutStudent } from '../../../Api';
import { isAuthenticated, clearAuthData } from '../../../utils/auth';

function ChangePassword() {
  const navigate = useNavigate();

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/auth');
      return;
    }
  }, []);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error and success messages when user types
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await changePassword({
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_new_password: formData.confirmPassword
      });

      if (response.message) {
        setSuccess(response.message);
        // Clear form on success
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Optionally navigate back after a delay
        // setTimeout(() => navigate('/student-dashboard'), 2000);
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(null);
    setSuccess(null);
    // Optionally navigate back
    // navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 relative">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 bg-gray-100 flex-shrink-0 lg:static">
          <div className="p-4 md:p-6 space-y-6 lg:h-full lg:overflow-y-auto">
            {/* Profile Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-300 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Pencil className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <User className="w-5 h-5" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/applied-college')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <BookOpen className="w-5 h-5" />
                <span>Applied colleges</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/change-password')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors bg-pink-500 text-white"
              >
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/account-setting')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <Settings className="w-5 h-5" />
                <span>Account settings</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    await logoutStudent();
                  } catch (error) {
                    console.error('Logout error:', error);
                  } finally {
                    clearAuthData();
                    window.location.replace('/auth');
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white min-w-0">
          <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Change Password</h1>
            
            {/* Form */}
            <div className="max-w-2xl space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter Current Password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-pink-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChangePassword;

