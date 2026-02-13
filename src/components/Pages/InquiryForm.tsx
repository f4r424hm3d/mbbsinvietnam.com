import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  FileText, 
  HelpCircle, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FormData {
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentEducation: string;
  gpa: string;
  medicalField: string;
  message: string;
  financialNeed: string;
}

const InquiryForm: React.FC = () => {
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    inquiryType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentEducation: '',
    gpa: '',
    medicalField: '',
    message: '',
    financialNeed: ''
  });

  const inquiryTypes = [
    {
      id: 'application',
      title: 'Scholarship Application',
      description: 'Apply for medical education financial assistance',
      icon: GraduationCap,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'eligibility',
      title: 'Eligibility Questions',
      description: 'Check if you qualify for our programs',
      icon: HelpCircle,
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      id: 'documents',
      title: 'Document Submission',
      description: 'Submit required application documents',
      icon: FileText,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      description: 'Other questions or information requests',
      icon: Mail,
      color: 'bg-emerald-500 hover:bg-emerald-600'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInquirySelect = (inquiryId: string) => {
    setSelectedInquiry(inquiryId);
    setFormData(prev => ({
      ...prev,
      inquiryType: inquiryId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSelectedInquiry('');
    setFormData({
      inquiryType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      currentEducation: '',
      gpa: '',
      medicalField: '',
      message: '',
      financialNeed: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your inquiry has been submitted successfully. We will review your information and get back to you within 2-3 business days.
          </p>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!selectedInquiry ? (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Inquiry</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the type of inquiry that best matches your needs. We're here to help you achieve your medical education goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {inquiryTypes.map((inquiry) => {
              const IconComponent = inquiry.icon;
              return (
                <button
                  key={inquiry.id}
                  onClick={() => handleInquirySelect(inquiry.id)}
                  className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`w-14 h-14 ${inquiry.color} rounded-xl flex items-center justify-center mb-6 transition-colors`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{inquiry.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{inquiry.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {inquiryTypes.find(t => t.id === selectedInquiry)?.title}
            </h2>
            <button
              onClick={() => setSelectedInquiry('')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back to Options
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {(selectedInquiry === 'application' || selectedInquiry === 'eligibility') && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Education Level *
                    </label>
                    <select
                      name="currentEducation"
                      required
                      value={formData.currentEducation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select education level</option>
                      <option value="highschool">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="premed">Pre-Medical</option>
                      <option value="medschool">Medical School</option>
                      <option value="residency">Residency</option>
                      <option value="fellowship">Fellowship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current GPA
                    </label>
                    <input
                      type="text"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="3.75"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Field of Interest
                  </label>
                  <select
                    name="medicalField"
                    value={formData.medicalField}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select field of interest</option>
                    <option value="general">General Medicine</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="surgery">Surgery</option>
                    <option value="psychiatry">Psychiatry</option>
                    <option value="radiology">Radiology</option>
                    <option value="emergency">Emergency Medicine</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Need Level
                  </label>
                  <select
                    name="financialNeed"
                    value={formData.financialNeed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select financial need</option>
                    <option value="high">High - Significant financial hardship</option>
                    <option value="moderate">Moderate - Some financial assistance needed</option>
                    <option value="low">Low - Minimal financial assistance needed</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Please provide details about your inquiry, including any specific questions or requirements..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <p>All scholarship applications are subject to review. Please allow 2-3 business days for an initial response. Complete applications typically take 2-4 weeks to process.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Inquiry
              </button>
              <button
                type="button"
                onClick={() => setSelectedInquiry('')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;