import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  LayoutDashboard,
  FolderKanban,
  ChartColumn,
  ChevronDown,
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
          label: "Projects",
          to: "/admin/projects",
          icon: <FolderKanban className="h-5 w-5" />,
        },
        {
          label: "Subscriptions",
          to: "/admin/subscriptions",
          icon: "💳",
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
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-6">
        <NavLink
          to="/dashboard"
          className="text-2xl font-bold text-indigo-600 transition-colors hover:text-indigo-700"
        >
          BugFlow
        </NavLink>

        <p className="mt-1 text-sm text-gray-500">
          Bug Tracking Made Simple
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((item, index) => {
          const showGroupHeading =
            item.group &&
            (index === 0 || items[index - 1].group !== item.group);

          if (item.isProjectGroup) {
            const projectGroupIsActive = location.pathname.startsWith("/projects/");

            return (
              <div key="project-group" className="mb-3">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((prev) => !prev)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    projectGroupIsActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center text-gray-500">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      projectsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {projectsOpen && (
                  <div className="space-y-1 pl-10">
                    {assignedProjects.length > 0 ? (
                      assignedProjects.map((project) => (
                        <NavLink
                          key={project.id}
                          to={`/projects/${project.id}/overview`}
                          className={({ isActive }) =>
                            `block rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                            }`
                          }
                        >
                          {project.name}
                        </NavLink>
                      ))
                    ) : (
                      <div className="rounded-xl px-3 py-2 text-sm text-gray-500">
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
                <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {item.group}
                </p>
              )}

              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                <span className="flex h-5 w-5 items-center justify-center text-gray-500">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
            {role?.charAt(0)}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{role}</p>

            <p className="text-xs text-gray-500">
              BugFlow User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;