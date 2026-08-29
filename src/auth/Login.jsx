import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Bug, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { validation } from '../utils/validation';
import { alertSuccess, alertApiError } from '../utils/alerts';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, role, loading } = useAuth();
  const { loginWithRedirect, isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();
  const navigate = useNavigate();

  // Removed automatic Auth0 exchange from Login page. Auth0Handler will perform exchange
  // only when the login flow was explicitly initiated by the user (see Continue with Google button).

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'email') {
      if (!validation.isRequired(value)) newErrors.email = 'Email is required';
      else if (!validation.isValidEmail(value)) newErrors.email = 'Please enter a valid email address';
      else delete newErrors.email;
    } else if (name === 'password') {
      if (!validation.isRequired(value)) newErrors.password = 'Password is required';
      else delete newErrors.password;
    }
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validateField(name, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const newErrors = { ...validateField('email', email), ...validateField('password', password) };
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const user = await login({ email: email.trim(), password });
      const userRole = user?.role || role;
      await alertSuccess('Welcome back!', 'Login successful.');
      navigate(userRole === 'Admin' ? '/admin' : '/dashboard');
    } catch (error) {
      alertApiError(error, 'Login failed. Please try again.');
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
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Product teams, in flow
            </div>
            <h1 className="max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">Bring clarity to every issue, from report to release.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">BugFlow gives your team one calm, focused workspace for triage, collaboration, and quality delivery.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Keep work visible across the team', 'Move from bugs to better releases'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><CheckCircle2 className="h-5 w-5 text-blue-600" />{item}</div>
              ))}
            </div>
            <div className="mt-9 hidden rounded-3xl border border-white/80 bg-white/65 p-5 shadow-[0_20px_60px_-32px_rgba(37,99,235,0.28)] backdrop-blur sm:block">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white"><Bug className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-slate-900">Release health</p><p className="text-xs text-slate-500">Today’s engineering pulse</p></div></div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">On track</span></div>
              <div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-blue-50/80 p-3"><p className="text-lg font-bold text-slate-900">24</p><p className="mt-0.5 text-[11px] font-medium text-slate-500">Open issues</p></div><div className="rounded-xl bg-white/80 p-3"><p className="text-lg font-bold text-slate-900">81%</p><p className="mt-0.5 text-[11px] font-medium text-slate-500">Resolved</p></div><div className="rounded-xl bg-white/80 p-3"><p className="text-lg font-bold text-slate-900">4.8d</p><p className="mt-0.5 text-[11px] font-medium text-slate-500">Avg. cycle</p></div></div>
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center animate-[auth-enter_650ms_100ms_ease-out_both] lg:order-2 lg:justify-self-end">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_-34px_rgba(30,64,175,0.34)] backdrop-blur-xl sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><LockKeyhole className="h-5 w-5" /></div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to pick up where your team left off.</p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <AuthField label="Work email" error={errors.email && touched.email}>
                  <Mail className="h-4 w-4" />
                  <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors(validateField('email', e.target.value)); }} onBlur={handleBlur} placeholder="you@company.com" className="auth-input" />
                </AuthField>
                {errors.email && touched.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                <AuthField label="Password" error={errors.password && touched.password}>
                  <LockKeyhole className="h-4 w-4" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors(validateField('password', e.target.value)); }} onBlur={handleBlur} placeholder="Enter your password" className="auth-input pr-10" />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </AuthField>
                {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                <div className="flex justify-end pt-1 text-sm">
                  <button type="button" onClick={() => navigate('/forgot-password')} className="font-semibold text-blue-700 transition hover:text-blue-800">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading || Object.keys(errors).length > 0} className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-blue-400">{loading ? 'Logging in...' : 'Log in'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
              </form>
              {/* Auth0 Google button - Phase 2 only (frontend-only) */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <div className="w-full border-t border-blue-50" />
                  </div>
                  <div className="relative flex justify-center text-xs text-slate-400">Or continue with</div>
                </div>
                <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        console.debug('Login: Continue with Google clicked - setting auth0LoginInitiated');
                        try { localStorage.setItem('auth0LoginInitiated', '1'); } catch (e) {}
                        // remove any leftover logout flag when user intentionally logs in
                        try { localStorage.removeItem('auth0Logout'); } catch (e) {}
                        // Initiate Auth0 redirect directly to the Google connection so the
                        // Auth0 Universal Login page is skipped and the Google account chooser
                        // appears immediately.
                        loginWithRedirect({
                          authorizationParams: {
                            connection: 'google-oauth2',
                            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                            scope: 'openid profile email',
                          },
                        });
                      }}
                      disabled={isAuth0Loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Continue with Google
                    </button>
                </div>
                {/* Temporary dev indicator for Auth0 auth state */}
                {!isAuth0Loading && isAuth0Authenticated && (
                    <div className="mt-3 text-center text-sm font-medium text-green-700">Authenticated with Auth0</div>
                )}
              </div>
              <p className="mt-6 text-center text-sm text-slate-500">New to BugFlow? <button type="button" onClick={() => navigate('/signup')} className="font-semibold text-blue-700 hover:text-blue-800">Create an account</button></p>
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-50 pt-5 text-xs font-medium text-slate-400"><ShieldCheck className="h-4 w-4 text-blue-500" />Secure access for your whole team</div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const AuthField = ({ label, error, children }) => (
  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><span className={`relative flex items-center rounded-xl border bg-[#f9fcff] text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/70 ${error ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100' : 'border-blue-100'}`}><span className="ml-3">{children[0]}</span>{children.slice(1)}</span></label>
);

const ErrorMessage = ({ children }) => <div className="-mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"><AlertCircle className="h-4 w-4" />{children}</div>;

export default Login;
