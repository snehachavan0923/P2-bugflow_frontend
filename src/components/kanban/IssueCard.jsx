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
      className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${
        isSelected
          ? "border-blue-400 ring-4 ring-blue-50"
          : "border-slate-200"
      }`}
    >
      <h3 className="text-sm font-semibold leading-5 text-slate-950">
        {issue.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
        {issue.description || "No description provided."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClassName}`}
        >
          {issue.priority || "Medium"}
        </span>

        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-500">
          <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            Assigned: {issue.assignedToName || "Unassigned"}
          </span>
        </span>
      </div>
    </button>
  );
};

export default IssueCard;
