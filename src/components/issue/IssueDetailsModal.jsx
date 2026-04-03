
import Modal from '../common/Modal';

const IssueDetailsModal = ({ isOpen, onClose, issue }) => {
  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Details">
      <h3 className="text-lg font-bold mb-2">{issue.title}</h3>
      <p className="mb-4">{issue.description}</p>
      <div className="space-y-2">
        <p><strong>Priority:</strong> {issue.priority}</p>
        <p><strong>Status:</strong> {issue.status}</p>
        <p><strong>Assigned To:</strong> {issue.assignedTo}</p>
        <p><strong>Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
      </div>
    </Modal>
  );
};

export default IssueDetailsModal;