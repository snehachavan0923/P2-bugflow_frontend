import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

import axios from "../../api/axios";
import { getIssues } from "../../api/issueApi";
import { getTeamMembers } from "../../api/teamApi";
import ProjectKanban from "./workspace/ProjectKanban";
import ProjectOverview from "./workspace/ProjectOverview";
import ProjectReports from "./workspace/ProjectReports";
import ProjectTeam from "./workspace/ProjectTeam";
import {
  ProjectWorkspaceProvider,
} from "./workspace/WorkspaceContext";
import WorkspaceFrame from "./workspace/WorkspaceFrame";
import {
  WorkspaceError,
  WorkspaceLoader,
} from "./workspace/DeveloperKanban";

const ownerTabs = [
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

const OwnerWorkspace = () => {
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
      role: "Owner",
      project,
      projectId,
      members,
      issues,
      issueStats,
      showMemberCount: true,
      showIssueStats: true,
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
  const workspacePath = (tab) =>
    `/projects/${projectId}/${tab}`;

  if (loading) {
    return <WorkspaceLoader label="Loading project workspace..." />;
  }

  if (error) {
    return <WorkspaceError message={error} />;
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <ProjectWorkspaceProvider value={contextValue}>
      <Routes>
        <Route
          element={
            <WorkspaceFrame
              project={project}
              tabs={ownerTabs}
            />
          }
        >
          <Route
            index
            element={<Navigate to={workspacePath("overview")} replace />}
          />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="kanban" element={<ProjectKanban />} />
          <Route path="team" element={<ProjectTeam />} />
          <Route path="reports" element={<ProjectReports />} />
          <Route
            path="*"
            element={<Navigate to={workspacePath("overview")} replace />}
          />
        </Route>
      </Routes>
    </ProjectWorkspaceProvider>
  );
};

export default OwnerWorkspace;
