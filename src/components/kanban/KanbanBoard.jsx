import { useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";

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
    await editIssue(resolveProjectId(issue), getIssueId(issue), data);
    await refreshBoard();
    setSelectedIssue((current) => ({
      ...current,
      ...data,
    }));
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

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {(title || subtitle) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
                <LayoutDashboard className="h-7 w-7" aria-hidden="true" />
              </div>
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

        <div className="w-full pb-4">
          <div className="flex gap-4">
            <div
              className={`flex-1 transition-all duration-200 ${
                selectedIssue ? "" : ""
              }`}
            >
              <div className="w-full overflow-x-auto">
                <div className="flex gap-4 min-w-fit">
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

            {/* Embedded drawer for tablet/desktop: occupies space so board shrinks */}
            {selectedIssue && (
              <div className="hidden sm:block">
                <IssueDetailsDrawer
                  embedded
                  issue={selectedIssue}
                  mode={mode}
                  members={members}
                  onClose={() => setSelectedIssue(null)}
                  onEditIssue={handleEditIssue}
                  onMoveIssue={handleMoveIssue}
                  onResolveIssue={handleResolveIssue}
                  onApproveIssue={handleApproveIssue}
                  onRejectIssue={handleRejectIssue}
                />
              </div>
            )}
          </div>

          {/* Mobile overlay drawer */}
          {selectedIssue && (
            <div className="sm:hidden">
              <IssueDetailsDrawer
                issue={selectedIssue}
                mode={mode}
                members={members}
                onClose={() => setSelectedIssue(null)}
                onEditIssue={handleEditIssue}
                onMoveIssue={handleMoveIssue}
                onResolveIssue={handleResolveIssue}
                onApproveIssue={handleApproveIssue}
                onRejectIssue={handleRejectIssue}
              />
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default KanbanBoard;
