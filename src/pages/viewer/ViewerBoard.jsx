import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import { getIssues } from "../../api/issueApi";

const ViewerBoard = () => {

  const { projectId } =
    useParams();

  const [issues, setIssues] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadIssues =
    useCallback(async () => {

      try {

        const data =
          await getIssues(projectId);

        setIssues(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }

    }, [projectId]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  if (loading) {

    return (
      <div className="flex justify-center py-20">
        <Loader2
          size={30}
          className="animate-spin"
        />
      </div>
    );
  }

  return (

    <div className="p-6">

      <KanbanBoard
        mode="viewer"
        projectId={projectId}
        issues={issues}
        onRefresh={loadIssues}
        title="Project Board"
        subtitle="Read-only issue board"
      />

    </div>

  );
};

export default ViewerBoard;