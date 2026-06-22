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
    <section className="flex h-[650px] w-[320px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusAccents[title] || "bg-slate-400"
              }`}
            />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {title}
            </h2>
          </div>

          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
            {issues.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {issues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-400">
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