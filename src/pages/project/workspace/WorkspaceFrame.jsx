import React from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

const WorkspaceFrame = ({ project, tabs }) => {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const workspacePath = (tab) =>
    `/projects/${projectId}/${tab}`;

  return (
<div className="flex h-full min-h-0 flex-col bg-slate-50">
  <div className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="flex h-16 items-center px-4 sm:px-5">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-normal text-slate-950">
          {project.name}
        </h1>
        <p className="max-w-3xl truncate text-xs text-slate-600">
          {project.description || "No project description provided."}
        </p>
      </div>
      <nav className="flex h-full overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const tabPath = workspacePath(tab.to);

            return (
              <NavLink
                key={tab.to}
                to={tabPath}
                end
                onClick={(event) => {
                  if (pathname === tabPath) {
                    event.preventDefault();
                  }
                }}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
    </div>
  </div>

<div className="flex-1 min-h-0 overflow-hidden flex h-full">
    <div className="flex-1 h-full min-h-0 overflow-hidden">
      <Outlet />
    </div>
</div>
</div>
  );
};

export default WorkspaceFrame;
