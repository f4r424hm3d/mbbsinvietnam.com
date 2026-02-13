import React, { useState } from 'react';
import { X, User, Mail, Calendar, GraduationCap, CheckCircle, Send } from 'lucide-react';

interface ScholarshipApplicationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipTitle: string;
  program: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  nationality: string;
  dateOfBirth: string;
  currentEducation: string;
  gpa: string;
  englishProficiency: string;
  englishScore: string;
  statementOfPurpose: string;
  preferredIntake: string;
  preferredYear: string;
}

const ScholarshipApplicationPopup: React.FC<ScholarshipApplicationPopupProps> = ({ 
  isOpen, 
  onClose, 
  scholarshipTitle, 
  program 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    nationality: '',
    dateOfBirth: '',
    currentEducation: '',
    gpa: '',
    englishProficiency: '',
    englishScore: '',
    statementOfPurpose: '',
    preferredIntake: '',
    preferredYear: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.currentEducation) newErrors.currentEducation = 'Current education level is required';
    if (!formData.gpa.trim()) newErrors.gpa = 'GPA/Grade is required';
    if (!formData.englishProficiency) newErrors.englishProficiency = 'English proficiency test is required';
    if (!formData.preferredIntake) newErrors.preferredIntake = 'Preferred intake is required';
    if (!formData.preferredYear) newErrors.preferredYear = 'Preferred year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate brief loading
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Clear form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        nationality: '',
        dateOfBirth: '',
        currentEducation: '',
        gpa: '',
        englishProficiency: '',
        englishScore: '',
        statementOfPurpose: '',
        preferredIntake: '',
        preferredYear: ''
      });
      setErrors({});
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Apply for Scholarship</h3>
              <p className="text-red-100 text-sm">{scholarshipTitle}</p>
              <p className="text-red-100 text-xs">{program} Program</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
               <h4 className="text-xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h4>
               <p className="text-gray-600 mb-2">Thank you for applying to the {scholarshipTitle}.</p>
               <p className="text-gray-600">Your application has been submitted and will be reviewed soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-red-600" />
                  Personal Information
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        className="w-[110px] px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+60">+60</option>
                        <option value="+61">+61</option>
                        <option value="+86">+86</option>
                        <option value="+92">+92</option>
                        <option value="+880">+880</option>
                        <option value="+977">+977</option>
                      </select>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234567890"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.nationality ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Indian, American"
                    />
                    {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Academic Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-red-600" />
                  Academic Information
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Education Level *
                    </label>
                    <select
                      value={formData.currentEducation}
                      onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.currentEducation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select education level</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                    </select>
                    {errors.currentEducation && <p className="text-red-500 text-xs mt-1">{errors.currentEducation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GPA/Grade *
                    </label>
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.gpa ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="3.8 or 85%"
                    />
                    {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Proficiency Test *
                    </label>
                    <select
                      value={formData.englishProficiency}
                      onChange={(e) => handleInputChange('englishProficiency', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.englishProficiency ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select test type</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="PTE">PTE</option>
                      <option value="Duolingo">Duolingo</option>
                      <option value="None">No test taken</option>
                    </select>
                    {errors.englishProficiency && <p className="text-red-500 text-xs mt-1">{errors.englishProficiency}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Score
                    </label>
                    <input
                      type="text"
                      value={formData.englishScore}
                      onChange={(e) => handleInputChange('englishScore', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="7.5 or 100"
                      disabled={formData.englishProficiency === 'None'}
                    />
                  </div>
                </div>
              </div>

              {/* Study Preferences Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-red-600" />
                  Study Preferences
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Intake *
                    </label>
                    <select
                      value={formData.preferredIntake}
                      onChange={(e) => handleInputChange('preferredIntake', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.preferredIntake ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select intake</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                    {errors.preferredIntake && <p className="text-red-500 text-xs mt-1">{errors.preferredIntake}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Year *
                    </label>
                    <select
                      value={formData.preferredYear}
                      onChange={(e) => handleInputChange('preferredYear', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.preferredYear ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                    {errors.preferredYear && <p className="text-red-500 text-xs mt-1">{errors.preferredYear}</p>}
                  </div>
                </div>
              </div>

              {/* Statement of Purpose Section */}
              {/* <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-red-600" />
                  Statement of Purpose
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want this scholarship? (Minimum 100 words) *
                  </label>
                  <textarea
                    value={formData.statementOfPurpose}
                    onChange={(e) => handleInputChange('statementOfPurpose', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                      errors.statementOfPurpose ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please explain your motivation for applying to this scholarship, your career goals, and how this scholarship will help you achieve them..."
                  />
                  {errors.statementOfPurpose && <p className="text-red-500 text-xs mt-1">{errors.statementOfPurpose}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Word count: {formData.statementOfPurpose.split(' ').filter(word => word.length > 0).length} words
                  </p>
                </div>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl font-medium hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </div>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipApplicationPopup;
