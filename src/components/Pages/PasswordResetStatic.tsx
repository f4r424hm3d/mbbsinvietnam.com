import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, Lock, XCircle } from 'lucide-react';
import { getStudentProfile, loginStudent, resetPassword } from '../../Api';

const PasswordResetStatic: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = useMemo(() => searchParams.get('uid') ?? '', [searchParams]);
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const emailParam = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      setErrorMessage('This password reset link is invalid or has expired.');
      setIsLinkInvalid(true);
    }
  }, [uid, token]);

  const handleNavigateToLogin = () => {
    navigate('/auth');
  };

  const attemptAutoLogin = async (
    email: string | null,
    password: string,
    hasTokenAlready: boolean
  ) => {
    if (!email || hasTokenAlready) {
      return hasTokenAlready;
    }

    try {
      const loginResponse = await loginStudent({ email, password });
      if (loginResponse?.data?.token) {
        localStorage.setItem('studentId', loginResponse.data.id.toString());
        localStorage.setItem('studentEmail', loginResponse.data.email);
        localStorage.setItem('studentToken', loginResponse.data.token);
        return true;
      }
    } catch (loginError) {
      console.error('Automatic login after password reset failed:', loginError);
    }

    return hasTokenAlready;
  };

  const hydrateStudentProfile = async () => {
    try {
      const profileResponse = await getStudentProfile();
      const studentName = profileResponse?.data?.student?.name;
      if (studentName) {
        localStorage.setItem('studentName', studentName);
      }
    } catch (profileError) {
      console.error('Fetching student profile after password reset failed:', profileError);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!uid || !token) {
      setErrorMessage('This password reset link is invalid or has expired.');
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please enter and confirm your new password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        uid,
        token,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      const apiMessage = response?.message?.trim();
      const messageToShow = apiMessage || 'Password updated successfully.';
      setSuccessMessage(messageToShow);

      const responseData = response?.data ?? {};

      if (responseData?.token) {
        localStorage.setItem('studentToken', String(responseData.token));
      }

      if (responseData?.id) {
        localStorage.setItem('studentId', String(responseData.id));
      }

      if (responseData?.email) {
        localStorage.setItem('studentEmail', String(responseData.email));
      } else if (emailParam) {
        localStorage.setItem('studentEmail', emailParam);
      }

      const emailForLogin =
        (typeof responseData?.email === 'string' && responseData.email) ||
        emailParam ||
        localStorage.getItem('studentEmail');

      const hasToken =
        Boolean(responseData?.token) || Boolean(localStorage.getItem('studentToken'));

      const tokenAvailable = await attemptAutoLogin(emailForLogin, newPassword, hasToken);

      if (tokenAvailable) {
        await hydrateStudentProfile();
      }

      sessionStorage.setItem('dashboardFlashMessage', 'Password updated successfully.');

      setTimeout(() => {
        navigate('/student-dashboard', { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error('Password reset failed:', error);

      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error?.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to reset your password right now. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] bg-gradient-to-br from-red-50 via-white to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl px-8 py-10 border border-red-100">
        <button
          onClick={handleNavigateToLogin}
          className="flex items-center text-sm text-red-600 hover:text-red-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </button>

        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 rounded-full mb-4">
            Reset Password
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a new password</h1>
          <p className="text-gray-600">
            {isLinkInvalid
              ? 'Please request a new password reset link to continue.'
              : 'Choose a strong password that you do not use elsewhere.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
            <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                disabled={isLinkInvalid}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Must be at least 8 characters and include a mix of letters, numbers, or symbols.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm new password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                disabled={isLinkInvalid}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLinkInvalid || isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
              isLinkInvalid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSubmitting
                  ? 'bg-red-400 text-white cursor-wait'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-[1.01]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetStatic;
