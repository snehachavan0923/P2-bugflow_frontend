import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import { getInvitationInfo, acceptInvitation } from '../../api/teamApi';
import { validation } from '../../utils/validation';
import { alertApiError, alertSuccess, alertValidationError } from '../../utils/alerts';

const InvitationAccept = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [invInfo, setInvInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getInvitationInfo(token);
        setInvInfo(data);
      } catch (err) {
        console.error('Failed to fetch invitation info', err);
        // Map common cases to friendly messages
        if (err?.response?.status === 404) {
          setInvInfo(null);
        }
        alertApiError(err, 'Unable to fetch invitation');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const validateName = (value) => {
    const newErrors = {};
    if (!validation.isRequired(value)) {
      newErrors.name = 'Name is required';
    } else if (!validation.minLength(value, 2)) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!validation.maxLength(value, 50)) {
      newErrors.name = 'Name must not exceed 50 characters';
    }
    return newErrors;
  };

  const validatePassword = (password, confirm) => {
    const newErrors = {};
    const strength = validation.getPasswordStrength(password);

    if (strength.score < 3) {
      newErrors.password = strength.message;
    }

    if (confirm && !validation.passwordsMatch(password, confirm)) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    return newErrors;
  };

  const validateConfirmPassword = (password, confirm) => {
    const newErrors = {};
    if (!validation.passwordsMatch(password, confirm)) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    if (password && validation.getPasswordStrength(password).score < 3) {
      newErrors.password = validation.getPasswordStrength(password).message;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    if (touched[name]) {
      if (name === 'name') setErrors(validateName(next.name));
      if (name === 'password') setErrors(validatePassword(next.password, next.confirmPassword));
      if (name === 'confirmPassword') setErrors(validateConfirmPassword(next.password, next.confirmPassword));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);

    if (name === 'name') setErrors(validateName(formData.name));
    if (name === 'password') setErrors(validatePassword(formData.password, formData.confirmPassword));
    if (name === 'confirmPassword') setErrors(validateConfirmPassword(formData.password, formData.confirmPassword));
  };

  const formatExpiry = (iso) => {
    try {
      const d = new Date(iso);
      const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      const now = new Date();
      const diff = d.getTime() - now.getTime();
      const abs = Math.abs(diff);
      const days = Math.floor(abs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);

      const relative = diff > 0 ? `Expires in ${days > 0 ? days + ' day' + (days>1?'s':'') : hours + ' hour' + (hours>1?'s':'')}` : 'Expired';

      return { dateTime: `${date} at ${time}`, relative, expired: diff <= 0 };
    } catch (e) {
      return { dateTime: iso, relative: '', expired: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextTouched = { name: true, password: true, confirmPassword: true };
    setTouched(nextTouched);

    const nextErrors = {
      ...validateName(formData.name),
      ...validatePassword(formData.password, formData.confirmPassword),
      ...validateConfirmPassword(formData.password, formData.confirmPassword),
    };
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      alertValidationError('Invitation', nextErrors.password || nextErrors.confirmPassword || nextErrors.name || 'Please fix validation errors');
      return;
    }

    if (!invInfo || invInfo.status !== 'PENDING') {
      alertApiError({ response: { status: 422, data: { message: 'Invitation is not valid for acceptance' } } }, 'Unable to accept invitation');
      return;
    }

    setSubmitting(true);
    try {
      await acceptInvitation({ token, name: formData.name.trim(), password: formData.password });
      await alertSuccess('Invitation Accepted', 'You can now login with your credentials');
      navigate('/login');
    } catch (err) {
      console.error('Accept failed', err);
      alertApiError(err, 'Unable to accept invitation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
          <div className="text-lg font-semibold text-slate-900">Loading invitation...</div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5faff] text-slate-900">
        <PublicNavbar />
        <main className="public-auth-shell flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="rounded-[20px] border border-white/80 bg-white/85 p-6 sm:p-8 shadow-md text-center">
              <div className="rounded-full bg-red-50 p-3 text-red-600 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-semibold">Invalid invitation link</h2>
              <p className="text-sm text-gray-600 mt-2">The invitation link is missing or invalid. Please check the link or ask the project owner to resend the invitation.</p>
              <div className="mt-4">
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Go to Home</button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!invInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5faff] text-slate-900">
        <PublicNavbar />
        <main className="public-auth-shell flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="rounded-[20px] border border-white/80 bg-white/85 p-6 sm:p-8 shadow-md text-center">
              <div className="rounded-full bg-red-50 p-3 text-red-600 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-semibold">Invitation not found</h2>
              <p className="text-sm text-gray-600 mt-2">This invitation may have been removed or the link may be invalid.</p>
              <div className="mt-4">
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Go to Home</button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const expiry = invInfo.expiresAt ? formatExpiry(invInfo.expiresAt) : null;
  const isExpired = expiry?.expired || invInfo.status === 'EXPIRED';

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
            <h1 className="max-w-lg text-3xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-4xl">You're Invited to BugFlow</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">Join <strong className="text-slate-900">{invInfo.organizationName}</strong> on BugFlow to collaborate on <strong className="text-slate-900">{invInfo.projectName}</strong>.</p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-[20px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_-24px_rgba(30,64,175,0.12)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><Check size={20} /></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Invitation</div>
                    <div className="text-xs text-slate-500">From {invInfo.organizationName}</div>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-9 text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7M3 7a2 2 0 012-2h1l1-2h8l1 2h1a2 2 0 012 2"/></svg></div>
                    <div>
                      <div className="text-xs text-gray-500">Project</div>
                      <div className="font-medium text-slate-900">{invInfo.projectName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2l6 2 5.447 1.724A2 2 0 0121 6.618v8.764a2 2 0 01-1.553 1.894L15 20l-6-2z"/></svg></div>
                    <div>
                      <div className="text-xs text-gray-500">Role</div>
                      <div className="font-medium text-slate-900">{invInfo.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 text-blue-600"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0v1H6a2 2 0 00-2 2v3h16v-3a2 2 0 00-2-2h-2v-1z"/></svg></div>
                    <div>
                      <div className="text-xs text-gray-500">Invited Email</div>
                      <div className="font-medium text-slate-900">{invInfo.email}</div>
                    </div>
                  </div>

                  {expiry && (
                    <div className="flex items-center gap-3">
                      <div className={`w-9 ${expiry.expired ? 'text-red-600' : 'text-gray-400'}`}>
                        {expiry.expired ? <X size={18} /> : <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"/></svg>}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Invitation expires</div>
                        <div className={`font-medium ${expiry.expired ? 'text-red-600' : 'text-slate-900'}`}>{expiry.dateTime} {expiry.relative ? <span className="text-sm text-gray-500">({expiry.relative})</span> : null}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center animate-[auth-enter_650ms_100ms_ease-out_both] lg:order-2 lg:justify-self-end">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_-34px_rgba(30,64,175,0.18)] backdrop-blur-xl sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><Check size={20} /></div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Accept your invitation</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Complete account setup to join the project.</p>
              {isExpired ? (
                <div className="mt-6 text-center">
                  <div className="rounded-full bg-red-50 p-3 text-red-600 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">Invitation Expired</h3>
                  <p className="text-sm text-gray-600 mt-2">This invitation is no longer valid. Please ask the project owner to send a new invitation.</p>
                  <div className="mt-4 flex justify-center">
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Back to Home</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <AuthField label="Name" error={errors.name && touched.name}>
                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your full name" className="auth-input" />
                  </AuthField>
                  {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}

                  <AuthField label="Password" error={errors.password && touched.password}>
                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M12 15v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="Create a password" className="auth-input pr-10" />
                    <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </AuthField>
                  {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}

                  <div className="mt-1 text-sm text-gray-600">
                    <div className="font-medium mb-2">Password requirements</div>
                    <ul className="grid grid-cols-1 gap-1 text-sm">
                      <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-emerald-600' : 'text-gray-500'}`}><Check className="h-4 w-4" /> 8+ characters</li>
                      <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'}`}><Check className="h-4 w-4" /> Uppercase letter</li>
                      <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'}`}><Check className="h-4 w-4" /> Lowercase letter</li>
                      <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'}`}><Check className="h-4 w-4" /> Number</li>
                      <li className={`flex items-center gap-2 ${/[@$!%*?&]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'}`}><Check className="h-4 w-4" /> Special character</li>
                    </ul>
                  </div>

                  <AuthField label="Confirm password" error={errors.confirmPassword && touched.confirmPassword}>
                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M16 11v2a4 4 0 01-8 0v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="Confirm password" className="auth-input pr-10" />
                    <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-blue-700" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </AuthField>
                  {errors.confirmPassword && touched.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}

                  <div className="flex items-center justify-between pt-1">
                    <button type="button" onClick={() => navigate('/')} className="px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={submitting} className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? 'Accepting...' : 'Accept Invitation'}</button>
                  </div>
                </form>
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

  const ErrorMessage = ({ children }) => <div className="-mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"><AlertCircle className="h-4 w-4" />{children}</div>;

  export default InvitationAccept;
