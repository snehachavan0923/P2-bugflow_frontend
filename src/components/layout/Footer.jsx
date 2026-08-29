import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid gap-8 border-b border-slate-800 pb-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-white transition-colors hover:text-blue-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-lg shadow-blue-500/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9.5 7.25C9.5 5.87 10.62 4.75 12 4.75C13.38 4.75 14.5 5.87 14.5 7.25C14.5 8.63 13.38 9.75 12 9.75H9.5V7.25ZM9.5 9.75H12C14.76 9.75 17 11.99 17 14.75C17 17.51 14.76 19.75 12 19.75C9.24 19.75 7 17.51 7 14.75H9.5C9.5 16.13 10.62 17.25 12 17.25C13.38 17.25 14.5 16.13 14.5 14.75C14.5 13.37 13.38 12.25 12 12.25H9.5V9.75Z" fill="currentColor" />
                </svg>
              </span>
              BugFlow
            </Link>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Modern bug tracking and team collaboration
              for software development teams.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 transition-colors hover:text-white">About</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 transition-colors hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 transition-colors hover:text-white">Login</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Dashboard</span></li>
              <li><span className="text-slate-400">Projects</span></li>
              <li><span className="text-slate-400">Team Management</span></li>
              <li><span className="text-slate-400">Reports</span></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/snehachavan29"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

      <div className="flex items-center justify-center pt-5 text-sm text-slate-400">
        <p>© 2026 BugFlow. All rights reserved.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;