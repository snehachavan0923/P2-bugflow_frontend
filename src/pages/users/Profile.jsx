import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { validation } from '../../utils/validation';
import {
  alertApiError,
  alertSuccess,
  alertValidationError,
} from '../../utils/alerts';
import { changeCurrentUserPassword } from '../../api/authApi';

const Profile = () => {
  const { user } = useAuth();
  const { organization, loadOrganization } = useOrganization();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const roleName = user?.role || 'User';
  const organizationName = organization?.name || organization?.id || 'Organization not set';

  const initials = useMemo(() => {
    if (!user?.name && !user?.email) return 'U';
    const value = (user?.name || user?.email || 'User').trim();
    const parts = value.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
  }, [user]);

  useEffect(() => {
    if (user && !user.organizationName && !organization) {
      loadOrganization().catch(() => undefined);
    }
  }, [user, organization, loadOrganization]);

  const validatePasswordForm = (values = form) => {
    const nextErrors = {};

    if (!values.currentPassword || !values.currentPassword.trim()) {
      nextErrors.currentPassword = 'Current password is required';
    }

    if (!values.newPassword) {
      nextErrors.newPassword = 'New password is required';
    } else {
      const strength = validation.getPasswordStrength(values.newPassword);
      if (strength.score < 3) {
        nextErrors.newPassword = strength.message;
      }
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password';
    } else if (!validation.passwordsMatch(values.newPassword, values.confirmPassword)) {
      nextErrors.confirmPassword = 'Passwords must match';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };

    setForm(nextForm);

    if (touched[name]) {
      setErrors(validatePasswordForm(nextForm));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    setErrors(validatePasswordForm(form));
  };

  const resetForm = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTouched({});
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextTouched = {
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    };

    setTouched(nextTouched);
    const nextErrors = validatePasswordForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstError = Object.values(nextErrors)[0];
      alertValidationError('Password', firstError || 'Please fix validation errors.');
      return;
    }

    setSubmitting(true);

    try {
      await changeCurrentUserPassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alertSuccess('Password Updated', 'Your password has been updated successfully.');
      resetForm();
    } catch (error) {
      alertApiError(error, 'Unable to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Profile</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {user?.name || 'User Profile'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage your personal account information and security.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
            <Shield className="h-3.5 w-3.5" />
            {roleName}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-bold text-white shadow-md shadow-blue-600/20">
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-950">{user?.name || 'User'}</h2>
              <p className="truncate text-sm text-slate-600">{user?.email || 'No email provided'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Role</p>
                  <p className="text-sm font-semibold text-slate-900">{roleName}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {roleName}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Email</p>
                <p className="text-sm font-semibold text-slate-900">{user?.email || 'No email available'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Organization</p>
                <p className="text-sm font-semibold text-slate-900">{organizationName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-700">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Change Password</h2>
              <p className="text-sm text-slate-600">Keep your account secure by regularly updating your password.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 ${errors.currentPassword && touched.currentPassword ? 'border-red-300 bg-red-50/40 focus:ring-red-100' : 'border-slate-200'}`}
                  placeholder="Enter your current password"
                  aria-invalid={Boolean(errors.currentPassword && touched.currentPassword)}
                  aria-describedby={errors.currentPassword && touched.currentPassword ? 'currentPasswordError' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && touched.currentPassword && (
                <div id="currentPasswordError" className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.currentPassword}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 ${errors.newPassword && touched.newPassword ? 'border-red-300 bg-red-50/40 focus:ring-red-100' : 'border-slate-200'}`}
                  placeholder="Create a strong password"
                  aria-invalid={Boolean(errors.newPassword && touched.newPassword)}
                  aria-describedby={errors.newPassword && touched.newPassword ? 'newPasswordError' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Must be at least 8 characters, include uppercase, lowercase, a number, and a special character.
              </p>
              {errors.newPassword && touched.newPassword && (
                <div id="newPasswordError" className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.newPassword}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 bg-red-50/40 focus:ring-red-100' : 'border-slate-200'}`}
                  placeholder="Confirm your new password"
                  aria-invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                  aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirmPasswordError' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div id="confirmPasswordError" className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {submitting ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;