import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import {
  editIssue,
  getIssues,
} from "../../api/issueApi";
import { getTeamMembers } from "../../api/teamApi";

const tabs = ["Open", "In Progress", "Review", "Done"];

const buttonBase =
  "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

const IssueBoard = ({ onCreateIssue }) => {
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
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
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
  <div className="relative flex h-full min-h-0 w-full flex-col bg-white">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-1.5">
          {onCreateIssue ? (
            <button
              type="button"
              onClick={onCreateIssue}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Issue
            </button>
          ) : (
            <div />
          )}

          <div className="inline-flex h-8 rounded-md border border-slate-200 bg-slate-50 p-0.5">
            {["kanban", "table"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded px-3 text-xs font-semibold transition ${
                  viewMode === mode
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {mode === "kanban" ? "Kanban" : "Table"}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="min-h-0 min-w-0 flex-1 bg-slate-50 p-2">
            <KanbanBoard
              mode="owner"
              projectId={projectId}
              issues={issues}
              members={members}
              onRefresh={fetchIssues}
            />
          </div>
        ) : (
          <div className="space-y-2 bg-slate-50 p-2">
            <div className="flex flex-wrap gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setModalImage(null);
            setModalTitle("");
          }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modalTitle}
              </h3>

              <button
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
              className="max-h-[75vh] w-full object-contain"
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View
                  </button>
                </div>
              </div>
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
    className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-slate-950/50 p-4`}
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
      className="max-h-[75vh] w-full rounded-2xl object-contain"
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

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View
          </button>
        )}
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View
          </button>
        )}
      </div>
    </div>
  </div>
);

export default IssueBoard;
