import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionExpiredModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e) {
      const msg = e?.detail?.message || 'Your subscription has expired.';
      setMessage(msg);
      setOpen(true);
    }

    window.addEventListener('subscriptionExpired', handler);

    return () => {
      window.removeEventListener('subscriptionExpired', handler);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 z-10">
        <h3 className="text-xl font-semibold mb-2">Your subscription has expired</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{message || 'Upgrade your subscription to continue creating projects, inviting members and managing new issues.'}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-transparent text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            Maybe Later
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              setOpen(false);
              navigate('/organization/subscription');
            }}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
