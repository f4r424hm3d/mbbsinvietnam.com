import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Award, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { ScholarshipDetail } from './types/scholarship';

interface ScholarshipDetailPageProps {
  scholarship: ScholarshipDetail;
  universityName: string;
  universityLocation: string;
  onBack: () => void;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  scholarship,
  universityName,
  universityLocation,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'merit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'need':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'government':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'private':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'eligibility', label: 'Eligibility', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'application', label: 'How to Apply', icon: <FileText className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <Download className="w-4 h-4" /> },
    { id: 'dates', label: 'Important Dates', icon: <Calendar className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <AlertCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Scholarships
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">{scholarship.name}</h1>
                  <p className="text-blue-100 text-lg">{universityName}</p>
                  <p className="text-blue-200 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {universityLocation}
                  </p>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg leading-relaxed">
                {scholarship.description}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-200">Scholarship Value:</span>
                  <span className="font-semibold">{scholarship.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Available Seats:</span>
                  <span className="font-semibold">{scholarship.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Application Deadline:</span>
                  <span className="font-semibold">{scholarship.importantDates.applicationDeadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Duration:</span>
                  <span className="font-semibold">{scholarship.duration}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(scholarship.type)}`}>
                  {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)} Scholarship
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Coverage */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  What's Covered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarship.coverage.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Process */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  Selection Process
                </h3>
                <div className="space-y-4">
                  {scholarship.selectionProcess.steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
                
                {scholarship.selectionProcess.weights && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Selection Criteria Weightage</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{scholarship.selectionProcess.weights.academics}%</div>
                        <div className="text-sm text-blue-800">Academics</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{scholarship.selectionProcess.weights.interview}%</div>
                        <div className="text-sm text-blue-800">Interview</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{scholarship.selectionProcess.weights.other}%</div>
                        <div className="text-sm text-blue-800">Other</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Renewal Conditions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-purple-600 mr-2" />
                  Renewal Conditions
                </h3>
                <div className="space-y-3">
                  {scholarship.renewalConditions?.map((condition, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <a href={`mailto:${scholarship.contactInfo.email}`} className="text-blue-600 hover:underline">
                      {scholarship.contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{scholarship.contactInfo.phone}</span>
                  </div>
                  {scholarship.contactInfo.office && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                      <span className="text-gray-700">{scholarship.contactInfo.office}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Time */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  Processing Time
                </h3>
                <p className="text-gray-700">{scholarship.applicationProcess.processingTime}</p>
              </div>

              {/* Apply Now CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Don't miss this opportunity. Application deadline is approaching.
                </p>
                {scholarship.applicationProcess.portalLink ? (
                  <a
                    href={scholarship.applicationProcess.portalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                ) : (
                  <button className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Contact for Application
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Requirements</h3>
                <div className="space-y-3">
                  {scholarship.eligibility.map((criterion, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Country-Specific Notes</h3>
                <div className="space-y-3">
                  {scholarship.countrySpecificNotes.map((note, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {scholarship.incompatibilities.length > 0 && (
              <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Incompatibilities & Exclusions</h3>
                <div className="space-y-2">
                  {scholarship.incompatibilities.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-red-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'application' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
            
            <div className="space-y-6">
              {scholarship.applicationProcess.steps.map((step, index) => (
                <div key={index} className="flex items-start p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-lg">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {scholarship.postAwardObligations.length > 0 && (
              <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Post-Award Obligations</h3>
                <div className="space-y-2">
                  {scholarship.postAwardObligations.map((obligation, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800">{obligation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-red-600 mr-2" />
                    Mandatory Documents
                  </h3>
                  <div className="space-y-3">
                    {scholarship.documentsRequired.mandatory.map((doc, index) => (
                      <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                        <FileText className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Optional Documents
                  </h3>
                  <div className="space-y-3">
                    {scholarship.documentsRequired.optional.map((doc, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                        <FileText className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Important Notes</h3>
              <div className="space-y-2">
                {scholarship.documentsRequired.notes.map((note, index) => (
                  <div key={index} className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dates' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Dates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Application Opens</h3>
                </div>
                <p className="text-2xl font-bold text-green-700">{scholarship.importantDates.applicationOpen}</p>
              </div>
              
              <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="font-semibold text-red-900">Application Deadline</h3>
                </div>
                <p className="text-2xl font-bold text-red-700">{scholarship.importantDates.applicationDeadline}</p>
              </div>
              
              {scholarship.importantDates.interviewPeriod && (
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-900">Interview Period</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{scholarship.importantDates.interviewPeriod}</p>
                </div>
              )}
              
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">Result Announcement</h3>
                </div>
                <p className="text-2xl font-bold text-purple-700">{scholarship.importantDates.resultAnnouncement}</p>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-orange-600 mr-2" />
                  <h3 className="font-semibold text-orange-900">Fee Payment Deadline</h3>
                </div>
                <p className="text-2xl font-bold text-orange-700">{scholarship.importantDates.feePaymentDeadline}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {scholarship.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {openFAQs.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQs.includes(index) && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};