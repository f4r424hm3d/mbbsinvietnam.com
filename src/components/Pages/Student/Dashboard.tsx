import React, { useState } from 'react';
import { 
  User, 

  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 

  MessageCircle,
  Plane,
  Award,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Eye,
  ExternalLink
} from 'lucide-react';
import { mockApplications, mockStudent } from './mockData';
import { Application, Student } from './index';
import ChatWidget from './ChatWidget';

interface StudentDashboardProps {
  applications: Application[];
  student: Student;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  applications = mockApplications, 
  student = mockStudent 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'under-review': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-purple-600 bg-purple-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'waitlisted': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'submitted': return <FileText className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'waitlisted': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'accepted').length}
              </p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'under-review').length}
              </p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(applications.reduce((acc, app) => acc + app.progress, 0) / applications.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {applications.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">University Application</p>
                    <p className="text-sm text-gray-600">Updated {app.lastUpdated}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.replace('-', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{app.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('applications')}
              className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">View All Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Check Offer Letters</span>
            </button>
            <button
              onClick={() => setActiveTab('visa')}
              className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Plane className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Visa Applications</span>
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="w-full flex items-center gap-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-900">Get Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">My Applications</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          New Application
        </button>
      </div>

      <div className="grid gap-6">
        {applications.map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">University Application</h4>
                <p className="text-gray-600">Application ID: {app.id}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                  {app.status.replace('-', ' ').toUpperCase()}
                </span>
                <p className="text-sm text-gray-600 mt-1">Updated {app.lastUpdated}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{app.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${app.progress}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="font-medium text-gray-900">{app.submittedDate || 'Not submitted'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="font-medium text-gray-900">
                  {app.documents.filter(doc => doc.status === 'verified').length} / {app.documents.length} verified
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedApplication(app)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              {app.status === 'accepted' && app.offerLetter && (
                <button
                  onClick={() => setActiveTab('offers')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  View Offer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => {
    const acceptedApplications = applications.filter(app => app.status === 'accepted' && app.offerLetter);
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Offer Letters</h3>

        {acceptedApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Offer Letters Yet</h4>
            <p className="text-gray-600">Your offer letters will appear here once you receive them.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {acceptedApplications.map(app => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Offer Letter</h4>
                    <p className="text-gray-600">Application ID: {app.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.offerLetter?.status === 'received' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {app.offerLetter?.status?.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Received {app.offerLetter?.receivedDate}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Tuition Fee</p>
                    <p className="font-medium text-gray-900">
                      ${app.offerLetter?.tuitionFee?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scholarship Amount</p>
                    <p className="font-medium text-green-600">
                      ${app.offerLetter?.scholarshipAmount?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Deadline</p>
                    <p className="font-medium text-red-600">
                      {app.offerLetter?.responseDeadline}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Amount</p>
                    <p className="font-medium text-gray-900">
                      ${((app.offerLetter?.tuitionFee || 0) - (app.offerLetter?.scholarshipAmount || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {app.offerLetter?.conditions && app.offerLetter.conditions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Conditions:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {app.offerLetter.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Accept Offer
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                    Decline Offer
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Letter
                  </button>
                  <button
                    onClick={() => setActiveTab('visa')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plane className="w-4 h-4" />
                    Apply for Visa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderVisa = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Visa Applications</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          New Visa Application
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center py-8">
          <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Start Your Visa Application</h4>
          <p className="text-gray-600 mb-6">
            Once you accept an offer letter, you can begin your visa application process here.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h5 className="font-medium text-blue-900">Document Preparation</h5>
              <p className="text-sm text-blue-700">Gather required documents</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h5 className="font-medium text-purple-900">Schedule Appointment</h5>
              <p className="text-sm text-purple-700">Book visa interview</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h5 className="font-medium text-green-900">Track Status</h5>
              <p className="text-sm text-green-700">Monitor application progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Visa Application Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Start your visa application as soon as you accept an offer</li>
              <li>Ensure all documents are translated and certified</li>
              <li>Book your visa appointment well in advance</li>
              <li>Prepare for the visa interview thoroughly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              {student.personalInfo?.firstName} {student.personalInfo?.lastName}
            </h4>
            <p className="text-gray-600">{student.personalInfo?.email}</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change Profile Picture
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Personal Information</h5>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{student.personalInfo?.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Nationality</p>
                <p className="font-medium">{student.personalInfo?.nationality}</p>
              </div>
              <div>
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-medium">{student.personalInfo?.dateOfBirth}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">Academic Information</h5>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Education Level</p>
                <p className="font-medium">{student.academicInfo?.currentEducationLevel}</p>
              </div>
              <div>
                <p className="text-gray-600">Institution</p>
                <p className="font-medium">{student.academicInfo?.institution}</p>
              </div>
              <div>
                <p className="text-gray-600">GPA</p>
                <p className="font-medium">{student.academicInfo?.gpa}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {student.personalInfo?.firstName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'applications', label: 'Applications', icon: FileText },
                  { id: 'offers', label: 'Offer Letters', icon: Award },
                  { id: 'visa', label: 'Visa Applications', icon: Plane },
                  { id: 'profile', label: 'Profile', icon: User }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'offers' && renderOffers()}
            {activeTab === 'visa' && renderVisa()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-4">
                    {selectedApplication.timeline.map(event => (
                      <div key={event.id} className="flex gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.status === 'completed' ? 'bg-green-100 text-green-600' :
                          event.status === 'current' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {event.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : event.status === 'current' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-3">
                    {selectedApplication.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">Uploaded {doc.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {doc.status.toUpperCase()}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {showChat && (
        <ChatWidget onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;