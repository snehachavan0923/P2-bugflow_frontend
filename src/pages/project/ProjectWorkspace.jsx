import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useParams,
} from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

import axios from "../../api/axios";
import { getIssues } from "../../api/issueApi";
import { getTeamMembers } from "../../api/teamApi";

const ProjectWorkspaceContext =
  createContext(null);

export const useProjectWorkspace = () =>
  useContext(ProjectWorkspaceContext);

const tabs = [
  {
    label: "Overview",
    to: "overview",
    icon: LayoutDashboard,
  },
  {
    label: "Kanban",
    to: "kanban",
    icon: ClipboardList,
  },
  {
    label: "Team",
    to: "team",
    icon: Users,
  },
  {
    label: "Reports",
    to: "reports",
    icon: BarChart3,
  },
];

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshWorkspace = useCallback(async () => {
    try {
      setError("");

      const [projectRes, membersData, issuesData] =
        await Promise.allSettled([
          axios.get(`/projects/${projectId}`),
          getTeamMembers(projectId),
          getIssues(projectId),
        ]);

      if (projectRes.status === "fulfilled") {
        setProject(projectRes.value.data);
      } else {
        throw projectRes.reason;
      }

      setMembers(
        membersData.status === "fulfilled"
          ? membersData.value
          : []
      );
      setIssues(
        issuesData.status === "fulfilled"
          ? issuesData.value
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load project workspace."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refreshWorkspace();
  }, [refreshWorkspace]);

  const issueStats = useMemo(() => {
    const totals = {
      total: issues.length,
      open: 0,
      inProgress: 0,
      review: 0,
      done: 0,
    };

    issues.forEach((issue) => {
      if (issue.status === "Open") totals.open += 1;
      if (issue.status === "In Progress") {
        totals.inProgress += 1;
      }
      if (issue.status === "Review") totals.review += 1;
      if (issue.status === "Done") totals.done += 1;
    });

    return totals;
  }, [issues]);

  const contextValue = useMemo(
    () => ({
      project,
      projectId,
      members,
      issues,
      issueStats,
      refreshWorkspace,
    }),
    [
      project,
      projectId,
      members,
      issues,
      issueStats,
      refreshWorkspace,
    ]
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] rounded-lg border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading project workspace...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <ProjectWorkspaceContext.Provider value={contextValue}>
      <div className="min-h-full bg-slate-50">
        <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 px-6 pt-6 shadow-sm backdrop-blur">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <NavLink
                  to="/projects"
                  className="font-medium text-slate-600 transition hover:text-blue-700"
                >
                  Projects
                </NavLink>
                <ChevronRight className="h-4 w-4" />
                <span className="truncate font-medium text-slate-800">
                  {project.name}
                </span>
              </div>

              <h1 className="truncate text-3xl font-bold tracking-normal text-slate-950">
                {project.name}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {project.description ||
                  "No project description provided."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
              <WorkspaceMetric
                label="Members"
                value={members.length}
              />
              <WorkspaceMetric
                label="Issues"
                value={issueStats.total}
              />
              <WorkspaceMetric
                label="Done"
                value={issueStats.done}
              />
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="py-6">
          <Outlet />
        </div>
      </div>
    </ProjectWorkspaceContext.Provider>
  );
};

const WorkspaceMetric = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold text-slate-950">
      {value}
    </p>
  </div>
);

export default ProjectWorkspace;
