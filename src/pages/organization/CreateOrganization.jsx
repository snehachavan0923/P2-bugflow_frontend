import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  LayoutDashboard,
  Plus,
  Users,
  AlertCircle,
} from 'lucide-react';
import { createOrganization } from '../../api/organizationApi';
import { useOrganization } from '../../context/OrganizationContext';
import { validation } from '../../utils/validation';
import { alertSuccess, alertApiError } from '../../utils/alerts';

const CreateOrganization = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshOrganization } = useOrganization();

  // Validate organization name
  const validateOrgName = (value) => {
    const newErrors = { ...errors };
    
    if (!validation.isRequired(value)) {
      newErrors.organizationName = 'Organization name is required';
    } else if (!validation.minLength(value, 2)) {
      newErrors.organizationName = 'Organization name must be at least 2 characters';
    } else if (!validation.maxLength(value, 100)) {
      newErrors.organizationName = 'Organization name must not exceed 100 characters';
    } else {
      delete newErrors.organizationName;
    }
    
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validateOrgName(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark as touched
    setTouched({ organizationName: true });
    
    // Validate
    const newErrors = validateOrgName(organizationName);
    setErrors(newErrors);
    
    // Prevent submit if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await createOrganization({ name: organizationName.trim() });
      await refreshOrganization();
      await alertSuccess('Organization Created', 'Your organization has been created successfully!');
      navigate('/dashboard');
    } catch (err) {
      alertApiError(err, 'Unable to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
          <div className="grid min-h-[640px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur transition hover:bg-white/15">
                  <Building2 size={14} />
                  Workspace setup
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500 shadow-lg shadow-blue-950/30">
                        <LayoutDashboard size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Workspace Preview
                        </p>
                        <p className="mt-0.5 text-xs text-slate-300">
                          Projects, teams, and issues in one place
                        </p>
                      </div>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
                      <Plus size={16} />
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-4 text-slate-900 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {organizationName.trim() || 'Your Organization'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Empty workspace
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Ready
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Building2 className="text-slate-700" size={28} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        Nothing here yet
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Create your workspace to unlock projects, boards, and team collaboration.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-md bg-blue-50 p-3">
                        <LayoutDashboard className="text-blue-600" size={18} />
                        <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-200" />
                      </div>
                      <div className="rounded-md bg-teal-50 p-3">
                        <Users className="text-teal-600" size={18} />
                        <div className="mt-3 h-1.5 w-12 rounded-full bg-teal-200" />
                      </div>
                      <div className="rounded-md bg-amber-50 p-3">
                        <CheckCircle2 className="text-amber-600" size={18} />
                        <div className="mt-3 h-1.5 w-12 rounded-full bg-amber-200" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <div className="h-2.5 w-16 rounded-full bg-white/70" />
                      <div className="mt-4 h-10 rounded-md bg-white/15" />
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <div className="h-2.5 w-20 rounded-full bg-white/70" />
                      <div className="mt-4 flex -space-x-2">
                        <div className="h-9 w-9 rounded-full bg-blue-400 ring-2 ring-slate-950" />
                        <div className="h-9 w-9 rounded-full bg-teal-400 ring-2 ring-slate-950" />
                        <div className="h-9 w-9 rounded-full bg-amber-400 ring-2 ring-slate-950" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 -top-8 rounded-lg border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Onboarding
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        Step 1 of 1
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <h2 className="text-2xl font-semibold">
                  One workspace for every project.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                  Bring teams, tasks, and delivery workflows together with a clean operating hub.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
              <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center lg:hidden">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-950 shadow-xl shadow-slate-300 transition duration-300 hover:-translate-y-1">
                    <Building2 className="text-white" size={34} />
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <div className="mb-5 hidden h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-lg shadow-slate-200 lg:flex">
                    <Building2 size={24} />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                    Create Your Organization
                  </h1>
                  <p className="mt-3 text-base leading-7 text-slate-500">
                    Start managing projects and teams under a single workspace.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                  <div>
                    <label
                      htmlFor="organizationName"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Organization Name
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      value={organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        if (touched.organizationName) {
                          setErrors(validateOrgName(e.target.value));
                        }
                      }}
                      onBlur={handleBlur}
                      placeholder="Acme Inc."
                      className={`mt-2 w-full rounded-lg border bg-white px-4 py-3.5 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.organizationName && touched.organizationName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      aria-invalid={Boolean(errors.organizationName && touched.organizationName)}
                      aria-describedby={errors.organizationName && touched.organizationName ? 'organizationNameError' : undefined}
                    />
                    {errors.organizationName && touched.organizationName && (
                      <div
                        id="organizationNameError"
                        className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"
                      >
                        <AlertCircle size={16} />
                        {errors.organizationName}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || Object.keys(errors).length > 0}
                    className="w-full rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                  >
                    {loading ? 'Creating...' : 'Create Organization'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
