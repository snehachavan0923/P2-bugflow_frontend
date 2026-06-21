import { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  Loader2,
  Users,
} from "lucide-react";

import { getOrganizationSettings } from "../../api/organizationApi";

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
  },
  {
    label: "Owner",
    value: formatValue(ownerName),
  },
  {
    label: "Created Date",
    value: formatDate(createdDate),
  },
];

  const statItems = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2
            className="h-5 w-5 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-slate-700">
            Loading organization settings...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 shadow-sm">
          <h1 className="text-lg font-semibold text-red-900">
            Could not load organization settings
          </h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section>
          <div className="flex items-start gap-4">
            <div className="hidden rounded-2xl bg-slate-900 p-3 text-white shadow-sm sm:block">
              <Building2 className="h-7 w-7" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                Organization Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Manage your organization information and workspace statistics
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-950">
              Organization Information
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {informationItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm font-medium text-slate-950 sm:text-base">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-slate-950">
            Statistics
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {statItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-3xl font-bold text-slate-950">
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {item.label}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl p-3 ${item.iconClassName}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizationSettings;
