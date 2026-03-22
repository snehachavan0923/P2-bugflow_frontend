import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../components/kanban/KanbanBoard';

const IssueBoard = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Mock data for issues
    const mockIssues = [
      { id: 1, title: 'Fix login bug', priority: 'High', assignedUser: 'John Doe', status: 'Open' },
      { id: 2, title: 'Add new feature', priority: 'Medium', assignedUser: 'Jane Smith', status: 'In Progress' },
      { id: 3, title: 'Review code', priority: 'Low', assignedUser: 'Bob Johnson', status: 'Review' },
      { id: 4, title: 'Deploy to production', priority: 'High', assignedUser: 'Alice Brown', status: 'Done' },
    ];
    setIssues(mockIssues);
  }, [projectId]);

  const handleStatusChange = (issueId, newStatus) => {
    setIssues(issues.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
    // Here you would call an API to update the issue status
  };

  return (
    <div>
      <h1>Issue Board for Project {projectId}</h1>
      <KanbanBoard issues={issues} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default IssueBoard;