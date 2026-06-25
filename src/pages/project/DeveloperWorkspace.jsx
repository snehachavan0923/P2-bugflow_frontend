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
import DeveloperKanban from "./workspace/DeveloperKanban";
import ProjectOverview from "./workspace/ProjectOverview";
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

const DeveloperWorkspace = () => {
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
      role: "Developer",
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
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="kanban" element={<DeveloperKanban />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
      </Routes>
    </ProjectWorkspaceProvider>
  );
};

export default DeveloperWorkspace;
