import {
  FolderKanban,
  Users,
  Bug,
  ClipboardList,
  Eye,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getViewerDashboard,
} from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const ViewerDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalIssues: 0,
    assignedTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getViewerDashboard();
        setStats(data);
      } catch {
        // Axios interceptor handles error logic
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading dashboard data..." />
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
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <Eye className="h-4 w-4" />
                Monitoring & Visibility
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Viewer Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor organization projects, track issue resolution progress, and observe team delivery metrics.
              </p>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={<FolderKanban className="h-5 w-5" />}
              color="bg-blue-100 text-blue-700"
            />
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={<Users className="h-5 w-5" />}
              color="bg-blue-100 text-blue-700"
            />
            <StatCard
              title="Total Issues"
              value={stats.totalIssues}
              icon={<Bug className="h-5 w-5" />}
              color="bg-rose-100 text-rose-700"
            />
            <StatCard
              title="Assigned Tasks"
              value={stats.assignedTasks}
              icon={<ClipboardList className="h-5 w-5" />}
              color="bg-emerald-100 text-emerald-700"
            />
          </div>
        </div>

        {/* Read-Only Workspace Guidance Card */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Read-Only Workspace Access</h2>
              <p className="text-xs font-medium text-slate-500">Transparent monitoring across organization projects</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm leading-6 text-slate-700">
              You have read-only access to your organization's projects, issues, and workflows. Monitor progress across Open, In Progress, Review, and Done stages without modifying data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;