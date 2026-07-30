import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { ListTodo } from "lucide-react";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import { deleteIssue, editIssue } from "../../api/issueApi";
import { useAuth } from "../../context/AuthContext";
import { alertApiError, alertSuccess, confirmAction } from "../../utils/alerts";
import { useProjectWorkspace } from "../project/workspace/WorkspaceContext";

const tabs = ["Open", "In Progress", "Review", "Done"];

const buttonBase =
  "inline-flex items-center justify-center rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.75 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

const IssueBoard = ({ onCreateIssue }) => {
  const { projectId } = useParams();
  const { issues, members, refreshWorkspace } = useProjectWorkspace();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState("kanban");
  const [activeTab, setActiveTab] = useState("Open");
  const [imagePreview, setImagePreview] = useState(null);
  const [detailsIssue, setDetailsIssue] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const filteredIssues = issues.filter(
    (issue) => issue.status === activeTab
  );
  const isOwnerView = user?.role?.toLowerCase() === "owner";

  const handleDeleteIssue = async (issue) => {
    const confirmed = await confirmAction(
      "Delete this issue?",
      "This action cannot be undone.",
      "Delete",
      { confirmButtonColor: "#ef4444" }
    );

    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      await deleteIssue(projectId, issue.id || issue._id);
      await refreshWorkspace();
      await alertSuccess("Issue Deleted", "The issue was deleted successfully.");
    } catch (err) {
      console.error(err);
      await alertApiError(err, "Error deleting issue. Please try again.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await editIssue(
        projectId,
        editModal.id,
        {
          title: editModal.title,
          description: editModal.description,
          priority: editModal.priority,

          developerUserId:
            editModal.status !== "Review"
              ? editModal.reassignedUserId
              : null,

          testerUserId:
            editModal.status === "Review"
              ? editModal.reassignedUserId
              : null,
        }
      );

      setEditModal(null);
      await refreshWorkspace();
    } catch (err) {
      console.error(err);
      const { alertApiError } = await import('../../utils/alerts');
      alertApiError(err, 'Error saving issue details. Please try again.');
    }
  };

  return (
  <div className="relative flex h-full min-h-0 w-full flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-2 py-2 sm:px-3 lg:px-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.24)]">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-4">
          {onCreateIssue ? (
            <button
              type="button"
              onClick={onCreateIssue}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(79,70,229,0.55)] transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Issue
            </button>
          ) : (
            <div />
          )}

          <div className="inline-flex h-9 rounded-2xl border border-slate-200 bg-white p-0.5 shadow-sm">
            {["kanban", "table"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-xl px-3 text-sm font-semibold transition ${
                  viewMode === mode
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mode === "kanban" ? "Kanban" : "Table"}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="min-h-0 min-w-0 flex-1 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-2 sm:p-3">
            <KanbanBoard
              mode="owner"
              projectId={projectId}
              issues={issues}
              members={members}
              onRefresh={refreshWorkspace}
            />
          </div>
        ) : (
          <div className="space-y-3 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-2 sm:p-3">
            <div className="flex flex-wrap gap-1 rounded-[24px] border border-slate-200 bg-white p-1.5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)]">
              <div className="max-h-[520px] overflow-x-auto overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.6)_transparent]">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
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
                          className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
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
                          className="px-5 py-12 text-center"
                        >
                          <div className="mx-auto flex max-w-sm flex-col items-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <ListTodo className="h-7 w-7 text-slate-500" />
                        </div>
                            <p className="mt-4 font-semibold text-slate-900">No issues in {activeTab}</p>
                            <p className="mt-1 text-slate-500">Create or move work here to keep the board moving.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="transition hover:bg-slate-50/80"
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
                                className={`${buttonBase} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
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
                                    reassignedUserId:
                                      issue.status === "Review"
                                        ? issue.testerId
                                        : issue.developerId,
                                  })
                                }
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                type="button"
                                className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                                onClick={() => setDetailsIssue(issue)}
                              >
                                Details
                              </button>

                              {isOwnerView && (
                                <button
                                  type="button"
                                  className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}
                                  onClick={() => handleDeleteIssue(issue)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
      <Dialog
        title="Issue Details"
        onClose={() => setDetailsIssue(null)}
      >
        <DetailsContent
          issue={detailsIssue}
          onViewImage={(title, url) => {
            setModalTitle(title);
            setModalImage(url);
          }}
        />
      </Dialog>
    )}

     {modalImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-[2px]"
          onClick={() => {
            setModalImage(null);
            setModalTitle("");
          }}
        >
          <div
            className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_-28px_rgba(15,23,42,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">
                {modalTitle}
              </h3>

              <button
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => {
                  setModalImage(null);
                  setModalTitle("");
                }}
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={modalImage}
              alt={modalTitle}
              className="max-h-[75vh] w-full rounded-[24px] border border-slate-200 bg-slate-50 object-contain p-2"
            />
          </div>
        </div>
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
            value={editModal.reassignedUserId || ""}
              onChange={(e) =>
                setEditModal({
                  ...editModal,
                  reassignedUserId: e.target.value,
                })
              }
            >
              <option value="">
                Select Member
              </option>

              {members
                .filter((member) =>
                  editModal.status === "Review"
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
          </LabeledField>

            {editModal.imageUrl && (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Bug Image
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Bug screenshot available
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setModalTitle("Bug Image");
                      setModalImage(editModal.imageUrl);
                    }}
                    className="rounded-2xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`${buttonBase} bg-indigo-600 text-white hover:bg-indigo-700`}
              onClick={handleEditSubmit}
            >
              Save Changes
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

  const Dialog = ({
    title,
    children,
    onClose,
    zIndex = "z-50",
  }) => (
  <div
    className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]`}
    onClick={onClose}
  >
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_90px_-28px_rgba(15,23,42,0.4)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-950">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);



  const ImageDialog = ({
    imageUrl,
    altText,
    onClose,
  }) => (
    <Dialog
      title="Image Preview"
      onClose={onClose}
      zIndex="z-[70]"
    >
    <img
      src={imageUrl}
      alt={altText}
      className="max-h-[75vh] w-full rounded-[24px] border border-slate-200 bg-slate-50 object-contain p-2"
    />
  </Dialog>
  );
  const DetailsContent = ({
    issue,
    onViewImage,
  }) => (
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
        className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Not available"}
        </p>
      </div>
    ))}

    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Bug Image
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-slate-700">
          {issue.imageUrl
            ? "Bug screenshot available"
            : "Not available"}
        </span>

        {issue.imageUrl && (
          <button
            type="button"
            onClick={() =>
              onViewImage(
                "Bug Image",
                issue.imageUrl
              )
            }
            className="rounded-2xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            View
          </button>
        )}
      </div>
    </div>

    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Resolution Image
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-slate-700">
          {issue.resolutionImageUrl
            ? "Resolution proof available"
            : "Not available"}
        </span>

        {issue.resolutionImageUrl && (
          <button
            type="button"
            onClick={() =>
              onViewImage(
                "Resolution Image",
                issue.resolutionImageUrl
              )
            }
            className="rounded-2xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            View
          </button>
        )}
      </div>
    </div>
  </div>
);

export default IssueBoard;
