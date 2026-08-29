import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Bug, Check, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import { resetPassword } from '../api/authApi';
import { validation } from '../utils/validation';
import { alertApiError, alertSuccess, alertValidationError } from '../utils/alerts';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError('Reset link expired or invalid');
    }
  }, [token]);

  const validateField = (name, value) => {
    const nextErrors = { ...errors };

    if (name === 'password') {
      if (!validation.isRequired(value)) {
        nextErrors.password = 'Password is required';
      } else {
        const strength = validation.getPasswordStrength(value);
        if (strength.score < 3) {
          nextErrors.password = strength.message;
        } else {
          delete nextErrors.password;
        }
      }
    }

    if (name === 'confirmPassword') {
      if (!validation.isRequired(value)) {
        nextErrors.confirmPassword = 'Please confirm your password';
      } else if (value !== form.password) {
        nextErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete nextErrors.confirmPassword;
      }
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (touched[name]) {
      setErrors(validateField(name, value));
    }

    if (touched.confirmPassword && name === 'password') {
      setErrors((prev) => {
        const next = { ...prev };
        if (!updatedForm.confirmPassword) {
          next.confirmPassword = 'Please confirm your password';
        } else if (updatedForm.confirmPassword !== value) {
          next.confirmPassword = 'Passwords do not match';
        } else {
          delete next.confirmPassword;
        }
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateField(name, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      password: validateField('password', form.password).password,
      confirmPassword: validateField('confirmPassword', form.confirmPassword).confirmPassword,
    };

    setTouched({ password: true, confirmPassword: true });
    setErrors(nextErrors);

    if (nextErrors.password || nextErrors.confirmPassword || !token) {
      alertValidationError('Password', nextErrors.password || nextErrors.confirmPassword || 'Reset link expired or invalid');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: form.password });
      setResetSuccess(true);
      await alertSuccess('Password reset successfully', 'Your password has been updated. You can now sign in with your new password.');
    } catch (error) {
      setTokenError('Reset link expired or invalid');
      alertApiError(error, 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  const requirementClass = (condition) => condition ? 'text-emerald-600' : 'text-slate-500';

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faff] text-slate-900">
      <PublicNavbar />
      <main className="public-auth-shell flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="public-auth-orb public-auth-orb-one" />
        <div className="public-auth-orb public-auth-orb-two" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="order-2 max-w-xl animate-[auth-enter_650ms_ease-out_both] lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-950/5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Secure account recovery
            </div>
            <h1 className="max-w-lg text-3xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-4xl">Create a new password</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">Choose a strong password to keep your BugFlow account secure.</p>

            <div className="mt-8 rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_-24px_rgba(30,64,175,0.12)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Password security</div>
                  <div className="text-xs text-slate-500">Use a unique, hard-to-guess password</div>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>Your password should be unique and difficult to guess.</span>
                </div>
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>Use at least 8 characters with upper and lower case, a number, and a symbol.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center animate-[auth-enter_650ms_100ms_ease-out_both] lg:order-2 lg:justify-self-end">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_-34px_rgba(30,64,175,0.18)] backdrop-blur-xl sm:p-8">
              {resetSuccess ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-600/10">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Password reset successfully</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Your password has been updated. You can now sign in with your new password.</p>
                  <button type="button" onClick={() => navigate('/login')} className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35">
                    Continue to Login
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : tokenError ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-lg shadow-red-600/10">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Reset link expired or invalid</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">This password reset link is no longer valid. Please request a new reset link.</p>
                  <div className="mt-6 space-y-3">
                    <button type="button" onClick={() => navigate('/forgot-password')} className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35">
                      Request New Link
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button type="button" onClick={() => navigate('/login')} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                      Back to Login
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                    <Bug className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Set a new password</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Create a new password for your BugFlow account.</p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <AuthField label="New Password" error={errors.password && touched.password}>
                      <LockKeyhole className="h-4 w-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Create a strong password"
                        className="auth-input pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </AuthField>
                    {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}

                    <div className="-mt-1 text-sm text-slate-600">
                      <div className="mb-2 font-medium text-slate-700">Password requirements</div>
                      <ul className="grid gap-1.5">
                        <li className={`flex items-center gap-2 ${requirementClass(form.password.length >= 8)}`}><Check className="h-4 w-4" /> 8+ characters</li>
                        <li className={`flex items-center gap-2 ${requirementClass(/[A-Z]/.test(form.password))}`}><Check className="h-4 w-4" /> Uppercase letter</li>
                        <li className={`flex items-center gap-2 ${requirementClass(/[a-z]/.test(form.password))}`}><Check className="h-4 w-4" /> Lowercase letter</li>
                        <li className={`flex items-center gap-2 ${requirementClass(/\d/.test(form.password))}`}><Check className="h-4 w-4" /> Number</li>
                        <li className={`flex items-center gap-2 ${requirementClass(/[@$!%*?&]/.test(form.password))}`}><Check className="h-4 w-4" /> Special character</li>
                      </ul>
                    </div>

                    <AuthField label="Confirm Password" error={errors.confirmPassword && touched.confirmPassword}>
                      <LockKeyhole className="h-4 w-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm your password"
                        className="auth-input pr-10"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </AuthField>
                    {errors.confirmPassword && touched.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-blue-400"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-500">
                    <button type="button" onClick={() => navigate('/login')} className="font-semibold text-blue-700 hover:text-blue-800">
                      Back to Login
                    </button>
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-50 pt-5 text-xs font-medium text-slate-400">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    Secure access for your BugFlow account
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

export default ResetPassword;
