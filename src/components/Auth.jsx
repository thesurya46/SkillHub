import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Sparkles, MapPin, Award, Calendar, Heart, Mail, Check } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { signIn, signUp } = useAuth();

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpEmail = async (userEmail, otpCode) => {
    console.log(`OTP sent to ${userEmail}: ${otpCode}`);
    return Promise.resolve();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName) {
          throw new Error('Please enter your full name');
        }

        const otpCode = generateOtp();
        setGeneratedOtp(otpCode);
        await sendOtpEmail(email, otpCode);
        setShowOtpVerification(true);
        setLoading(false);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (otp !== generatedOtp) {
        throw new Error('Invalid verification code. Please try again.');
      }

      await signUp(email, password, fullName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    await sendOtpEmail(email, otpCode);
    setOtp('');
    setError('');
  };

  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
              <Mail size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification code to <span className="font-semibold">{email}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Demo Mode - Your OTP Code:</p>
              <p className="text-3xl font-bold text-blue-600 text-center tracking-widest">{generatedOtp}</p>
              <p className="text-xs text-blue-700 text-center mt-2">
                In production, this would be sent to your email
              </p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the 6-digit code shown above
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Verifying...'
                ) : (
                  <>
                    <Check size={20} />
                    Verify & Create Account
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Resend verification code
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpVerification(false);
                    setOtp('');
                    setGeneratedOtp('');
                    setError('');
                  }}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Back to signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
              <Users size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Urban Skill Exchange</h1>
            <p className="text-gray-600">Connect with local talent, share skills, grow together</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  !isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {isSignUp && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  <p className="font-medium mb-1">Email Verification Required</p>
                  <p className="text-xs">We'll send a verification code to confirm your email address.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Continue' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-green-600 p-12 items-center justify-center">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Hyperlocal Talent Sharing</h2>
          <p className="text-blue-100 text-lg mb-8">
            Connect with your community, share your skills, learn from others, and collaborate on
            projects that matter.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Geo-Location Matching</h3>
                <p className="text-blue-100">Find skilled people in your neighborhood</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Easy Scheduling</h3>
                <p className="text-blue-100">Book sessions with built-in calendar</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Reputation System</h3>
                <p className="text-blue-100">Build trust through reviews and badges</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Community Projects</h3>
                <p className="text-blue-100">Join collaborative initiatives</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Credit System</h3>
                <p className="text-blue-100">Earn, spend, or donate credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
