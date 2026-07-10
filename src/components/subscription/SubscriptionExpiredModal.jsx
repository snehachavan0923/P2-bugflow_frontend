import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SubscriptionExpiredModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('expired');
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    function handler(e) {
      if (role !== 'Owner') return;

      const msg = e?.detail?.message || 'Your subscription has expired.';
      const eventReason = e?.detail?.reason || 'expired';
      setMessage(msg);
      setReason(eventReason);
      setOpen(true);
    }

    window.addEventListener('subscriptionExpired', handler);

    return () => {
      window.removeEventListener('subscriptionExpired', handler);
    };
  }, [role]);

  if (!open || role !== 'Owner') return null;

  const isLimit = reason === 'limit';

    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-8">
            <h2 className="text-3xl font-bold text-slate-900">
            {isLimit ? "Upgrade Required" : "Subscription Expired"}
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-500">
            {message}
            </p>
        </div>

        {/* Divider */}
        <div className="mt-7 border-t border-slate-200" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-6">

            <button
            onClick={() => setOpen(false)}
            className="rounded-xl px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
            Maybe Later
            </button>

            <button
            onClick={() => {
                setOpen(false);
                navigate("/owner/subscription");
            }}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
            Upgrade Plan
            </button>

        </div>
        </div>
    </div>
    );
}
