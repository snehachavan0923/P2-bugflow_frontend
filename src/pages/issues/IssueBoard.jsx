import { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import {
  editIssue,
  getIssues,
  resolveIssue,
} from "../../api/issueApi";
import { getTeamMembers } from "../../api/teamApi";

const tabs = ["Open", "In Progress", "Review", "Done"];

const buttonBase =
  "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

const IssueBoard = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [activeTab, setActiveTab] = useState("Open");
  const [imagePreview, setImagePreview] = useState(null);
  const [detailsIssue, setDetailsIssue] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolveFile, setResolveFile] = useState(null);

  const fetchIssues = useCallback(async () => {
    try {
      setError("");

      const data = await getIssues(projectId);
      setIssues(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load issues."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchIssues();

    const loadMembers = async () => {
      try {
        const data = await getTeamMembers(projectId);
        setMembers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMembers();
  }, [fetchIssues, projectId]);

  const filteredIssues = issues.filter(
    (issue) => issue.status === activeTab
  );

  const handleEditSubmit = async () => {
    await editIssue(projectId, editModal.id, {
      title: editModal.title,
      description: editModal.description,
      priority: editModal.priority,
      assignedToUserId: editModal.assignedToUserId,
    });

    setEditModal(null);
    fetchIssues();
  };

  const handleResolveSubmit = async () => {
    if (!resolveFile) {
      alert("Upload proof image");
      return;
    }

    const formData = new FormData();
    formData.append("file", resolveFile);

    await resolveIssue(projectId, resolveModal.id, formData);

    setResolveModal(null);
    setResolveFile(null);
    fetchIssues();
  };

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
    <div className="relative flex h-full w-full flex-col bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex min-h-0 flex-1 flex-col space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              Issue Board
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Manage project issues with a Jira-style kanban board or table view
            </p>
          </div>

          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            {["kanban", "table"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  viewMode === mode
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mode === "kanban" ? "Kanban View" : "Table View"}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="min-h-0 flex-1 min-w-0">
            <KanbanBoard
              mode="owner"
              projectId={projectId}
              issues={issues}
              members={members}
              onRefresh={fetchIssues}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {[
                        "Title",
                        "Description",
                        "Priority",
                        "Assigned",
                        "Image",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredIssues.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-5 py-12 text-center text-sm text-slate-500"
                        >
                          No issues in {activeTab}
                        </td>
                      </tr>
                    ) : (
                      filteredIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="max-w-xs px-5 py-4 text-sm font-semibold text-slate-950">
                            {issue.title}
                          </td>
                          <td className="max-w-sm px-5 py-4 text-sm text-slate-600">
                            <p className="line-clamp-2">
                              {issue.description}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                            {issue.priority}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                            <p className="font-medium">
                              {issue.assignedToName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {issue.assignedToRole}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            {issue.imageUrl ? (
                              <button
                                type="button"
                                className={`${buttonBase} bg-blue-50 text-blue-700 hover:bg-blue-100`}
                                onClick={() =>
                                  setImagePreview(issue.imageUrl)
                                }
                              >
                                View
                              </button>
                            ) : (
                              <span className="text-sm text-slate-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              {issue.status !== "Done" && (
                                <button
                                  type="button"
                                  className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
                                  onClick={() =>
                                    setEditModal({
                                      ...issue,
                                      assignedToUserId:
                                        issue.assignedToUserId,
                                    })
                                  }
                                >
                                  Edit
                                </button>
                              )}

                              {issue.status === "Review" && (
                                <button
                                  type="button"
                                  className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
                                  onClick={() => setResolveModal(issue)}
                                >
                                  Resolve
                                </button>
                              )}

                              <button
                                type="button"
                                className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                                onClick={() => setDetailsIssue(issue)}
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {imagePreview && (
        <ImageDialog
          imageUrl={imagePreview}
          altText="Issue preview"
          onClose={() => setImagePreview(null)}
        />
      )}

      {detailsIssue && (
        <Dialog title="Issue Details" onClose={() => setDetailsIssue(null)}>
          <DetailsContent issue={detailsIssue} />
        </Dialog>
      )}

      {editModal && (
        <Dialog title="Edit Issue" onClose={() => setEditModal(null)}>
          <div className="space-y-4">
            <LabeledField label="Title">
              <input
                className={inputClassName}
                value={editModal.title}
                onChange={(event) =>
                  setEditModal({
                    ...editModal,
                    title: event.target.value,
                  })
                }
              />
            </LabeledField>

            <LabeledField label="Description">
              <textarea
                className={`${inputClassName} min-h-28`}
                value={editModal.description}
                onChange={(event) =>
                  setEditModal({
                    ...editModal,
                    description: event.target.value,
                  })
                }
              />
            </LabeledField>

            <LabeledField label="Priority">
              <select
                className={inputClassName}
                value={editModal.priority}
                onChange={(event) =>
                  setEditModal({
                    ...editModal,
                    priority: event.target.value,
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </LabeledField>

            <LabeledField label="Reassign To">
              <select
                className={inputClassName}
                value={editModal.assignedToUserId || ""}
                onChange={(event) =>
                  setEditModal({
                    ...editModal,
                    assignedToUserId: event.target.value,
                  })
                }
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option
                    key={member.id || member.userId}
                    value={member.userId}
                  >
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </LabeledField>

            {editModal.imageUrl && (
              <img
                src={editModal.imageUrl}
                alt="Bug"
                className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
              />
            )}

            <button
              type="button"
              className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700`}
              onClick={handleEditSubmit}
            >
              Save Changes
            </button>
          </div>
        </Dialog>
      )}

      {resolveModal && (
        <Dialog title="Resolve Issue" onClose={() => setResolveModal(null)}>
          <div className="space-y-4">
            {resolveModal.imageUrl && (
              <img
                src={resolveModal.imageUrl}
                alt="Bug"
                className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
              />
            )}

            <LabeledField label="Upload Resolution Proof">
              <input
                type="file"
                className={inputClassName}
                onChange={(event) => setResolveFile(event.target.files[0])}
              />
            </LabeledField>

            <button
              type="button"
              className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
              onClick={handleResolveSubmit}
            >
              Submit Proof
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

const LabeledField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </span>
    {children}
  </label>
);

const Dialog = ({ title, children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
    onClick={onClose}
  >
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-950">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const ImageDialog = ({ imageUrl, altText, onClose }) => (
  <Dialog title="Image Preview" onClose={onClose}>
    <img
      src={imageUrl}
      alt={altText}
      className="max-h-[75vh] w-full rounded-2xl object-contain"
    />
  </Dialog>
);

const DetailsContent = ({ issue }) => (
  <div className="space-y-4">
    {[
      ["Title", issue.title],
      ["Description", issue.description],
      ["Status", issue.status],
      ["Priority", issue.priority],
      ["Assigned To", issue.assignedToName],
      ["Role", issue.assignedToRole],
      ["Email", issue.assignedToEmail],
    ].map(([label, value]) => (
      <div
        key={label}
        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Not available"}
        </p>
      </div>
    ))}

    {issue.imageUrl && (
      <img
        src={issue.imageUrl}
        alt="Bug"
        className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
      />
    )}

    {issue.resolutionImageUrl && (
      <img
        src={issue.resolutionImageUrl}
        alt="Resolution proof"
        className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
      />
    )}
  </div>
);

export default IssueBoard;
