/* import React from 'react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ issues, onStatusChange }) => {
  const columns = ['Open', 'In Progress', 'Review', 'Done'];

  const getIssuesByStatus = (status) => {
    return issues.filter(issue => issue.status === status);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {columns.map((column) => (
        <KanbanColumn
          key={column}
          title={column}
          issues={getIssuesByStatus(column)}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default KanbanBoard; */