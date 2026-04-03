import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { getIssues, updateIssue } from '../../api/issueApi'; // ✅ FIX

const IssueBoard = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getIssues(projectId);
        setIssues(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIssues();
  }, [projectId]); // ✅ no warning now

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssue(projectId, issueId, { status: newStatus });
      const updatedList = await getIssues(projectId);
      setIssues(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Issue Board for Project {projectId}
      </h1>

      <KanbanBoard
        issues={issues}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default IssueBoard;