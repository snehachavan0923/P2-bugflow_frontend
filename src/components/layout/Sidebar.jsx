import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { role } = useAuth();

  const menuItems = () => {
    if (role === 'Admin') {
      return [
        { label: 'Admin Dashboard', to: '/admin', icon: '📊' },
        { label: 'Projects', to: '/admin/projects', icon: '📁' },
        { label: 'Subscriptions', to: '/admin/subscriptions', icon: '💳' },
      ];
    }

      if (role === "Owner") {
      return [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: "🏠",
        },
        {
          label: "Projects",
          to: "/projects",
          icon: "📁",
        },
        {
          label: "Task Overview",
          to: "/task-overview",
          icon: "📊",
        },
        {
          label: "Settings",
          to: "/settings",
          icon: "⚙️",
        },
      ];
    }

      if (role === "Developer") {
      return [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: "🏠",
        },
        {
          label: "Projects",
          to: "/projects",
          icon: "📁",
        },
      ];
    }

    if (role === "Tester") {
      return [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: "🏠",
        },
        {
          label: "Projects",
          to: "/projects",
          icon: "📁",
        },
      ];
    }

    if (role === 'Viewer') {
      return [
        { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
        { label: 'Projects', to: '/projects', icon: '📁' },
      ];
    }

    return [
      { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
      { label: 'Projects', to: '/projects', icon: '📁' },
    ];
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <NavLink to="/dashboard" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          BugFlow
        </NavLink>
        <p className="text-sm text-gray-500 mt-1">Bug Tracking Made Simple</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems().map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        {role === "Owner" && (
          <div className="pt-4">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Organization
            </p>

            <NavLink
              to="/organization/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`
              }
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Organization Settings</span>
            </NavLink>

            <NavLink
              to="/organization/members"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Members Directory</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Role Badge */}
         

      <div className="p-4 border-t border-gray-200">

        <div className="flex items-center gap-3">

          <div
            className="
              h-10
              w-10
              rounded-full
              bg-indigo-100
              flex
              items-center
              justify-center
              font-semibold
              text-indigo-600
            "
          >
            {role?.charAt(0)}
          </div>

          <div>

            <p className="text-sm font-semibold">
              {role}
            </p>

            <p className="text-xs text-gray-500">
              BugFlow User
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Sidebar;