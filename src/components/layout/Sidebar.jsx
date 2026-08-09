import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  LayoutDashboard,
  FolderKanban,
  ChartColumn,
  ChevronDown,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProjects } from "../../api/projectApi";

const Sidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [projectsOpen, setProjectsOpen] = useState(true);

  const projectRoles = ["Developer", "Tester", "Viewer"];
  const isProjectRole = projectRoles.includes(role);

  useEffect(() => {
    if (!isProjectRole) return;

    const fetchAssignedProjects = async () => {
      try {
        const data = await getProjects();
        setAssignedProjects(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAssignedProjects();
  }, [isProjectRole]);

  const menuItems = () => {
    if (role === "Admin") {
      return [
        {
          label: "Admin Dashboard",
          to: "/admin",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          label: "Organizations",
          to: "/admin/organizations",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          label: "Owners",
          to: "/admin/owners",
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: "Projects",
          to: "/admin/projects",
          icon: <FolderKanban className="h-5 w-5" />,
        },
        {
          label: "Revenue Analytics",
          to: "/admin/revenue",
          icon: <ChartColumn className="h-5 w-5" />,
        },
        {
          label: "Plan Management",
          to: "/admin/plans",
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          label: "Payment History",
          to: "/admin/history",
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          label: "Subscriptions",
          to: "/admin/subscriptions",
          icon: <CreditCard className="h-5 w-5" />,
        },
      ];
    }

    if (role === "Owner") {
      return [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          label: "Projects",
          to: "/projects",
          icon: <FolderKanban className="h-5 w-5" />,
        },
        {
          label: "Task Overview",
          to: "/task-overview",
          icon: <ChartColumn className="h-5 w-5" />,
        },
        {
          label: "Organization Settings",
          to: "/organization/settings",
          icon: <Building2 className="h-5 w-5" />,
          group: "Organization",
        },
        {
          label: "Subscription",
          to: "/subscription",
          icon: <CreditCard className="h-5 w-5" />,
          group: "Organization",
        },
        {
          label: "Members Directory",
          to: "/organization/members",
          icon: <Users className="h-5 w-5" />,
          group: "Organization",
        },
      ];
    }

    if (isProjectRole) {
      return [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          label: "Projects",
          to: "#",
          icon: <FolderKanban className="h-5 w-5" />,
          isProjectGroup: true,
        },
      ];
    }

    return [];
  };

  const items = menuItems();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200/80 bg-white shadow-[4px_0_24px_-12px_rgba(15,23,42,0.06)]">
      {/* Branding Header */}
      <div className="border-b border-slate-100 p-6">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-950 transition-colors group-hover:text-indigo-600">
              BugFlow
            </span>
            <p className="text-[11px] font-medium text-slate-400">
              Bug Tracking System
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5 [scrollbar-color:rgba(148,163,184,0.4)_transparent] [scrollbar-width:thin]">
        {items.map((item, index) => {
          const showGroupHeading =
            item.group &&
            (index === 0 || items[index - 1].group !== item.group);

          if (item.isProjectGroup) {
            const projectGroupIsActive = location.pathname.startsWith(
              "/projects/"
            );

            return (
              <div key="project-group" className="mb-2">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((prev) => !prev)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    projectGroupIsActive
                      ? "border border-indigo-100/80 bg-indigo-50 font-bold text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-950"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center ${
                      projectGroupIsActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      projectsOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {projectsOpen && (
                  <div className="ml-5 mt-1.5 space-y-1 border-l-2 border-slate-100 pl-4">
                    {assignedProjects.length > 0 ? (
                      assignedProjects.map((project) => (
                        <NavLink
                          key={project.id}
                          to={`/projects/${project.id}/overview`}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-indigo-100/60 font-bold text-indigo-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                            }`
                          }
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span className="truncate">{project.name}</span>
                        </NavLink>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-medium text-slate-400">
                        No projects assigned
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <React.Fragment key={item.to}>
              {showGroupHeading && (
                <p className="mb-2 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {item.group}
                </p>
              )}

              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border border-indigo-100/80 bg-indigo-50 font-bold text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-bold text-indigo-700 shadow-sm">
            {role?.charAt(0) || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">
              {role || "User"}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              BugFlow Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;