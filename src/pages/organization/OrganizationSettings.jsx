import { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  Users,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Calendar,
  UserCheck,
} from "lucide-react";

import { getOrganizationSettings } from "../../api/organizationApi";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return value;
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const OrganizationSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setError("");

        const data = await getOrganizationSettings();

        setSettings(data);
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load organization settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const organizationName =
    settings?.organizationName ||
    settings?.name ||
    settings?.orgName;

  const ownerName =
    settings?.ownerName ||
    settings?.owner?.name;

  const createdDate =
    settings?.createdDate ||
    settings?.createdAt ||
    settings?.created_at;

  const totalProjects =
    settings?.totalProjects ??
    settings?.projectCount ??
    settings?.projectsCount ??
    0;

  const totalMembers =
    settings?.totalMembers ??
    settings?.memberCount ??
    settings?.membersCount ??
    0;

  const informationItems = [
    {
      label: "Organization Name",
      value: formatValue(organizationName),
      icon: Building2,
    },
    {
      label: "Owner",
      value: formatValue(ownerName),
      icon: UserCheck,
    },
    {
      label: "Created Date",
      value: formatDate(createdDate),
      icon: Calendar,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading organization settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-rose-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(244,63,94,0.15)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-950">
                  Could not load organization settings
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Header Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Workspace configuration
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Organization Settings
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage your organization information, workspace details, and aggregate metrics with an enterprise view.
              </p>
            </div>
          </div>

          {/* Overview Dashboard Metric Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-2.5 text-indigo-700">
                  <FolderKanban className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Projects</p>
                  <p className="text-2xl font-semibold text-slate-950">{totalProjects}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Members</p>
                  <p className="text-2xl font-semibold text-slate-950">{totalMembers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Information Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-100/80 bg-indigo-50 p-2.5 text-indigo-700">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Organization Information
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Core profile and identity parameters
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {informationItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2.5 break-words text-base font-semibold text-slate-950">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics Summary Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50 p-2.5 text-emerald-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Workspace Health & Scale
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Real-time usage and member allocation metrics
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Projects Managed</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950">
                    {totalProjects}
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-100/80 p-3 text-indigo-700">
                  <FolderKanban className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Collaborators</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950">
                    {totalMembers}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-100/80 p-3 text-emerald-700">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;

