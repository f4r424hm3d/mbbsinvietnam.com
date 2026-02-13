import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Mail, XCircle } from 'lucide-react';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../Api';

const PasswordReset: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter the email associated with your account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedEmail = email.trim();
      const response = await requestPasswordReset(trimmedEmail);
      const responseMessage =
        response?.message ||
        'If an account exists for this email, a reset link has been sent. Please check your inbox.';

      setSuccessMessage(responseMessage);
      setShowSuccessModal(true);
      setSubmittedEmail(trimmedEmail);
      setEmail('');
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again after a moment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to login
          </button>

          <div className="rounded-3xl shadow-2xl bg-white p-10 border border-red-100">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 rounded-full mb-4">
                Forgot Password
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reset your password
              </h1>
              <p className="text-gray-600">
                Enter your email address and we’ll send you a secure link to
                create a new password.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <p className="text-green-800 text-sm text-left">
                  {successMessage}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <p className="text-red-700 text-sm text-left">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(event) => {
                      if (successMessage) {
                        setSuccessMessage('');
                      }
                      if (errorMessage) {
                        setErrorMessage('');
                      }
                      setEmail(event.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-red-300 text-white cursor-wait'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-[1.01]'
                }`}
              >
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link
                to="/auth"
                className="text-red-600 font-medium hover:text-red-700 underline"
              >
                Go back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Sent</h2>
            <p className="text-gray-600 mb-6">
              We sent an email to{' '}
              <span className="font-semibold text-gray-900">
                {submittedEmail || 'your email address'}
              </span>{' '}
              with a
              link to get back into your account.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;

