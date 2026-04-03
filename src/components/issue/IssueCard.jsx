

const IssueCard = ({ issue, onStatusChange }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(issue.id, newStatus);
  };

  return (
    <div className="bg-white p-4 mb-2 rounded shadow">
      <h3 className="font-bold">{issue.title}</h3>
      <p>Priority: {issue.priority}</p>
      <p>Assigned to: {issue.assignedUser}</p>
      <p>Status: {issue.status}</p>
      <div className="mt-2">
        {issue.status !== 'Open' && (
          <button onClick={() => handleStatusChange('Open')} className="mr-2 bg-gray-500 text-white px-2 py-1 rounded">Move to Open</button>
        )}
        {issue.status !== 'In Progress' && (
          <button onClick={() => handleStatusChange('In Progress')} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">Move to In Progress</button>
        )}
        {issue.status !== 'Review' && (
          <button onClick={() => handleStatusChange('Review')} className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded">Move to Review</button>
        )}
        {issue.status !== 'Done' && (
          <button onClick={() => handleStatusChange('Done')} className="bg-green-500 text-white px-2 py-1 rounded">Move to Done</button>
        )}
      </div>
    </div>
  );
};

export default IssueCard;