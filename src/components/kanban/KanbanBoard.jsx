import { useCallback, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  approveIssue,
  editIssue,
  moveIssueStatus,
  rejectIssue,
  resolveIssue,
} from "../../api/issueApi";
import IssueDetailsDrawer from "./IssueDetailsDrawer";
import KanbanColumn from "./KanbanColumn";

const columns = ["Open", "In Progress", "Review", "Done"];

const getIssueId = (issue) => issue.id || issue._id;

const fieldClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

const actionButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const KanbanBoard = ({
  issues = [],
  mode = "viewer",
  projectId,
  members = [],
  onRefresh,
  title,
  subtitle,
}) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    developerUserId: "",
    testerUserId: "",
  });

  const issuesByStatus = useMemo(
    () =>
      columns.reduce((groups, status) => {
        groups[status] = issues.filter((issue) => issue.status === status);
        return groups;
      }, {}),
    [issues]
  );

  const selectedIssueId = selectedIssue?.id || selectedIssue?._id;

  const refreshBoard = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  const resolveProjectId = (issue) =>
    issue.projectId || projectId;

 const handleEditIssue = async (issue, data) => {
  await editIssue(
    resolveProjectId(issue),
    getIssueId(issue),
    data
  );

  await refreshBoard();

  const updatedIssue = issues.find(
    (i) => getIssueId(i) === getIssueId(issue)
  );

  if (updatedIssue) {
    setSelectedIssue(updatedIssue);
  }
};
  const handleMoveIssue = async (issue, status) => {
    await moveIssueStatus(resolveProjectId(issue), getIssueId(issue), status);
    await refreshBoard();
    setSelectedIssue((current) => ({
      ...current,
      status,
    })); 
  };

  const handleResolveIssue = async (issue, formData) => {
    await resolveIssue(resolveProjectId(issue), getIssueId(issue), formData);
    await refreshBoard();
    setSelectedIssue((current) => ({
      ...current,
      status: "Review",
    }));
  };

  const handleApproveIssue = async (issue) => {
    await approveIssue(resolveProjectId(issue), getIssueId(issue));
    await refreshBoard();
    setSelectedIssue((current) => ({
      ...current,
      status: "Done",
    }));
  };

  const handleRejectIssue = async (issue) => {
    await rejectIssue(resolveProjectId(issue), getIssueId(issue));
    await refreshBoard();
    setSelectedIssue((current) => ({
      ...current,
      status: "In Progress",
    }));
  };

  const handleOpenImage = useCallback((title, imageUrl) => {
    setPreviewTitle(title);
    setPreviewImage(imageUrl);
  }, []);

  const handleOpenEdit = useCallback((issue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title || "",
      description: issue.description || "",
      priority: issue.priority || "Medium",
      developerUserId: issue.developerId || "",
      testerUserId: issue.testerId || "",
    });
    setShowEditForm(true);
  }, []);

  const handleOpenResolve = useCallback((issue) => {
    setEditingIssue(issue);
    setProofFile(null);
    setShowResolve(true);
  }, []);

  const handleEditSubmit = async () => {
    if (!editingIssue) return;
    setSaving(true);

    try {
      await editIssue(
        resolveProjectId(editingIssue),
        getIssueId(editingIssue),
        formData
      );
      await refreshBoard();
      setShowEditForm(false);
      
      const updatedIssue = issues.find(
        (i) => getIssueId(i) === getIssueId(editingIssue)
      );
      if (updatedIssue) {
        setSelectedIssue(updatedIssue);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResolveSubmit = async () => {
    if (!editingIssue) return;
    if (!proofFile) {
      const { alertValidationError } = await import('../../utils/alerts');
      alertValidationError('Resolution Proof', 'Please upload proof to resolve this issue.');
      return;
    }

    const data = new FormData();
    data.append("file", proofFile);
    setSaving(true);

    try {
      await resolveIssue(
        resolveProjectId(editingIssue),
        getIssueId(editingIssue),
        data
      );
      await refreshBoard();
      setShowResolve(false);
      setProofFile(null);
      
      setSelectedIssue((current) => ({
        ...current,
        status: "Review",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="flex h-full min-h-0 w-full flex-col">
    <div className="flex min-h-0 flex-1 flex-col space-y-6">
       {(title || subtitle) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>

            {title && (
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                {subtitle}
              </p>
            )}

          </div>
        </div>
      )}

   <div className="flex min-h-0 flex-1 flex-col pb-4">
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-3xl bg-slate-50 shadow-sm">
        <div className={`min-h-0 flex-1 overflow-auto transition-all duration-200 ${selectedIssue ? "lg:max-w-[calc(100%-420px)]" : ""}`}>
          <div className="h-full min-h-0 w-full overflow-auto pb-2">
            <div className="grid min-w-0 grid-cols-4 gap-3 lg:gap-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column}
                  title={column}
                  issues={issuesByStatus[column] || []}
                  selectedIssueId={selectedIssueId}
                  onSelectIssue={setSelectedIssue}
                />
              ))}
            </div>
          </div>
        </div>

        {selectedIssue && (
          <div className="hidden h-full max-h-full shrink-0 overflow-hidden border-l border-slate-200 bg-white shadow-sm sm:flex sm:w-full sm:max-w-[420px] sm:flex-col">
            <IssueDetailsDrawer
              embedded
              projectId={projectId}
              issue={selectedIssue}
              mode={mode}
              onClose={() => setSelectedIssue(null)}
              onEditIssue={handleEditIssue}
              onMoveIssue={handleMoveIssue}
              onResolveIssue={handleResolveIssue}
              onApproveIssue={handleApproveIssue}
              onRejectIssue={handleRejectIssue}
              onOpenImage={handleOpenImage}
              onOpenEdit={handleOpenEdit}
              onOpenResolve={handleOpenResolve}
            />
          </div>
        )}
      </div>

      {selectedIssue && (
        <div className="sm:hidden">
          <IssueDetailsDrawer
            projectId={projectId}
            issue={selectedIssue}
            mode={mode}
            onClose={() => setSelectedIssue(null)}
            onEditIssue={handleEditIssue}
            onMoveIssue={handleMoveIssue}
            onResolveIssue={handleResolveIssue}
            onApproveIssue={handleApproveIssue}
            onRejectIssue={handleRejectIssue}
            onOpenImage={handleOpenImage}
            onOpenEdit={handleOpenEdit}
            onOpenResolve={handleOpenResolve}
          />
        </div>
      )}

          {showEditForm && editingIssue && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
              onClick={() => setShowEditForm(false)}
            >
              <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Issue details
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">Edit Issue</h2>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close edit issue"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">Title</span>
                    <input
                      className={fieldClassName}
                      value={formData.title}
                      onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">Description</span>
                    <textarea
                      className={`${fieldClassName} min-h-28 resize-y`}
                      value={formData.description}
                      onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-slate-700">Priority</span>
                      <select
                        className={fieldClassName}
                        value={formData.priority}
                        onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Reassign To
                      </span>

                      <select
                        className={fieldClassName}
                        value={
                          editingIssue.status === "Review"
                            ? formData.testerUserId
                            : formData.developerUserId
                        }
                        onChange={(e) => {
                          if (editingIssue.status === "Review") {
                            setFormData({
                              ...formData,
                              testerUserId: e.target.value,
                              developerUserId: "",
                            });
                          } else {
                            setFormData({
                              ...formData,
                              developerUserId: e.target.value,
                              testerUserId: "",
                            });
                          }
                        }}
                      >
                        <option value="">
                          Select Member
                        </option>

                        {members
                          .filter((member) =>
                            editingIssue.status === "Review"
                              ? member.role === "Tester"
                              : member.role === "Developer"
                          )
                          .map((member) => (
                            <option
                              key={member.userId}
                              value={member.userId}
                            >
                              {member.name} ({member.role})
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className={`${actionButtonClassName} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleEditSubmit}
                    className={`${actionButtonClassName} bg-blue-600 text-white shadow-sm hover:bg-blue-700`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResolve && editingIssue && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
              onClick={() => setShowResolve(false)}
            >
              <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Submit Resolution
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">Resolve Issue</h2>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowResolve(false)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close resolve issue"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">Resolution Proof (Image)</span>
                    <input
                      type="file"
                      className={fieldClassName}
                      onChange={(event) => setProofFile(event.target.files[0])}
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowResolve(false)}
                    className={`${actionButtonClassName} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleResolveSubmit}
                    className={`${actionButtonClassName} bg-emerald-600 text-white shadow-sm hover:bg-emerald-700`}
                  >
                    {saving ? "Submitting..." : "Submit Proof"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {previewImage && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {previewTitle}
                  </h3>

                  <button
                    onClick={() => setPreviewImage(null)}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <img
                  src={previewImage}
                  alt={previewTitle}
                  className="max-h-[70vh] w-full rounded-xl object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;