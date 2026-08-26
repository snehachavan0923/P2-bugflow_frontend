import IssueCard from "./IssueCard";

const statusAccents = {
  Open: "bg-slate-500",
  "In Progress": "bg-blue-500",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
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
  return (
    <section className="flex h-[min(72vh,760px)] min-h-[480px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_46px_-24px_rgba(15,23,42,0.2)]">
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

      <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.6)_transparent]">
        {issues.length === 0 ? (
           <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-400">
            No issues
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue.id || issue._id}
              issue={issue}
              mode={mode}
              isSelected={selectedIssueId === (issue.id || issue._id)}
              onClick={onSelectIssue}
              onEdit={onEditIssue}
              onDelete={onDeleteIssue}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default KanbanColumn; 