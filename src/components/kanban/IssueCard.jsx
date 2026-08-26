import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

const priorityStyles = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const IssueCard = ({ issue, isSelected, mode, onClick, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
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

  useLayoutEffect(() => {
    if (!menuOpen) {
      setMenuPosition(null);
      return undefined;
    }

    const updateMenuPosition = () => {
      const buttonBounds = buttonRef.current?.getBoundingClientRect();
      if (!buttonBounds) {
        return;
      }

      const menuWidth = menuRef.current?.offsetWidth || 150;
      const menuHeight = menuRef.current?.offsetHeight || (isOwner ? 120 : 40);

      setMenuPosition({
        left: Math.min(
          Math.max(8, buttonBounds.right - menuWidth),
          window.innerWidth - menuWidth - 8,
        ),
        top: Math.min(
          buttonBounds.bottom + 8,
          window.innerHeight - menuHeight - 8,
        ),
      });
    };

    updateMenuPosition();
    const animationFrame = window.requestAnimationFrame(updateMenuPosition);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOwner, menuOpen]);

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
      className={`relative w-full cursor-pointer rounded-[24px] border bg-white px-3.5 py-3.5 text-left shadow-[0_14px_34px_-24px_rgba(15,23,42,0.24)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_20px_44px_-24px_rgba(15,23,42,0.3)] focus-visible:ring-2 focus-visible:ring-blue-500 ${isSelected ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 ring-2 ring-transparent"}`}
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

        {menuOpen && menuPosition &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-50 min-w-[150px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              style={menuPosition}
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
            </div>,
            document.body,
          )}
      </div>

      <div className="pr-10">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">
          {issue.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-4 text-slate-500">
          {issue.description || "No description provided."}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ring-1 ring-inset ${priorityClassName}`}
        >
          {issue.priority || "Medium"}
        </span>

        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
            {(issue.assignedToName || "U").charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{issue.assignedToName || "Unassigned"}</span>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
