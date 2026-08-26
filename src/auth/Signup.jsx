import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { signupUser } from '../api/authApi';
import { validation } from '../utils/validation';
import { alertSuccess, alertApiError } from '../utils/alerts';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    if (fieldName === 'name') {
      if (!validation.isRequired(value)) newErrors.name = 'Name is required';
      else if (!validation.minLength(value, 2)) newErrors.name = 'Name must be at least 2 characters';
      else if (!validation.maxLength(value, 50)) newErrors.name = 'Name must not exceed 50 characters';
      else delete newErrors.name;
    } else if (fieldName === 'email') {
      if (!validation.isRequired(value)) newErrors.email = 'Email is required';
      else if (!validation.isValidEmail(value)) newErrors.email = 'Please enter a valid email address';
      else delete newErrors.email;
    } else if (fieldName === 'password') {
      const strength = validation.getPasswordStrength(value);
      if (strength.score < 3) newErrors.password = strength.message;
      else delete newErrors.password;
    }
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name: fieldName, value } = e.target;
    setTouched({ ...touched, [fieldName]: true });
    setErrors(validateField(fieldName, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const newErrors = { ...validateField('name', name), ...validateField('email', email), ...validateField('password', password) };
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await signupUser({ name: name.trim(), email: email.trim(), password });
      await alertSuccess('Account created!', 'You can now log in with your credentials.');
      navigate('/login');
    } catch (error) {
      alertApiError(error, 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faff] text-slate-900">
      <PublicNavbar />
      <main className="public-auth-shell flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="public-auth-orb public-auth-orb-one" />
        <div className="public-auth-orb public-auth-orb-three" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="order-2 max-w-xl animate-[auth-enter_650ms_ease-out_both] lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-950/5"><Sparkles className="h-3.5 w-3.5" />Built for better releases</div>
            <h1 className="max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">Start a calmer, more visible way to ship.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">Create your BugFlow account and give every contributor a clear view of the work that matters.</p>
            <div className="mt-8 space-y-4">
              {[
                ['A shared source of truth', 'Give developers, testers, and reviewers the same live context.'],
                ['Structured from day one', 'Organize projects and issues without a complicated setup.'],
                ['Ready when your team is', 'Invite collaborators as your workflow takes shape.'],
              ].map(([title, description], index) => <div key={title} className="flex gap-3.5 rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm shadow-blue-950/5 backdrop-blur"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">0{index + 1}</span><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p></div></div>)}
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center animate-[auth-enter_650ms_100ms_ease-out_both] lg:order-2 lg:justify-self-end">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_-34px_rgba(30,64,175,0.34)] backdrop-blur-xl sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><Sparkles className="h-5 w-5" /></div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Create your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Get a focused home for every project and issue.</p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <SignupField label="Full name" error={errors.name && touched.name}><UserRound className="h-4 w-4" /><input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value); if (touched.name) setErrors(validateField('name', e.target.value)); }} onBlur={handleBlur} placeholder="Alex Morgan" className="auth-input" /></SignupField>
                {errors.name && touched.name && <SignupError>{errors.name}</SignupError>}
                <SignupField label="Work email" error={errors.email && touched.email}><Mail className="h-4 w-4" /><input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors(validateField('email', e.target.value)); }} onBlur={handleBlur} placeholder="you@company.com" className="auth-input" /></SignupField>
                {errors.email && touched.email && <SignupError>{errors.email}</SignupError>}
                <SignupField label="Password" hint="Use 8+ characters with upper, lower, number, and symbol." error={errors.password && touched.password}><LockKeyhole className="h-4 w-4" /><input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors(validateField('password', e.target.value)); }} onBlur={handleBlur} placeholder="Create a secure password" className="auth-input pr-10" /><button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[calc(50%+10px)] -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></SignupField>
                {errors.password && touched.password && <SignupError>{errors.password}</SignupError>}
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-3 text-xs leading-5 text-slate-600"><span className="font-semibold text-blue-700">Your account:</span> You’ll start with owner access and can invite your team after setup.</div>
                <button type="submit" disabled={loading || Object.keys(errors).length > 0} className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-blue-400">{loading ? 'Creating account...' : 'Create account'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <button type="button" onClick={() => navigate('/login')} className="font-semibold text-blue-700 hover:text-blue-800">Log in</button></p>
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-blue-50 pt-5 text-xs font-medium text-slate-400"><CheckCircle2 className="h-4 w-4 text-blue-500" />No credit card required to get started</div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SignupField = ({ label, hint, error, children }) => (
  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>{hint && <span className="-mt-0.5 mb-1.5 block text-xs leading-4 text-slate-400">{hint}</span>}<span className={`relative flex items-center rounded-xl border bg-[#f9fcff] text-slate-400 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/70 ${error ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100' : 'border-blue-100'}`}><span className="ml-3">{children[0]}</span>{children.slice(1)}</span></label>
);

const SignupError = ({ children }) => <div className="-mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"><AlertCircle className="h-4 w-4" />{children}</div>;

export default Signup;
