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
    <aside className="flex h-screen w-72 flex-col border-r border-blue-800/30 bg-[#2f52d5] text-white shadow-[4px_0_24px_-12px_rgba(15,23,42,0.16)]">
      {/* Branding Header */}
      <div className="border-b border-white/10 p-6">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white shadow-lg shadow-[#1f3da6]/30 ring-1 ring-white/15">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-100">
              BugFlow
            </span>
            <p className="text-[11px] font-medium text-blue-100/80">
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
                      ? "border border-white/15 bg-white/10 font-bold text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center ${
                      projectGroupIsActive
                        ? "text-white"
                        : "text-blue-100/80 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-blue-100/80 transition-transform duration-200 ${
                      projectsOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                {projectsOpen && (
                  <div className="ml-5 mt-1.5 space-y-1 border-l-2 border-white/10 pl-4">
                    {assignedProjects.length > 0 ? (
                      assignedProjects.map((project) => (
                        <NavLink
                          key={project.id}
                          to={`/projects/${project.id}/overview`}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-white/12 font-bold text-white"
                                : "text-blue-100 hover:bg-white/8 hover:text-white"
                            }`
                          }
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          <span className="truncate">{project.name}</span>
                        </NavLink>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-blue-100/80">
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
                      ? "border border-white/15 bg-white/10 font-bold text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-blue-100/80 group-hover:text-white"
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
      <div className="border-t border-white/10 bg-[#2346c9] p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-sm font-bold text-white shadow-sm ring-1 ring-white/10">
            {role?.charAt(0) || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {role || "User"}
            </p>
            <p className="truncate text-xs font-medium text-blue-100/80">
              BugFlow Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;