import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import { getProjectTasks } from "../../api/issueApi";
import { useAuth } from "../../context/AuthContext";

const MyTasks = () => {
  const { user } = useAuth();
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
    if (user?.id) {
      loadTasks();
    }
  }, [loadTasks, user?.id]);

  const assignedTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          String(task.assignedToUserId) === String(user?.id)
      ),
    [tasks, user?.id]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2
            className="h-5 w-5 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-slate-700">
            Loading tasks...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <KanbanBoard
        mode="developer"
        projectId={projectId}
        issues={assignedTasks}
        onRefresh={loadTasks}
        title="My Tasks"
        subtitle="Track your assigned issues from start to verification"
      />
    </div>
  );
};

export default MyTasks;
