import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../../components/kanban/KanbanBoard";
import { getTesterBoardIssues } from "../../../api/issueApi";
import {
  WorkspaceError,
  WorkspaceLoader,
} from "./DeveloperKanban";

const TesterKanban = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssues = useCallback(async () => {
    try {
      setError("");

      const data = await getTesterBoardIssues(projectId);
      setIssues(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load issues for verification."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  if (loading) {
    return <WorkspaceLoader label="Loading issues..." />;
  }

  if (error) {
    return <WorkspaceError message={error} />;
  }

  return (
    <div className="bg-slate-50 p-1.5">
      <KanbanBoard
        mode="tester"
        projectId={projectId}
        issues={issues}
        onRefresh={loadIssues}
      />
    </div>
  );
};

export default TesterKanban;
