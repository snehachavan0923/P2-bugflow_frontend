import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Image,
  Pencil,
  Play,
  RotateCcw,
  Send,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";

const fieldClassName =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

const priorityStyles = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const actionButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const IssueDetailsDrawer = ({
  issue,
  mode = "viewer",
  members = [],
  onClose,
  onEditIssue,
  onMoveIssue,
  onResolveIssue,
  onApproveIssue,
  onRejectIssue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedToUserId: "",
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (!issue) {
      return;
    }

    setIsEditing(false);
    setShowResolve(false);
    setShowImages(false);
    setProofFile(null);
    setFormData({
      title: issue.title || "",
      description: issue.description || "",
      priority: issue.priority || "Medium",
      assignedToUserId: issue.assignedToUserId || "",
    });
  }, [issue]);

  const canEdit = mode === "owner" && issue?.status !== "Done";
  const canResolve =
    (mode === "owner" && issue?.status === "Review") ||
    (mode === "developer" && issue?.status === "In Progress");
  const canStartWork = mode === "developer" && issue?.status === "Open";
  const canVerify = mode === "tester" && issue?.status === "Review";
  const isReadOnly = mode === "viewer";

  const priorityClassName = useMemo(
    () =>
      priorityStyles[issue?.priority] ||
      "bg-slate-50 text-slate-700 ring-slate-200",
    [issue?.priority]
  );

  if (!issue) {
    return null;
  }

  const handleEditSubmit = async () => {
    setSaving(true);

    try {
      await onEditIssue(issue, formData);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleResolveSubmit = async () => {
    if (!proofFile) {
      alert("Upload resolution proof");
      return;
    }

    const data = new FormData();
    data.append("file", proofFile);
    setSaving(true);

    try {
      await onResolveIssue(issue, data);
      setShowResolve(false);
      setProofFile(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-30 flex w-full max-w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-200 sm:w-[420px] ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Issue Details
          </p>
          <h2 className="mt-1 text-xl font-bold leading-7 text-slate-950">
            {issue.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close issue details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <h3 className="text-sm font-semibold text-slate-950">
            Description
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {issue.description || "No description provided."}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {issue.status}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Priority
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClassName}`}
            >
              {issue.priority || "Medium"}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-950">
            Assignee
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="font-semibold text-slate-900">
              {issue.assignedToName || "Unassigned"}
            </p>
            <p className="text-slate-500">
              {issue.assignedToRole || "No role"}
            </p>
            <p className="break-words text-slate-500">
              {issue.assignedToEmail || "No email"}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-950">
              Images
            </h3>
            <button
              type="button"
              onClick={() => setShowImages((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Image className="h-4 w-4" aria-hidden="true" />
              View Images
            </button>
          </div>

          {showImages && (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Bug Screenshot
                </p>
                {issue.imageUrl ? (
                  <img
                    src={issue.imageUrl}
                    alt="Bug screenshot"
                    className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    No bug screenshot
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resolution Proof
                </p>
                {issue.resolutionImageUrl ? (
                  <img
                    src={issue.resolutionImageUrl}
                    alt="Resolution proof"
                    className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    No resolution proof
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-950">
            Activity
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Activity history will appear here as the workflow expands.
          </p>
        </section>

        {isEditing && (
          <section className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <h3 className="text-sm font-semibold text-slate-950">
              Edit Issue
            </h3>

            <input
              className={fieldClassName}
              value={formData.title}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  title: event.target.value,
                })
              }
              placeholder="Title"
            />

            <textarea
              className={`${fieldClassName} min-h-24`}
              value={formData.description}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  description: event.target.value,
                })
              }
              placeholder="Description"
            />

            <select
              className={fieldClassName}
              value={formData.priority}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  priority: event.target.value,
                })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              className={fieldClassName}
              value={formData.assignedToUserId}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  assignedToUserId: event.target.value,
                })
              }
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option
                  key={member.id || member.userId}
                  value={member.userId || member.id}
                >
                  {member.name} ({member.role})
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleEditSubmit}
                className={`${actionButtonClassName} bg-blue-600 text-white hover:bg-blue-700`}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={`${actionButtonClassName} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {showResolve && (
          <section className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h3 className="text-sm font-semibold text-slate-950">
              Submit Resolution Proof
            </h3>
            <input
              type="file"
              className={fieldClassName}
              onChange={(event) => setProofFile(event.target.files[0])}
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleResolveSubmit}
                className={`${actionButtonClassName} bg-emerald-600 text-white hover:bg-emerald-700`}
              >
                Submit Proof
              </button>
              <button
                type="button"
                onClick={() => setShowResolve(false)}
                className={`${actionButtonClassName} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </div>

      {!isReadOnly && (
        <div className="border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`${actionButtonClassName} bg-slate-900 text-white hover:bg-slate-800`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit Issue
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`${actionButtonClassName} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                >
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  Reassign Issue
                </button>
              </>
            )}

            {canStartWork && (
              <button
                type="button"
                onClick={() => onMoveIssue(issue, "In Progress")}
                className={`${actionButtonClassName} bg-blue-600 text-white hover:bg-blue-700`}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Start Work
              </button>
            )}

            {canResolve && (
              <button
                type="button"
                onClick={() => setShowResolve(true)}
                className={`${actionButtonClassName} bg-emerald-600 text-white hover:bg-emerald-700`}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {mode === "developer" ? "Submit Fix" : "Resolve Issue"}
              </button>
            )}

            {canVerify && (
              <>
                <button
                  type="button"
                  onClick={() => onApproveIssue(issue)}
                  className={`${actionButtonClassName} bg-emerald-600 text-white hover:bg-emerald-700`}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onRejectIssue(issue)}
                  className={`${actionButtonClassName} bg-red-600 text-white hover:bg-red-700`}
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Reject
                </button>
              </>
            )}

            {mode === "developer" && issue.status === "Review" && (
              <span className="inline-flex items-center rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
                Waiting For Tester
              </span>
            )}

            {mode === "developer" && issue.status === "Done" && (
              <span className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Completed
              </span>
            )}

            {mode === "tester" && issue.status !== "Review" && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                No tester actions
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default IssueDetailsDrawer;
