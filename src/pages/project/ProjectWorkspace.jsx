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
        <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="flex min-h-[56px] flex-col gap-2 px-4 py-2 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-normal text-slate-950">
                {project.name}
              </h1>
              <p className="mt-0.5 max-w-3xl truncate text-xs text-slate-600">
                {project.description ||
                  "No project description provided."}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
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

          <nav className="flex h-9 overflow-x-auto border-t border-slate-100 px-4 sm:px-5">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
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

        <div className="py-3">
          <Outlet />
        </div>
      </div>
    </ProjectWorkspaceContext.Provider>
  );
};

const WorkspaceMetric = ({ label, value }) => (
  <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 shadow-sm">
    <span className="text-xs font-medium text-slate-500">
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-950">
      {value}
    </span>
  </div>
);

export default ProjectWorkspace;
