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
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="px-4 pb-1.5 pt-2 sm:px-5">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-normal text-slate-950">
              {project.name}
            </h1>
            <p className="mt-0.5 max-w-3xl truncate text-xs text-slate-600">
              {project.description ||
                "No project description provided."}
            </p>
          </div>
        </div>

        <nav className="flex h-8 overflow-x-auto px-4 sm:px-5">
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

      <Outlet />
    </div>
  );
};

export default WorkspaceFrame;
