import { useCallback, useEffect,useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import { getTesterBoardIssues  } from "../../api/issueApi";

const VerifyIssue = () => {
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2
            className="h-5 w-5 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-slate-700">
            Loading issues...
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
        mode="tester"
        projectId={projectId}
        issues={issues}
        onRefresh={loadIssues}
        title="Verify Issues"
        subtitle="Review submitted fixes and approve or reject resolution proof"
      />
    </div>
  );
};

export default VerifyIssue;
