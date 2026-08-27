import React, { useState } from 'react';
import { ChevronDown, LogOut, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitial = () => {
    if (!user) return 'U';
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(15,23,42,0.05)]">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Workspace Title & Brand Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20 sm:hidden">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex">
              <span className="font-bold tracking-tight text-slate-900">BugFlow</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                Workspace
              </span>
            </div>
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 pr-3.5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-600/25">
                  {getInitial()}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-slate-950">
                    {user.name || user.email}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-blue-600">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* Elevated Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.22)] z-50">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                        {getInitial()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {user.name || 'User'}
                        </p>
                        <p className="truncate text-xs font-medium text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
                      <span className="text-slate-500">Role</span>
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 pt-1">
                    {user.role === 'Owner' && (
                      <div className="px-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Profile
                        </Link>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop overlay for closing dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;