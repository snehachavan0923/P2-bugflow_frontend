import React from 'react';
import { NavLink } from 'react-router-dom';
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

    if (role === 'Owner') {
      return [
        { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
        { label: 'Projects', to: '/projects', icon: '📁' },
        { label: 'Team', to: '/team', icon: '👥' },
        { label: 'Issues', to: '/issues', icon: '🐛' },
        { label: 'My Tasks', to: '/my-tasks', icon: '✅' },
        { label: 'Settings', to: '/settings', icon: '⚙️' },
      ];
    }

    if (role === 'Developer') {
      return [
        { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
        { label: 'My Tasks', to: '/my-tasks', icon: '✅' },
        { label: 'Issues', to: '/issues', icon: '🐛' },
      ];
    }

    if (role === 'Tester') {
      return [
        { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
        { label: 'Create Issue', to: '/create-issue', icon: '➕' },
        { label: 'Verify Issue', to: '/verify-issues', icon: '🔍' },
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
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-auto shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <NavLink to="/dashboard" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          BugFlow
        </NavLink>
        <p className="text-sm text-gray-500 mt-1">Bug Tracking Made Simple</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
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
      </nav>

      {/* User Role Badge */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {role || 'User'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
