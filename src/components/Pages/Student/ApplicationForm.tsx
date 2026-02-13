import React, { useEffect, useState } from 'react';
import { Mail, Phone, User, GraduationCap, Building2, BookOpen, ChevronRight, X, CheckCircle } from 'lucide-react';
import { submitUniversityApply } from '../../../Api';

interface ApplicationFormProps {
  onApplicationSubmit: (applicationData: any) => void;
}

interface SimpleApplicationFormState {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  nationality: string;
  highestEducation: string;
  universityId: string;
  programId: string;
  message: string;
}

const defaultFormState: SimpleApplicationFormState = {
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+91',
  nationality: '',
  highestEducation: '',
  universityId: '',
  programId: '',
  message: ''
};

// Common country codes
const countryCodes = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+91', country: 'India' },
  { code: '+44', country: 'UK' },
  { code: '+7', country: 'Kyrgyzstan/Russia' },
  { code: '+86', country: 'China' },
  { code: '+92', country: 'Pakistan' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+977', country: 'Nepal' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+84', country: 'Vietnam' },
  { code: '+66', country: 'Thailand' },
  { code: '+27', country: 'South Africa' },
  { code: '+234', country: 'Nigeria' },
  { code: '+20', country: 'Egypt' },
  { code: '+212', country: 'Morocco' },
  { code: '+90', country: 'Turkey' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
];

// University list - can be replaced with API call
const universities = [
  { id: '1', name: 'Ala-Too International University' },
  { id: '2', name: 'Kyrgyz State Medical Academy' },
  { id: '3', name: 'Osh State University' },
  { id: '4', name: 'Jalal-Abad State University' },
  { id: '5', name: 'Kyrgyz National University' },
  { id: '6', name: 'International University of Kyrgyzstan' },
  { id: '7', name: 'Kyrgyz-Russian Slavic University' },
  { id: '8', name: 'Asian Medical Institute' },
  { id: '9', name: 'Kyrgyz State Technical University' },
  { id: '10', name: 'Kyrgyz State University of Construction, Transport and Architecture' },
];

// Program list - can be replaced with API call
const programs = [
  { id: '1', name: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)' },
  { id: '2', name: 'BDS (Bachelor of Dental Surgery)' },
  { id: '3', name: 'Pharmacy' },
  { id: '4', name: 'Nursing' },
  { id: '5', name: 'Engineering' },
  { id: '6', name: 'Computer Science' },
  { id: '7', name: 'Business Administration' },
  { id: '8', name: 'Economics' },
  { id: '9', name: 'Law' },
  { id: '10', name: 'International Relations' },
];

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onApplicationSubmit }) => {
  const [formData, setFormData] = useState<SimpleApplicationFormState>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Map highest education to API format
  const mapHighestEducation = (education: string): string => {
    const educationMap: Record<string, string> = {
      'High School (10+2)': 'UNDER-GRADUATE',
      'Diploma': 'UNDER-GRADUATE',
      "Bachelor's Degree": 'UNDER-GRADUATE',
      "Master's Degree": 'GRADUATE',
      'Other': 'UNDER-GRADUATE'
    };
    return educationMap[education] || 'UNDER-GRADUATE';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get university and program names
      const selectedUniversity = universities.find(uni => uni.id === formData.universityId);
      const selectedProgram = programs.find(prog => prog.id === formData.programId);

      if (!selectedUniversity || !selectedProgram) {
        setSubmitError('Please select both university and program.');
        setIsSubmitting(false);
        return;
      }

      // Extract country code number (remove the +)
      const countryCode = formData.countryCode.replace('+', '');

      // Get current page URL
      const currentUrl = window.location.href;

      // Map highest education
      const highestLevelOfEducation = mapHighestEducation(formData.highestEducation);

      // Submit to API
      await submitUniversityApply({
        name: formData.fullName,
        email: formData.email,
        country_code: countryCode,
        phone: formData.phone,
        nationality: formData.nationality,
        source: 'University Page',
        source_path: currentUrl,
        highest_level_of_education: highestLevelOfEducation,
        interested_university: selectedUniversity.name,
        interested_program: selectedProgram.name,
      });

      // Show success popup
      setShowSuccessPopup(true);
      
      // Call the callback if provided
      if (onApplicationSubmit) {
        onApplicationSubmit({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'university-apply-now'
        });
      }

      // Reset form
      setFormData(defaultFormState);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setSubmitError(
        error?.response?.data?.message || 
        'An error occurred while submitting your application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Apply Now Application Form
          </h1>
          <p className="text-gray-600">
            Share your details and our team will connect with you to guide the admission process.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Full Name *</span>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Email *</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Country Code *</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    required
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} ({item.country})
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Phone *</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="123 456 7890"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Highest Education *</span>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    required
                    name="highestEducation"
                    value={formData.highestEducation}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="High School (10+2)">High School (10+2)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Nationality *</span>
                <input
                  required
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Indian"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">University List *</span>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    required
                    name="universityId"
                    value={formData.universityId}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">Select University</option>
                    {universities.map((university) => (
                      <option key={university.id} value={university.id}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Program List *</span>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    required
                    name="programId"
                    value={formData.programId}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">Message</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your goals or questions. This helps us tailor our guidance."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
              />
            </label>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              {!isSubmitting && <ChevronRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              {/* Success Message Box */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-800 font-semibold text-lg">
                  Your application has been submitted successfully. We will contact you soon.
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md shadow-blue-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApplicationForm;