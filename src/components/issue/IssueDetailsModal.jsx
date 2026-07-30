
import Modal from '../common/Modal';

const IssueDetailsModal = ({ isOpen, onClose, issue }) => {
  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Details">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-950">{issue.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{issue.description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Priority</p>
            <p className="mt-1 font-semibold text-slate-900">{issue.priority}</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Status</p>
            <p className="mt-1 font-semibold text-slate-900">{issue.status}</p>
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Assigned To</p>
          <p className="mt-1 font-semibold text-slate-900">{issue.assignedToName}</p>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Created</p>
          <p className="mt-1 font-semibold text-slate-900">{new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Modal>
  );
};

export default IssueDetailsModal;