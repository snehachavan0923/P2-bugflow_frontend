import { useEffect, useRef, useState } from "react";
import { MoreVertical, UserRound } from "lucide-react";

const priorityStyles = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const IssueCard = ({ issue, isSelected, mode, onClick, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const priorityClassName =
    priorityStyles[issue.priority] ||
    "bg-slate-50 text-slate-700 ring-slate-200";

  const isOwner = mode === "owner";

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCardClick = () => onClick(issue);
  const handleDetails = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    onClick(issue);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open issue details"
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
      className={`relative w-full rounded-lg border bg-white px-3 py-2.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none transition duration-150 hover:border-blue-300 hover:shadow-[0_3px_8px_rgba(15,23,42,0.10)] focus-visible:ring-2 focus-visible:ring-blue-500 ${isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 ring-2 ring-transparent"}`}
    >
      <div className="absolute right-3 top-3">
        <button
          type="button"
          ref={buttonRef}
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Open issue actions"
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 z-10 min-w-[150px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
          >
            <button
              type="button"
              onClick={handleDetails}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              View Details
            </button>
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onEdit(issue);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onDelete(issue);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 transition hover:bg-slate-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default IssueCard;
