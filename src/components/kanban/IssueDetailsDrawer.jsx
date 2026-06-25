import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Play,
  RotateCcw,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
  onClose,
  onEditIssue,
  onMoveIssue,
  onResolveIssue,
  onApproveIssue,
  onRejectIssue,
  onOpenImage,
  onOpenEdit,
  onOpenResolve,
  embedded = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const isAssignedToMe = issue?.assignedToEmail === user?.email;

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



  const canEdit = mode === "owner" && issue?.status !== "Done";
  const canResolve =
  mode === "developer" &&
  issue?.status === "In Progress" &&
  isAssignedToMe;
  const canStartWork =
  mode === "developer" &&
  issue?.status === "Open" &&
  isAssignedToMe;
  const canVerify =
  mode === "tester" &&
  issue?.status === "Review" &&
  isAssignedToMe;
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


  const containerClass = embedded
    ? `flex h-full w-full flex-col overflow-hidden rounded-l-2xl border border-r-0 border-slate-200 bg-white shadow-[-12px_0_32px_rgba(15,23,42,0.14)] transition-all duration-200 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`
    : `fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-200 sm:max-w-[360px] ${isVisible ? "translate-x-0" : "translate-x-full"}`;

  const currentActivity = () => {
  switch (issue.status) {
    case "Open":
      return {
        icon: "🟡",
        title: "Current Activity",
        text: `Issue is waiting for a developer.${
          issue.assignedToName
            ? ` Assigned to: ${issue.assignedToName}`
            : ""
        }`,
      };

    case "In Progress":
      return {
        icon: "🔵",
        title: "Current Activity",
        text: `${
          issue.assignedToName || "Developer"
        } (Developer) is currently working on this issue.`,
      };

    case "Review":
      return {
        icon: "🟣",
        title: "Current Activity",
        text: `Development completed. Issue is under review by ${
          issue.assignedToName || "Tester"
        } (Tester).`,
      };

    case "Done":
      return {
        icon: "🟢",
        title: "Current Activity",
        text: "Issue has been verified and closed.",
      };

    default:
      return {
        icon: "⚪",
        title: "Current Activity",
        text: "No activity available.",
      };
  }
};

const activity = currentActivity();

  return (
    <>
    <aside className={containerClass}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Issue Details
          </p>
          <h2 className="mt-1.5 text-xl font-bold leading-7 text-slate-950">
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

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {issue.status}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
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

       <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Description
        </h3>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {issue.description || "No description provided."}
        </p>
      </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Assignee
          </h3>
          <div className="mt-2.5 space-y-1 text-sm">
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

       <section className="space-y-3 border-b border-slate-100 pb-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Images
        </h3>

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Bug Image
            </span>

            {issue.imageUrl ? (
              <button
                type="button"
                onClick={() => onOpenImage("Bug Image", issue.imageUrl)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                View
              </button>
            ) : (
              <span className="text-sm text-slate-400">
                Not Available
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Resolution Image
            </span>

            {issue.resolutionImageUrl ? (
              <button
                type="button"
                onClick={() => onOpenImage("Resolution Proof", issue.resolutionImageUrl)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                View
              </button>
            ) : (
              <span className="text-sm text-slate-400">
                Not Available
              </span>
            )}
          </div>
        </div>
      </section>
       <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {activity.icon} {activity.title}
        </h3>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {activity.text}
        </p>
      </section>

      </div>

      {!isReadOnly && (
        <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => onOpenEdit(issue)}
                className={`${actionButtonClassName} bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow`}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit Issue
              </button>
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
                onClick={() => onOpenResolve(issue)}
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
            {mode === "developer" &&
              !isAssignedToMe &&
              issue.assignedToRole === "Developer" && (
                <span className="inline-flex items-center rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                  Assigned to {issue.assignedToName}
                </span>
              )}
            {mode === "tester" &&
              issue.status === "Review" &&
              !isAssignedToMe &&
              issue.assignedToRole === "Tester" && (
                <span className="inline-flex items-center rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                  Assigned to {issue.assignedToName}
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
    </>
  );
};

export default IssueDetailsDrawer;