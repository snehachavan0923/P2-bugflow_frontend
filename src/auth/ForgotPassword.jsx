import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import { requestPasswordReset } from '../api/authApi';
import { validation } from '../utils/validation';
import { alertApiError, alertSuccess } from '../utils/alerts';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const nextErrors = {};

    if (!validation.isRequired(value)) {
      nextErrors.email = 'Email is required';
    } else if (!validation.isValidEmail(value)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    return nextErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validateEmail(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true });
    const nextErrors = validateEmail(email);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset({ email: email.trim() });
      setEmailSent(true);
      await alertSuccess('Reset link sent', 'If an account exists for this email, password reset instructions have been sent.');
    } catch (error) {
      alertApiError(error, 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faff] text-slate-900">
      <PublicNavbar />
      <main className="public-auth-shell flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="public-auth-orb public-auth-orb-one" />
        <div className="public-auth-orb public-auth-orb-two" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="order-2 max-w-xl animate-[auth-enter_650ms_ease-out_both] lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-950/5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Account recovery
            </div>
            <h1 className="max-w-lg text-3xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-4xl">Forgot your password?</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">Don’t worry. We’ll help you get back into your BugFlow workspace.</p>

            <div className="mt-8 rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_-24px_rgba(30,64,175,0.12)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Secure email recovery</div>
                  <div className="text-xs text-slate-500">Your account stays protected</div>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>Enter the email address associated with your BugFlow account and we’ll send a secure reset link.</span>
                </div>
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>Use the link to create a new password within 30 minutes.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center animate-[auth-enter_650ms_100ms_ease-out_both] lg:order-2 lg:justify-self-end">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_-34px_rgba(30,64,175,0.18)] backdrop-blur-xl sm:p-8">
              {emailSent ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-600/10">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Check your inbox</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">If an account exists for this email, we’ve sent password reset instructions.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Please check your inbox and follow the link to create a new password.</p>

                  <div className="mt-6 space-y-3">
                    <button type="button" onClick={() => navigate('/login')} className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35">
                      Back to Login
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button type="button" onClick={() => setEmailSent(false)} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                      Didn’t receive the email? Try again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Reset your password</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Enter your email address and we’ll send you a secure reset link.</p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <AuthField label="Email address" error={errors.email && touched.email}>
                      <Mail className="h-4 w-4" />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (touched.email) {
                            setErrors(validateEmail(e.target.value));
                          }
                        }}
                        onBlur={handleBlur}
                        placeholder="you@company.com"
                        className="auth-input"
                      />
                    </AuthField>
                    {errors.email && touched.email && <ErrorMessage>{errors.email}</ErrorMessage>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-blue-400"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-500">
                    Remember your password?{' '}
                    <button type="button" onClick={() => navigate('/login')} className="font-semibold text-blue-700 hover:text-blue-800">
                      Back to Login
                    </button>
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-50 pt-5 text-xs font-medium text-slate-400">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    Secure account recovery
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const AuthField = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
    <span className={`relative flex items-center rounded-xl border bg-[#f9fcff] text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/70 ${error ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100' : 'border-blue-100'}`}>
      <span className="ml-3">{children[0]}</span>
      {children.slice(1)}
    </span>
  </label>
);

const ErrorMessage = ({ children }) => (
  <div className="-mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
    <AlertCircle className="h-4 w-4" />
    {children}
  </div>
);

export default ForgotPassword;