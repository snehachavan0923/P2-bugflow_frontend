import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  Layers3,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

import {
  getOwnerDashboard,
} from "../../api/dashboardApi";

const COLORS = [
  "#2F52D5",
  "#f59e0b",
  "#2F52D5",
  "#22c55e",
];

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    organizationName: "",
    totalProjects: 0,
    totalMembers: 0,
    totalIssues: 0,
    assignedTasks: 0,
    openIssues: 0,
    inProgressIssues: 0,
    reviewIssues: 0,
    resolvedIssues: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getOwnerDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const issueStatusData = useMemo(() => [
    {
      name: "Open",
      value: stats.openIssues,
    },
    {
      name: "In Progress",
      value: stats.inProgressIssues,
    },
    {
      name: "Review",
      value: stats.reviewIssues,
    },
    {
      name: "Done",
      value: stats.resolvedIssues,
    },
  ], [stats]);

  const totalTrackedIssues = issueStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      iconClass: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      iconClass: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Issues",
      value: stats.totalIssues,
      icon: Bug,
      iconClass: "bg-rose-100 text-rose-700",
    },
    {
      title: "Assigned Tasks",
      value: stats.assignedTasks,
      icon: ClipboardList,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
  ];

  const quickActions = [
    {
      title: "Create Project",
      path: "/projects",
      icon: PlusCircle,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Create Team",
      path: "/projects",
      icon: Users,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Create Issue",
      path: "/projects",
      icon: Bug,
      gradient: "from-rose-600 to-orange-500",
    },
    {
      title: "View Task Overview",
      path: "/task-overview",
      icon: Layers3,
      gradient: "from-slate-800 to-slate-600",
    },
  ];

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
        {/* Executive Hero Header */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Owner Command Center
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {stats?.organizationName || "Organization Dashboard"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A high-level view of organization performance, delivery status, team capacity, and workflow momentum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Projects</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{stats?.totalProjects || 0}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Issues</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{stats?.totalIssues || 0}</p>
              </div>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl p-2.5 ${card.iconClass}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.title}</p>
                      <p className="text-2xl font-semibold text-slate-950">{card.value || 0}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics & Quick Actions Grid */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Issue Status Analytics Section */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8 xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Issue Status Analytics
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Workflow breakdown across Open, In Progress, Review, and Done stages
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tracked Issues</p>
                <p className="text-2xl font-semibold text-slate-950">{totalTrackedIssues}</p>
              </div>
            </div>

            <div className="h-80 rounded-[24px] border border-slate-200 bg-slate-50/50 p-4">
              {totalTrackedIssues > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={issueStatusData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(47,82,213,0.06)" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 18px 45px rgba(15,23,42,.12)",
                        backgroundColor: "rgba(255,255,255,0.96)",
                      }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={54}>
                      {issueStatusData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-white p-6 text-center">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-950">No issue activity recorded</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Create new projects and issues to start populating status analytics.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Quick Actions</h2>
                  <p className="text-xs font-medium text-slate-500">Shortcuts to main workflows</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="group flex w-full items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition-all duration-200 hover:border-blue-300 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-950">{action.title}</span>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

