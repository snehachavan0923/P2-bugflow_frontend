import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardList,
  PlayCircle,
  FolderKanban,
  Code2,
  Sparkles,
} from "lucide-react";

import {
  getDeveloperDashboard,
} from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const DeveloperDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    assignedTasks: 0,
    inProgress: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getDeveloperDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Code2 className="h-4 w-4" />
                Developer Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Developer Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Track your assigned tasks, monitor active development progress, and keep work items moving efficiently.
              </p>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={<FolderKanban className="h-5 w-5" />}
              color="bg-indigo-100 text-indigo-700"
            />
            <StatCard
              title="Assigned Tasks"
              value={stats.assignedTasks}
              icon={<ClipboardList className="h-5 w-5" />}
              color="bg-blue-100 text-blue-700"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={<PlayCircle className="h-5 w-5" />}
              color="bg-amber-100 text-amber-700"
            />
          </div>
        </div>

        {/* Development Focus & Workflow Card */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-100/80 bg-indigo-50 p-2.5 text-indigo-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Development Focus & Pipeline</h2>
              <p className="text-xs font-medium text-slate-500">Keep active assignments in motion and sync status updates</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-950">Assigned Tasks Overview</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                You have <strong className="text-indigo-600">{stats.assignedTasks}</strong> active assigned issues requiring development attention. Check your project sidebar to inspect assigned issue queues.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-950">Active Work Items</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                <strong className="text-amber-600">{stats.inProgress}</strong> issues are currently marked as In Progress. Ensure resolutions are submitted for tester review upon code completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;