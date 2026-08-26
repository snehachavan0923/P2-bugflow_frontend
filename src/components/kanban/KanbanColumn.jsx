import IssueCard from "./IssueCard";
import {
  Inbox,
  RotateCcw,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const statusAccents = {
  Open: "bg-slate-500",
  "In Progress": "bg-blue-500",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
};

const emptyStateConfig = {
  Open: {
    icon: Inbox,
    description: "New issues will appear here",
    iconColor: "text-slate-300",
  },

  "In Progress": {
    icon: RotateCcw,
    description: "Issues in progress will appear here",
    iconColor: "text-blue-300",
  },

  Review: {
    icon: MessageSquare,
    description: "Issues under review will appear here",
    iconColor: "text-amber-300",
  },

  Done: {
    icon: CheckCircle2,
    description: "Completed issues will appear here",
    iconColor: "text-emerald-300",
  },
};

const KanbanColumn = ({
  title,
  issues,
  selectedIssueId,
  onSelectIssue,
  mode,
  onEditIssue,
  onDeleteIssue,
}) => {
  const emptyState = emptyStateConfig[title] || emptyStateConfig.Open;
  const EmptyIcon = emptyState.icon;

  return (
    <section className="flex h-[min(72vh,760px)] min-h-[480px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_46px_-24px_rgba(15,23,42,0.2)]">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 px-3.5 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusAccents[title] || "bg-slate-400"
              }`}
            />

            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
              {title}
            </h2>
          </div>

          <span className="min-w-7 rounded-full bg-white px-2.5 py-1 text-center text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {issues.length}
          </span>

        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2.5 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.6)_transparent]">

        {issues.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex h-full items-center justify-center px-2 py-6">

            <div className="flex w-full max-w-[270px] flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">

              <EmptyIcon
                className={`mb-5 h-11 w-11 ${emptyState.iconColor}`}
                strokeWidth={1.6}
                aria-hidden="true"
              />

              <h3 className="text-[18px] font-semibold tracking-tight text-slate-800">
                No issues
              </h3>

              <p className="mt-2 max-w-[210px] text-sm leading-6 text-slate-400">
                {emptyState.description}
              </p>

            </div>

          </div>

        ) : (

          /* ISSUES */
          <div className="space-y-2.5">

            {issues.map((issue) => (
              <IssueCard
                key={issue.id || issue._id}
                issue={issue}
                mode={mode}
                isSelected={
                  selectedIssueId === (issue.id || issue._id)
                }
                onClick={onSelectIssue}
                onEdit={onEditIssue}
                onDelete={onDeleteIssue}
              />
            ))}

          </div>

        )}

      </div>
    </section>
  );
};

export default KanbanColumn;