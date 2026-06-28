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
  "#ef4444",
  "#f59e0b",
  "#6366f1",
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

    <div className="space-y-8">

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-br
          from-slate-950
          via-blue-900
          to-cyan-700
          px-6
          py-8
          text-white
          shadow-2xl
          shadow-blue-950/20
          sm:px-8
          lg:px-10
          lg:py-10
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-50 backdrop-blur">
              <Sparkles size={16} />
              Owner Command Center
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {stats?.organizationName || "Organization Dashboard"}
            </h1>

            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-blue-50/90 sm:text-lg">
              Organization Analytics & Team Productivity Overview
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm font-medium text-blue-50/75">
                Active Scope
              </p>
              <p className="mt-1 text-2xl font-bold">
                {stats?.totalProjects || 0}
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm font-medium text-blue-50/75">
                Work Items
              </p>
              <p className="mt-1 text-2xl font-bold">
                {stats?.totalIssues || 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="
          grid
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {statCards.map((card) => {
          const Icon =
            card.icon;

          return (
            <div
              key={card.title}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-slate-100
                bg-white
                p-6
                shadow-lg
                shadow-slate-200/70
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                hover:shadow-slate-300/70
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    ${card.iconClass}
                    transition
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon size={28} />
                </div>

                <div
                  className={`
                    h-12
                    w-12
                    rounded-full
                    bg-gradient-to-br
                    ${card.gradient}
                    opacity-15
                    blur-xl
                    transition
                    duration-300
                    group-hover:opacity-30
                  `}
                />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {card.title}
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-950">
                {card.value || 0}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div
          className="
            rounded-3xl
            border
            border-slate-100
            bg-white
            p-6
            shadow-xl
            shadow-slate-200/70
            xl:col-span-2
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <BarChart3 size={26} />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-950">
              Issue Status Analytics
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Compare issue distribution across workflow stages.
            </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-right">
              <p className="text-sm font-semibold text-slate-500">
                Tracked Issues
              </p>
              <p className="text-3xl font-bold text-slate-950">
                {totalTrackedIssues}
              </p>
            </div>
          </div>

          <div className="mt-8 h-80">
            {totalTrackedIssues > 0 ? (
              <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={issueStatusData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#475569",
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#475569",
                  }}
                  allowDecimals={false}
                />

                <Tooltip
                  cursor={{
                    fill: "#f8fafc",
                  }}
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 18px 45px rgba(15,23,42,.12)",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                >
                  {issueStatusData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-center">
                <div>
                  <CheckCircle2
                    className="mx-auto text-slate-400"
                    size={42}
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No issue activity to chart yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside
          className="
            rounded-3xl
            border
            border-slate-100
            bg-slate-950
            p-6
            text-white
            shadow-xl
            shadow-slate-300/70
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-300">
                Start the next workflow in one click.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
              <ArrowRight size={24} />
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {quickActions.map((action) => {
              const Icon =
                action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    rounded-3xl
                    bg-gradient-to-r
                    ${action.gradient}
                    px-5
                    py-4
                    text-left
                    shadow-lg
                    shadow-black/20
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-200
                    focus:ring-offset-2
                    focus:ring-offset-slate-950
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                      <Icon size={23} />
                    </span>
                    <span className="text-base font-bold">
                      {action.title}
                    </span>
                  </span>

                  <ArrowRight
                    className="transition duration-300 group-hover:translate-x-1"
                    size={22}
                  />
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
