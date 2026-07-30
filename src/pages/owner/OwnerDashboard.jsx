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
  "#4F46E5",
  "#f59e0b",
  "#8b5cf6",
  "#22c55e",
];


const OwnerDashboard = () => {

  const navigate =
    useNavigate();

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

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadDashboard =
      async () => {

      try {

        const data =
          await getOwnerDashboard();

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

  const totalTrackedIssues =
    issueStatusData.reduce(
      (sum, item) => sum + item.value,
      0
    );

  const statCards =
    [
        {
          title: "Total Projects",
          value: stats.totalProjects,
          icon: FolderKanban,
          gradient: "from-sky-500 to-blue-600",
          iconClass: "bg-sky-100 text-sky-600",
        },
        {
          title: "Total Members",
          value: stats.totalMembers,
          icon: Users,
          gradient: "from-violet-500 to-fuchsia-600",
          iconClass: "bg-violet-100 text-violet-600",
        },
        {
          title: "Total Issues",
          value: stats.totalIssues,
          icon: Bug,
          gradient: "from-rose-500 to-orange-500",
          iconClass: "bg-rose-100 text-rose-600",
        },
        {
          title: "Assigned Tasks",
          value: stats.assignedTasks,
          icon: ClipboardList,
          gradient: "from-emerald-500 to-teal-600", 
          iconClass: "bg-emerald-100 text-emerald-600",
        },
      ]
      ;

  const quickActions = [
    {
      title: "Create Project",
      path: "/projects",
      icon: PlusCircle,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Create Team",
      path: "/projects",
      icon: Users,
      gradient: "from-violet-600 to-indigo-500",
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
      <LoaderWithMessage message="Loading dashboard data..." />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-4 lg:space-y-8">
      <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-7 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.2)] sm:px-8 sm:py-9 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(79,70,229,0.14),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.13),transparent_30%)]" />
        <div className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border border-indigo-100/80 bg-indigo-50/70" />
        <div className="absolute right-16 top-8 -z-10 h-16 w-16 rounded-3xl border border-indigo-100/70 bg-white/70 rotate-12" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">
              <Sparkles size={16} />
              Owner Command Center
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
              {stats?.organizationName || "Organization Dashboard"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base sm:leading-7">
              A clear view of your organization’s delivery, team capacity, and workflow momentum.
            </p>
          </div>

          <div className="grid min-w-[260px] grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.28)] backdrop-blur">
              <p className="text-xs font-medium text-slate-500">Active projects</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {stats?.totalProjects || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.28)] backdrop-blur">
              <p className="text-xs font-medium text-slate-500">Total issues</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {stats?.totalIssues || 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_38px_-24px_rgba(15,23,42,0.24)] transition duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_22px_50px_-24px_rgba(79,70,229,0.25)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconClass} transition duration-300 group-hover:scale-110`}>
                  <Icon size={28} />
                </div>

                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${card.gradient} opacity-15 blur-xl transition duration-300 group-hover:opacity-30`} />
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {card.title}
              </p>

              <p className="mt-2 text-4xl font-semibold text-slate-950">
                {card.value || 0}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.2)] sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <BarChart3 size={26} />
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Issue Status Analytics
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Compare issue distribution across workflow stages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tracked issues</p>
              <p className="text-3xl font-semibold text-slate-950">{totalTrackedIssues}</p>
            </div>
          </div>

          <div className="mt-7 h-80 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-3 sm:p-4">
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

                  <XAxis dataKey="name" tick={{ fill: "#475569" }} axisLine={false} tickLine={false} />

                  <YAxis tick={{ fill: "#475569" }} allowDecimals={false} axisLine={false} tickLine={false} />

                  <Tooltip
                    cursor={{ fill: "rgba(79,70,229,0.06)" }}
                    contentStyle={{
                      borderRadius: "18px",
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
              <div className="flex h-full items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/70 text-center">
                <div className="max-w-xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-600">No issue activity to chart yet.</p>
                  <p className="mt-1 text-sm text-slate-500">New work items will appear here as your team starts shipping.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-600">Workspace</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Quick actions</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Start the next workflow in one click.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ArrowRight size={24} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:shadow-[0_12px_28px_-18px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{action.title}</span>
                  </span>

                  <ChevronRight className="text-slate-400 transition duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-600" size={20} />
                </button>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default OwnerDashboard;
