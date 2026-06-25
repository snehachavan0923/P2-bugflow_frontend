import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import {
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

import axios from "../../api/axios";
import ProjectOverview from "./workspace/ProjectOverview";
import ViewerKanban from "./workspace/ViewerKanban";
import {
  ProjectWorkspaceProvider,
} from "./workspace/WorkspaceContext";
import WorkspaceFrame from "./workspace/WorkspaceFrame";
import {
  WorkspaceError,
  WorkspaceLoader,
} from "./workspace/DeveloperKanban";

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
];

const ViewerWorkspace = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshWorkspace = useCallback(async () => {
    try {
      setError("");

      const res = await axios.get(`/projects/${projectId}`);
      setProject(res.data);
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

  const contextValue = useMemo(
    () => ({
      role: "Viewer",
      project,
      projectId,
      members: [],
      issues: [],
      issueStats: null,
      showMemberCount: false,
      showIssueStats: false,
      refreshWorkspace,
    }),
    [project, projectId, refreshWorkspace]
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
              tabs={tabs}
            />
          }
        >
          <Route
            index
            element={<Navigate to={workspacePath("overview")} replace />}
          />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="kanban" element={<ViewerKanban />} />
          <Route
            path="*"
            element={<Navigate to={workspacePath("overview")} replace />}
          />
        </Route>
      </Routes>
    </ProjectWorkspaceProvider>
  );
};

export default ViewerWorkspace;
