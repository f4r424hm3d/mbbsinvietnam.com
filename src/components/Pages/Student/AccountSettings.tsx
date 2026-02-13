import { User, Pencil, BookOpen, LogOut, Lock, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../../Homepage/Header';
import Footer from '../../Homepage/Footer';
import { logoutStudent } from '../../../Api';
import { isAuthenticated, clearAuthData } from '../../../utils/auth';

function AccountSettings() {
  const navigate = useNavigate();

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/auth');
      return;
    }
  }, []);
  const [emailCommunications, setEmailCommunications] = useState(true);
  const [smsCommunications, setSmsCommunications] = useState(true);

  const handleDeleteAccount = () => {
    // Handle account deletion
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // Add actual deletion logic here
    }
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
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/account-setting')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors bg-pink-500 text-white"
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
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
              
              {/* Communication Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="space-y-6">
                  {/* Email Communications */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Email Communications
                      </label>
                    </div>
                    <button
                      onClick={() => setEmailCommunications(!emailCommunications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        emailCommunications ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailCommunications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Communications */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        SMS Communications
                      </label>
                    </div>
                    <button
                      onClick={() => setSmsCommunications(!smsCommunications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        smsCommunications ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          smsCommunications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Are you sure to delete your account?
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-2"
                  >
                    <span>Delete</span>
                    <Trash2 className="w-4 h-4 text-pink-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountSettings;

