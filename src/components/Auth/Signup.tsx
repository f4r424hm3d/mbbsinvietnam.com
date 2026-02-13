import React, { useState ,useEffect} from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { registerStudent, StudentRegistrationParams, loginStudent, StudentLoginParams, getStudentProfile } from '../../Api';
import OTPVerification from './OTPVerification';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { Link } from 'react-router-dom';

interface SignUpFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  
  // Field-specific errors for signup form
  const [signUpErrors, setSignUpErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});
  
  // Field-specific errors for login form
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    countryCode: 'IN +91',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const countryCodes = [
    { code: 'IN +91', country: 'India' },
    { code: 'US +1', country: 'United States' },
    { code: 'UK +44', country: 'United Kingdom' },
    { code: 'CA +1', country: 'Canada' },
    { code: 'AU +61', country: 'Australia' },
    { code: 'DE +49', country: 'Germany' },
    { code: 'FR +33', country: 'France' },
    { code: 'JP +81', country: 'Japan' },
    { code: 'CN +86', country: 'China' },
    { code: 'RU +7', country: 'Russia' }
  ];

  const handleSignUpInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
    // Clear field-specific error when user starts typing
    if (signUpErrors[field as keyof typeof signUpErrors]) {
      setSignUpErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
    
    setSignUpData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoginInputChange = (field: keyof LoginFormData, value: string) => {
    // Clear field-specific error when user starts typing
    if (loginErrors[field as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
    
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setSignUpErrors({});
    
    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpErrors({
        confirmPassword: 'Passwords do not match'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Extract country code number from the format "IN +91"
      const countryCodeNumber = signUpData.countryCode.split(' ')[1];
      
      const registrationParams: StudentRegistrationParams = {
        name: signUpData.fullName,
        email: signUpData.email,
        country_code: countryCodeNumber,
        phone: signUpData.phoneNumber,
        password: signUpData.password,
        confirm_password: signUpData.confirmPassword,
      };
      
      const response = await registerStudent(registrationParams);
      
      if (response.status) {
        // Store student ID, email, and name in localStorage
        localStorage.setItem('studentId', response.data.id.toString());
        localStorage.setItem('studentEmail', response.data.email);
        localStorage.setItem('studentName', signUpData.fullName);
        
        // Show OTP verification page instead of success message
        setShowOTPVerification(true);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const fieldErrors: typeof signUpErrors = {};
      
      // Parse API error response
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors object (Laravel format)
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const errorMessages = errorData.errors[key];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              // Map API field names to form field names
              if (key === 'email') {
                // Check if it's the "email already taken" error
                const errorMsg = errorMessages[0].toLowerCase();
                if (errorMsg.includes('already') || errorMsg.includes('taken')) {
                  fieldErrors.email = 'The email has already been taken';
                } else {
                  fieldErrors.email = errorMessages[0];
                }
              } else if (key === 'name') {
                fieldErrors.fullName = errorMessages[0];
              } else if (key === 'phone') {
                fieldErrors.phoneNumber = errorMessages[0];
              } else if (key === 'password') {
                fieldErrors.password = errorMessages[0];
              } else if (key === 'confirm_password') {
                fieldErrors.confirmPassword = errorMessages[0];
              }
            }
          });
        }
        // Handle single message format
        else if (errorData.message) {
          const message = errorData.message.toLowerCase();
          if (message.includes('email') && (message.includes('already') || message.includes('taken'))) {
            fieldErrors.email = 'The email has already been taken';
          } else if (message.includes('email')) {
            fieldErrors.email = errorData.message;
          } else if (message.includes('password')) {
            fieldErrors.password = errorData.message;
          } else if (message.includes('phone')) {
            fieldErrors.phoneNumber = errorData.message;
          } else if (message.includes('name')) {
            fieldErrors.fullName = errorData.message;
          }
        }
      }
      
      setSignUpErrors(fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setLoginErrors({});
    
    try {
      const loginParams: StudentLoginParams = {
        email: loginData.email,
        password: loginData.password
      };
      
      const response = await loginStudent(loginParams);
      
      if (response.data) {
        // Store student ID, email, and token in localStorage
        localStorage.setItem('studentId', response.data.id.toString());
        localStorage.setItem('studentEmail', response.data.email);
        localStorage.setItem('studentToken', response.data.token);
        
        // Fetch and store user's name from profile
        try {
          const profileResponse = await getStudentProfile();
          if (profileResponse.data?.student?.name) {
            localStorage.setItem('studentName', profileResponse.data.student.name);
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Continue even if profile fetch fails
        }
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/student-dashboard';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const fieldErrors: typeof loginErrors = {};
      
      // Parse API error response
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors object (Laravel format)
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const errorMessages = errorData.errors[key];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              if (key === 'email') {
                fieldErrors.email = errorMessages[0];
              } else if (key === 'password') {
                fieldErrors.password = errorMessages[0];
              }
            }
          });
        }
        // Handle single message format
        else if (errorData.message) {
          const message = errorData.message.toLowerCase();
          if (message.includes('email')) {
            fieldErrors.email = errorData.message;
          } else if (message.includes('password') || message.includes('credential')) {
            fieldErrors.password = errorData.message;
          } else {
            // Generic error - show on email field if it's about credentials
            if (message.includes('invalid') || message.includes('incorrect')) {
              fieldErrors.email = errorData.message;
              fieldErrors.password = errorData.message;
            }
          }
        } else if (errorData.error) {
          const errorMsg = errorData.error.toLowerCase();
          if (errorMsg.includes('email')) {
            fieldErrors.email = errorData.error;
          } else if (errorMsg.includes('password') || errorMsg.includes('credential')) {
            fieldErrors.password = errorData.error;
          } else {
            fieldErrors.email = errorData.error;
            fieldErrors.password = errorData.error;
          }
        }
      }
      
      setLoginErrors(fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear messages and errors when switching forms
    setSignUpErrors({});
    setLoginErrors({});
    setSuccessMessage('');
    // Reset forms when switching
    setSignUpData({
      fullName: '',
      email: '',
      countryCode: 'IN +91',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    setLoginData({
      email: '',
      password: ''
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Show OTP verification page if registration was successful
  if (showOTPVerification) {
    return <OTPVerification />;
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create an account'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Join Study in Kyrgyzstan today and start exploring your documents in a whole new way'
              }
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Sign Up Form */}
          {!isLogin && (
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={signUpData.fullName}
                    onChange={(e) => handleSignUpInputChange('fullName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      signUpErrors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {signUpErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      signUpErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {signUpErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.email}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <select
                      value={signUpData.countryCode}
                      onChange={(e) => handleSignUpInputChange('countryCode', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none bg-white"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative flex-2">
                    <input
                      type="tel"
                      required
                      value={signUpData.phoneNumber}
                      onChange={(e) => handleSignUpInputChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        signUpErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                {signUpErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signUpData.password}
                    onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      signUpErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {signUpErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      signUpErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {signUpErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  checked={signUpData.agreeToTerms}
                  onChange={(e) => handleSignUpInputChange('agreeToTerms', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                />
                <label className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    terms of service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    privacy policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          )}

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => handleLoginInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      loginErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => handleLoginInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      loginErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="/auth/password/reset" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          )}

          {/* Toggle Form */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
