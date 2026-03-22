import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicNavbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            BugFlow
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`
              }
            >
              About
            </NavLink>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-6 py-2 rounded-lg font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`
                }
                end
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="px-4 py-2 rounded-lg font-medium text-indigo-600 hover:bg-indigo-50 transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </NavLink>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
