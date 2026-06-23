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
}) => {
  return (
    <section className="flex h-[min(68vh,700px)] min-h-[520px] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-100/95 px-3.5 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusAccents[title] || "bg-slate-400"
              }`}
            />
            <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-700">
              {title}
            </h2>
          </div>

          <span className="min-w-6 rounded-full bg-white px-2 py-0.5 text-center text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200/80">
            {issues.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2.5">
        {issues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-400">
            No issues
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue.id || issue._id}
              issue={issue}
              isSelected={selectedIssueId === (issue.id || issue._id)}
              onClick={onSelectIssue}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default KanbanColumn;