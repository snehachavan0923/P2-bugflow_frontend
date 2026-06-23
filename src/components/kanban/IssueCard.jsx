import { UserRound } from "lucide-react";

const priorityStyles = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const IssueCard = ({ issue, isSelected, onClick }) => {
  const priorityClassName =
    priorityStyles[issue.priority] ||
    "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <button
      type="button"
      onClick={() => onClick(issue)}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition duration-150 hover:border-blue-300 hover:shadow-[0_3px_8px_rgba(15,23,42,0.10)] focus-visible:ring-2 focus-visible:ring-blue-500 ${isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 ring-2 ring-transparent"}`}
    >
      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
        {issue.title}
      </h3>

      <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-500">
        {issue.description || "No description provided."}
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4 ring-1 ring-inset ${priorityClassName}`}
        >
          {issue.priority || "Medium"}
        </span>

        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-500">
          <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{issue.assignedToName || "Unassigned"}</span>
        </span>
      </div>
    </button>
  );
};

export default IssueCard;
