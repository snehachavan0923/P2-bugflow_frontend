import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicNavbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
      isActive
        ? 'text-blue-700 after:absolute after:-bottom-[10px] after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-blue-600'
        : 'text-slate-600 hover:text-blue-700'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center rounded-xl px-3 py-2.5 text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 rounded-xl px-1 py-1.5 text-slate-900 transition-colors duration-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
            aria-label="BugFlow home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-[0_12px_28px_-18px_rgba(37,99,235,0.9)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9.5 7.25C9.5 5.87 10.62 4.75 12 4.75C13.38 4.75 14.5 5.87 14.5 7.25C14.5 8.63 13.38 9.75 12 9.75H9.5V7.25ZM9.5 9.75H12C14.76 9.75 17 11.99 17 14.75C17 17.51 14.76 19.75 12 19.75C9.24 19.75 7 17.51 7 14.75H9.5C9.5 16.13 10.62 17.25 12 17.25C13.38 17.25 14.5 16.13 14.5 14.75C14.5 13.37 13.38 12.25 12 12.25H9.5V9.75Z" fill="currentColor" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-900 sm:text-xl">BugFlow</span>
          </NavLink>

          <nav className="hidden items-center justify-center md:flex md:flex-1 md:justify-center" aria-label="Main navigation">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/90 px-1.5 py-1 shadow-sm shadow-slate-200/60">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/pricing" className={navLinkClass}>
                Pricing
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
            </div>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(37,99,235,0.8)] transition-all duration-200 hover:bg-blue-700 hover:shadow-[0_14px_32px_-14px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 shadow-lg shadow-slate-200/60 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/pricing" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </NavLink>
              <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                About
              </NavLink>

              <div className="mt-3 border-t border-slate-200 pt-3">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <NavLink
                      to="/login"
                      className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-[0_12px_28px_-16px_rgba(37,99,235,0.8)] transition-all duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </NavLink>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;