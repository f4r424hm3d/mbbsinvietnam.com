import { User, Pencil, BookOpen, LogOut, ArrowRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../../Homepage/Header';
import Footer from '../../Homepage/Footer';
import { logoutStudent } from '../../../Api';
import { isAuthenticated, clearAuthData } from '../../../utils/auth';

function AppliedColleges() {
  const navigate = useNavigate();

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/auth');
      return;
    }
  }, []);

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
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors bg-pink-500 text-white"
              >
                <BookOpen className="w-5 h-5" />
                <span>Applied colleges</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/change-password')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <User className="w-5 h-5" />
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Your Applied Colleges</h1>
            
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12 md:py-4">
              <p className="text-gray-500 text-center mb-8">
                Nothing to show yet. You haven't applied to any colleges.
              </p>
              
              {/* Illustration */}
              <div className="relative mb-8 w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-pink-50 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-pink-50 rounded-3xl p-8 md:p-12">
                  {/* Background decorative elements */}
                  <div className="absolute top-4 left-4 w-20 h-20 bg-pink-200 rounded-full opacity-30"></div>
                  <div className="absolute top-8 right-8 w-16 h-16 bg-pink-200 rounded-full opacity-30"></div>
                  <div className="absolute bottom-8 left-8 w-12 h-12 bg-pink-200 rounded-full opacity-30"></div>
                  
                  {/* Students Illustration */}
                  <div className="relative flex items-end justify-center gap-2 md:gap-3 pt-4">
                    {/* Student 1 - Woman with brown hair, red tank top, dark gray shorts */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-pink-200 rounded-full mb-1 border-2 border-pink-300"></div>
                      <div className="w-7 h-14 md:w-9 md:h-20 bg-red-500 rounded-t-sm"></div>
                      <div className="w-7 h-7 md:w-9 md:h-9 bg-gray-700 rounded-b-sm"></div>
                    </div>
                    
                    {/* Student 2 - Man with dark hair, dark gray jacket, red collared shirt, dark gray pants */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-800 rounded-full mb-1 border-2 border-gray-900"></div>
                      <div className="w-7 h-16 md:w-9 md:h-20 bg-gray-700 rounded-t-sm"></div>
                      <div className="w-7 h-10 md:w-9 md:h-14 bg-gray-700 rounded-b-sm"></div>
                    </div>
                    
                    {/* Student 3 - Woman with dark hair, red long-sleeved top, dark gray skirt, holding paper */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-800 rounded-full mb-1 border-2 border-gray-900"></div>
                      <div className="w-7 h-14 md:w-9 md:h-20 bg-red-500 rounded-t-sm"></div>
                      <div className="w-7 h-7 md:w-9 md:h-9 bg-gray-700 rounded-b-sm"></div>
                      {/* Paper */}
                      <div className="absolute top-14 md:top-16 left-1/2 transform -translate-x-1/2 w-4 h-5 md:w-5 md:h-6 bg-white rounded-sm shadow-sm"></div>
                    </div>
                    
                    {/* Student 4 - Man with light brown hair, red long-sleeved top, dark gray pants */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-pink-300 rounded-full mb-1 border-2 border-pink-400"></div>
                      <div className="w-7 h-16 md:w-9 md:h-20 bg-red-500 rounded-t-sm"></div>
                      <div className="w-7 h-10 md:w-9 md:h-14 bg-gray-700 rounded-b-sm"></div>
                    </div>
                  </div>
                  
                  {/* Dog */}
                  <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full"></div>
                      {/* Ears */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-t-full"></div>
                      <div className="absolute -top-2 left-1/2 transform translate-x-1 md:translate-x-2 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-t-full"></div>
                      {/* Nose */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Browse Colleges Button */}
              <button
                onClick={() => navigate('/universities')}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
              >
                <span>Browse Colleges</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppliedColleges;

