import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Video,
  HeadphonesIcon,
  X,
  Loader2
} from 'lucide-react';
import { getTeamMembers, TeamMember, IMAGE_BASE_URL, getOffices, Office, submitContactUs } from '../../../Api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  subject: string;
  message: string;
  inquiryType: string;
  preferredContact: string;
}

interface ScheduleFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  consultationType: string;
  message: string;
}

// TeamMember interface is now imported from Api.ts
const ContactTeam: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '91',
    subject: '',
    message: '',
    inquiryType: '',
    preferredContact: 'email'
  });

  const [scheduleFormData, setScheduleFormData] = useState<ScheduleFormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '91',
    preferredDate: '',
    preferredTime: '',
    timezone: 'IST',
    consultationType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);
  const [isScheduleSubmitted, setIsScheduleSubmitted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const contactFormRef = useRef<HTMLDivElement | null>(null);
  
  // API states
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  
  // Offices API states
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setIsLoadingTeam(true);
      setTeamError(null);
      const response = await getTeamMembers({ limit: 6 });
      setTeamMembers(response.data.users);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamError('Failed to load team members. Please try again later.');
    } finally {
      setIsLoadingTeam(false);
    }
  };

  // Fetch offices from API
  const fetchOffices = async () => {
    try {
      setIsLoadingOffices(true);
      setOfficesError(null);
      const response = await getOffices();
      setOffices(response.data.offices);
    } catch (error) {
      console.error('Error fetching offices:', error);
      setOfficesError('Failed to load offices. Please try again later.');
    } finally {
      setIsLoadingOffices(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setScheduleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to extract country code from phone number
  const extractCountryCode = (phone: string): string => {
    if (!phone) return '91';
    
    // Remove all spaces and special characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with +
    if (cleaned.startsWith('+')) {
      // Extract country code (assuming 1-3 digits after +)
      const match = cleaned.match(/^\+(\d{1,3})/);
      if (match) {
        return match[1];
      }
    }
    
    // Check if it starts with country code (e.g., 91 for India)
    // Only if the number is clearly longer than a local number (more than 10 digits)
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      return '91';
    }
    
    // Default to India country code
    return '91';
  };

  // Helper function to clean phone number (remove country code if present)
  const cleanPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Remove + and country code if present
    if (cleaned.startsWith('+')) {
      // Remove + and first 1-3 digits (country code)
      const withoutPlus = cleaned.replace(/^\+\d{1,3}/, '');
      return withoutPlus || cleaned.substring(1); // Fallback if regex fails
    }
    
    // If starts with 91 and has more than 10 digits, remove 91
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      return cleaned.substring(2);
    }
    
    // Return cleaned number as is (assume it's already a local number)
    return cleaned;
  };

  const asianCountryCodes = [
    { code: '91', label: '+91' },
    { code: '880', label: '+880' },
    { code: '975', label: '+975' },
    { code: '673', label: '+673' },
    { code: '86', label: '+86' },
    { code: '852', label: '+852' },
    { code: '62', label: '+62' },
    { code: '81', label: '+81' },
    { code: '82', label: '+82' },
    { code: '60', label: '+60' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Extract country code and clean phone number
      const selectedCountryCode = formData.countryCode || '91';
      const countryCode = selectedCountryCode.replace(/\D/g, '') || extractCountryCode(formData.phone);
      let phoneNumber = '';
      
      if (formData.phone && formData.phone.trim()) {
        phoneNumber = cleanPhoneNumber(formData.phone);
        // If after cleaning the phone is empty or invalid, use cleaned original
        if (!phoneNumber || phoneNumber.length < 5) {
          // Remove spaces and special chars, but keep the number
          phoneNumber = formData.phone.replace(/[\s\-\(\)]/g, '');
          // If it starts with + or country code, remove it
          if (phoneNumber.startsWith('+')) {
            phoneNumber = phoneNumber.replace(/^\+\d{1,3}/, '');
          } else if (phoneNumber.startsWith('91') && phoneNumber.length > 10) {
            phoneNumber = phoneNumber.substring(2);
          }
        }
      }
      
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim() || !formData.inquiryType) {
        setSubmitError('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }
      
      // Call the API
      const response = await submitContactUs({
        name: formData.name.trim(),
        email: formData.email.trim(),
        country_code: countryCode,
        phone: phoneNumber,
        inquiry_type: formData.inquiryType,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      
      if (response.success) {
        setSuccessMessage(response.message || 'Your inquiry has been submitted successfully. We will contact you soon.');
        setShowSuccessPopup(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '91',
          subject: '',
          message: '',
          inquiryType: '',
          preferredContact: 'email'
        });
      } else {
        setSubmitError(response.message || 'Failed to submit your inquiry. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      
      // Better error message handling
      let errorMessage = 'Failed to submit your inquiry. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
        
        if (error.response.status === 422) {
          errorMessage = 'Please check your form data and try again.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else {
        // Error setting up the request
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsScheduleSubmitting(false);
    setIsScheduleSubmitted(true);
  };

  const openSchedulePopup = () => {
    setShowSchedulePopup(true);
  };

  const closeSchedulePopup = () => {
    setShowSchedulePopup(false);
    setIsScheduleSubmitted(false);
    setScheduleFormData({
      name: '',
      email: '',
      phone: '',
      countryCode: '91',
      preferredDate: '',
      preferredTime: '',
      timezone: 'IST',
      consultationType: '',
      message: ''
    });
  };

  const handleGetDirections = (office: Office) => {
    let mapsUrl = '';
    
    // If latitude and longitude are available, use them
    if (office.latitude_longitude) {
      const coords = office.latitude_longitude.split(',');
      if (coords.length === 2) {
        const lat = coords[0].trim();
        const lng = coords[1].trim();
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
    }
    
    // If no coordinates, use address
    if (!mapsUrl) {
      const address = `${office.location_name}, ${office.address_line}`;
      const encodedAddress = encodeURIComponent(address);
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
    
    // Open Google Maps in a new tab
    window.open(mapsUrl, '_blank');
  };

  const scrollToContactForm = () => {
    if (!contactFormRef.current) return;

    contactFormRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    const focusable = contactFormRef.current.querySelector<HTMLElement>(
      'input, textarea, select'
    );

    if (focusable) {
      window.setTimeout(() => focusable.focus(), 500);
    }
  };
  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  };

  const handleQuickContact = (type: 'phone' | 'email' | 'chat') => {
    const isMobile = isMobileDevice();
    if (type === 'phone') {
      window.open('tel:+919876543210', isMobile ? '_self' : '_blank', 'noopener');
      return;
    }

    if (type === 'email') {
      window.open('mailto:info@mededu.com', isMobile ? '_self' : '_blank', 'noopener');
      return;
    }

    if (type === 'chat') {
      const whatsappUrl = 'https://wa.me/919876543210';
      window.open(whatsappUrl, isMobile ? '_self' : '_blank', 'noopener');
    }
  };
  const quickContactOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      contact: '+91 98765 43210',
      action: 'Call Now',
      color: 'bg-green-500',
      available: '24/7 Available',
      type: 'phone' as const
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your detailed inquiry',
      contact: 'info@mededu.com',
      action: 'Send Email',
      color: 'bg-blue-500',
      available: 'Response within 24hrs',
      type: 'email' as const
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available on website',
      action: 'Start Chat',
      color: 'bg-purple-500',
      available: 'Mon-Sat, 9 AM - 9 PM',
      type: 'chat' as const
    },
    {
      icon: Video,
      title: 'Video Call',
      description: 'Schedule a video consultation',
      contact: 'Book appointment',
      action: 'Schedule Call',
      color: 'bg-orange-500',
      available: 'By appointment',
      type: 'video' as const
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchTeamMembers();
    fetchOffices();
  }, []);
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-orange-600 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <HeadphonesIcon className="w-8 h-8 text-orange-300 mr-3" />
              <span className="text-orange-200 text-lg font-medium">24/7 Support Available</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Contact <span className="text-orange-300">Our Team.</span>
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get in touch with our experienced team of education consultants, admission specialists, 
              and student support professionals. We're here to help you every step of the way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300 mb-2">24/7</div>
                <div className="text-orange-200">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300 mb-2">&lt;24hrs</div>
                <div className="text-orange-200">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300 mb-2">15+</div>
                <div className="text-orange-200">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300 mb-2">98%</div>
                <div className="text-orange-200">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch Instantly</h2>
            <p className="text-xl text-gray-600">Choose your preferred way to reach us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickContactOptions.map((option, index) => {
              const isVideoOption = option.type === 'video';
              const handleClick = () => {
                if (isVideoOption) {
                  openSchedulePopup();
                } else {
                  handleQuickContact(option.type);
                }
              };

              return (
              <div
                key={index}
                role={isVideoOption ? 'group' : 'button'}
                tabIndex={isVideoOption ? -1 : 0}
                onClick={handleClick}
                onKeyDown={(event) => {
                  if (!isVideoOption && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    handleClick();
                  }
                }}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${isVideoOption ? '' : 'cursor-pointer'}`}
              >
                <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <p className="text-sm font-medium text-gray-800 mb-2">{option.contact}</p>
                <p className="text-xs text-green-600 mb-4">{option.available}</p>
                <button 
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClick();
                  }}
                  className={`w-full ${option.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  {option.action}
                </button>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated professionals are here to guide you through every step of your medical education journey
            </p>
          </div>

          {/* Loading State */}
          {isLoadingTeam && (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-lg text-gray-600">Loading team members...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {teamError && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">{teamError}</p>
                <button 
                  onClick={fetchTeamMembers}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Team Members Grid */}
          {!isLoadingTeam && !teamError && teamMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => {
                // Parse specializations and languages from string to array
                let specializations = [];
                if (member.specializations) {
                  try {
                    // Try to parse as JSON first (in case it's a JSON array)
                    const parsed = JSON.parse(member.specializations);
                    specializations = Array.isArray(parsed) ? parsed : [parsed];
                  } catch {
                    // If not JSON, split by comma
                    specializations = member.specializations.split(',').map(s => s.trim()).filter(s => s);
                  }
                }
                
                const languages = member.languages ? 
                  member.languages.split(',').map(l => l.trim()).filter(l => l) : 
                  ['English']; // Default language
                
                return (
                  <div key={member.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col h-full">
                    <div className="relative">
                      <img 
                        src={member.profile_picture ? `${IMAGE_BASE_URL}/${member.profile_picture}` : 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                        alt={member.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {member.role}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        {member.designation && (
                          <p className="text-red-600 font-medium mb-2">{member.designation}</p>
                        )}
                        {member.experience_years && (
                          <p className="text-gray-600 text-sm mb-4">{member.experience_years}</p>
                        )}
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{member.phone}</span>
                            </div>
                          )}
                          {member.working_hours && (
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{member.working_hours}</span>
                            </div>
                          )}
                        </div>
                        
                        {specializations.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Specializations:</div>
                            <div className="flex flex-wrap gap-1">
                              {specializations.slice(0, 2).map((spec, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                  {spec}
                                </span>
                              ))}
                              {specializations.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  +{specializations.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {languages.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Languages:</div>
                            <div className="text-sm text-gray-600">{languages.join(', ')}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-auto">
                        <button
                          onClick={scrollToContactForm}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Contact Now
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Team Members State */}
          {!isLoadingTeam && !teamError && teamMembers.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No team members found.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section ref={contactFormRef} className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative flex w-full">
                    <div className="relative flex-shrink-0 w-24 min-w-[6rem] md:w-28 md:min-w-[7rem]">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        className="w-full appearance-none pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {asianCountryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="  Enter phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type *</label>
                  <select
                    required
                    value={formData.inquiryType}
                    onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="admission">Admission Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Student Support</option>
                    <option value="general">General Information</option>
                    <option value="complaint">Complaint/Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief subject of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-medium flex items-center justify-center ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                } transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <p className="text-xl text-gray-600">Visit us at our locations across India</p>
          </div>

          {/* Loading State */}
          {isLoadingOffices && (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-lg text-gray-600">Loading offices...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {officesError && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">{officesError}</p>
                <button 
                  onClick={fetchOffices}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Offices Grid */}
          {!isLoadingOffices && !officesError && offices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offices.map((office) => (
                <div key={office.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                  <img 
                    src={office.photo ? `${IMAGE_BASE_URL}/${office.photo}` : 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={office.office_name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{office.office_name}</h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                          <div>
                            <p className="font-medium">{office.location_name}</p>
                            <p>{office.address_line}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{office.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{office.working_hours}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleGetDirections(office)}
                      className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Offices State */}
          {!isLoadingOffices && !officesError && offices.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No offices found.</p>
              </div>
            </div>
          )}
        </div>
      </section>

     

      {/* Schedule Call Popup */}
      {showSchedulePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {isScheduleSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Scheduled!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for scheduling a video consultation. We'll send you a confirmation email with the meeting details.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Our team will contact you within 24 hours to confirm the appointment.
                </p>
                <button 
                  onClick={closeSchedulePopup}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Video className="w-8 h-8 text-orange-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Schedule Video Consultation</h2>
                  </div>
                  <button 
                    onClick={closeSchedulePopup}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleScheduleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={scheduleFormData.name}
                          onChange={(e) => handleScheduleInputChange('name', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={scheduleFormData.email}
                          onChange={(e) => handleScheduleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative flex w-full">
                    <div className="relative flex-shrink-0 w-24 min-w-[6rem] md:w-28 md:min-w-[7rem]">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <select
                        required
                        value={scheduleFormData.countryCode}
                        onChange={(e) => handleScheduleInputChange('countryCode', e.target.value)}
                        className="w-full appearance-none pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      >
                        {asianCountryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      required
                      value={scheduleFormData.phone}
                      onChange={(e) => handleScheduleInputChange('phone', e.target.value)}
                      className="flex-1  py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type *</label>
                      <select
                        required
                        value={scheduleFormData.consultationType}
                        onChange={(e) => handleScheduleInputChange('consultationType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select consultation type</option>
                        <option value="admission">Admission Consultation</option>
                        <option value="university">University Selection</option>
                        <option value="documentation">Documentation Help</option>
                        <option value="visa">Visa Guidance</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          required
                          value={scheduleFormData.preferredDate}
                          onChange={(e) => handleScheduleInputChange('preferredDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                      <select
                        required
                        value={scheduleFormData.preferredTime}
                        onChange={(e) => handleScheduleInputChange('preferredTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={scheduleFormData.timezone}
                        onChange={(e) => handleScheduleInputChange('timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="IST">IST (India Standard Time)</option>
  <option value="PKT">PKT (Pakistan Standard Time)</option>
  <option value="BST">BST (Bangladesh Standard Time)</option>
  <option value="NPT">NPT (Nepal Time)</option>
  <option value="MST">MST (Myanmar Standard Time)</option>
  <option value="ICT">ICT (Indochina Time – Thailand, Vietnam)</option>
  <option value="CST">CST (China Standard Time)</option>
  <option value="JST">JST (Japan Standard Time)</option>
  <option value="KST">KST (Korea Standard Time)</option>
  <option value="SGT">SGT (Singapore Time)</option>
  <option value="HKT">HKT (Hong Kong Time)</option>
  <option value="AWST">AWST (Australian Western Standard Time)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                    <textarea
                      rows={4}
                      value={scheduleFormData.message}
                      onChange={(e) => handleScheduleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Please provide any additional information about your consultation needs..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isScheduleSubmitting}
                      className={`flex-1 py-4 rounded-lg font-medium flex items-center justify-center ${
                        isScheduleSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      } transition-colors`}
                    >
                      {isScheduleSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5 mr-2" />
                          Schedule Consultation
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeSchedulePopup}
                      className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

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
                  {successMessage || '✓ Your inquiry has been submitted successfully. We will contact you soon.'}
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md shadow-red-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTeam;