import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../../components/kanban/KanbanBoard";
import { getIssues } from "../../../api/issueApi";
import {
  WorkspaceError,
  WorkspaceLoader,
} from "./DeveloperKanban";

const ViewerKanban = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssues = useCallback(async () => {
    try {
      setError("");

      const data = await getIssues(projectId);
      setIssues(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load project board."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  if (loading) {
    return <WorkspaceLoader label="Loading board..." />;
  }

  if (error) {
    return <WorkspaceError message={error} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 p-1.5">
      <div className="flex-1 h-full min-h-0 overflow-hidden">
        <KanbanBoard
          mode="viewer"
          projectId={projectId}
          issues={issues}
          onRefresh={loadIssues}
        />
      </div>
    </div>
  );
};

export default ViewerKanban;
