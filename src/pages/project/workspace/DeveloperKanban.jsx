import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../../components/kanban/KanbanBoard";
import { getProjectTasks } from "../../../api/issueApi";

const DeveloperKanban = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");

      const data = await getProjectTasks(projectId);
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load your tasks."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (loading) {
    return <WorkspaceLoader label="Loading tasks..." />;
  }

  if (error) {
    return <WorkspaceError message={error} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 p-1.5">
      <div className="flex-1 h-full min-h-0 overflow-hidden">
        <KanbanBoard
          mode="developer"
          projectId={projectId}
          issues={tasks}
          onRefresh={loadTasks}
        />
      </div>
    </div>
  );
};

export const WorkspaceLoader = ({ label }) => (
  <div className="flex min-h-[50vh] items-center justify-center p-6">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Loader2
        className="h-5 w-5 animate-spin text-blue-600"
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>
    </div>
  </div>
);

export const WorkspaceError = ({ message }) => (
  <div className="p-3">
    <div className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700 shadow-sm">
      {message}
    </div>
  </div>
);

export default DeveloperKanban;
