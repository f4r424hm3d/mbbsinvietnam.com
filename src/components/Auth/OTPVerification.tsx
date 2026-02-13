import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { verifyOTP, OTPVerificationParams, resendOTP, ResendOTPParams } from '../../Api';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get email and student ID from localStorage
  const userEmail = localStorage.getItem('studentEmail') || 'your registered email address';
  const studentId = localStorage.getItem('studentId');

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setOtp(value);
      setErrorMessage(''); // Clear error when user types
      setSuccessMessage(''); // Clear success message when user types
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (otp.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit OTP');
      setIsSubmitting(false);
      return;
    }

    if (!studentId) {
      setErrorMessage('Student ID not found. Please try registering again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const verificationParams: OTPVerificationParams = {
        id: parseInt(studentId),
        otp: otp
      };

      console.log('Verifying OTP with params:', verificationParams);
      const response = await verifyOTP(verificationParams);
      console.log('OTP verification response:', response);
      
      if (response.status) {
        // Store token in localStorage for future authenticated requests
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isVerified', 'true');
        
        setSuccessMessage('Email verified successfully! Redirecting...');
        
        // Redirect to dashboard or home page after successful verification
        setTimeout(() => {
          window.location.href = '/student-dashboard';
        }, 2000);
      } else {
        setErrorMessage(response.message || 'OTP verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 404) {
        setErrorMessage('Invalid OTP or student ID. Please check your details and try again.');
      } else if (error.response?.status === 422) {
        setErrorMessage('Invalid OTP format. Please enter a valid 4-digit OTP.');
      } else if (error.response?.status >= 500) {
        setErrorMessage('Server error. Please try again later.');
      } else {
        setErrorMessage(`OTP verification failed. ${error.message || 'Please check your OTP and try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!studentId) {
      setErrorMessage('Student ID not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const resendParams: ResendOTPParams = {
        id: parseInt(studentId)
      };

      console.log('Resending OTP with params:', resendParams);
      const response = await resendOTP(resendParams);
      console.log('Resend OTP response:', response);

      if (response.status) {
        setSuccessMessage('OTP has been resent to your email. Please check your inbox.');
        setTimeLeft(300); // Reset timer to 5 minutes
        setOtp('');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 404) {
        setErrorMessage('Student ID not found. Please try registering again.');
      } else if (error.response?.status >= 500) {
        setErrorMessage('Server error. Please try again later.');
      } else {
        setErrorMessage(`Failed to resend OTP. ${error.message || 'Please try again.'}`);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Success Banner */}
      <div className="bg-green-100 border-b border-green-200 px-4 py-3">
        <div className="max-w-md mx-auto text-center">
          <p className="text-green-800 text-sm">
            An OTP has been sent to your registered email address.
          </p>
        </div>
      </div>

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

        {/* OTP Verification Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              An OTP has been sent to
            </h1>
            <p className="text-blue-600 text-lg font-medium mb-2">
              {userEmail}
            </p>
            <p className="text-gray-500 text-sm">
              OTP will expire in {formatTime(timeLeft)}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-blue-700 font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                placeholder="Enter 4-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                maxLength={4}
                disabled={timeLeft === 0}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 4 || timeLeft === 0 || !!successMessage}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting || otp.length !== 4 || timeLeft === 0 || successMessage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : successMessage ? (
                'Verified Successfully!'
              ) : (
                'Submit'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          {timeLeft === 0 && (
            <div className="text-center mt-4">
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className={`text-blue-600 hover:text-blue-800 underline text-sm transition-colors ${
                  isResending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Resending...
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>
          )}

          {/* Membership Query */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Are you already a member?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OTPVerification;
