import React from 'react';
import { X, Building2, UserCircle2, CreditCard, CalendarDays, Layers3, Users, Bug } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const SubscriptionDetailModal = ({ isOpen, onClose, subscription }) => {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Subscription Details</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{subscription.organizationName || 'Subscription'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 className="h-4 w-4" /> Organization
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-950">{subscription.organizationName || 'Unknown'}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2"><UserCircle2 className="h-4 w-4" /> {subscription.ownerName || 'Unknown owner'}</div>
                <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> {subscription.plan || 'N/A'}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4" /> Billing details
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Subscription status</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Payment status</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.paymentStatus || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Start date</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatDate(subscription.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expiry date</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatDate(subscription.expiryDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-950">Current usage</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Layers3 className="h-4 w-4" /> Projects</div>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{subscription.currentProjects ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Users className="h-4 w-4" /> Members</div>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{subscription.currentMembers ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Bug className="h-4 w-4" /> Issues</div>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{subscription.currentIssues ?? 0}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Project limit</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.projectLimit ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Member limit</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.memberLimit ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Issue limit</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.issueLimit ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-950">Payment details</h3>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="text-slate-500">Transaction ID</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.transactionId || '—'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment method</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.paymentMethod || '—'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment date</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatDate(subscription.lastPaymentDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Amount</p>
                  <p className="mt-1 font-semibold text-slate-900">{subscription.amount ? `${subscription.currency || 'USD'} ${subscription.amount}` : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailModal;
