import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PricingPlans from '../../components/subscription/PricingPlans';
import { createSubscriptionPayment, getPaymentHistory, getSubscriptionOverview } from '../../api/subscriptionApi';
import { getAvailablePlans } from '../../api/subscriptionApi';
import LoaderWithMessage from '../../components/common/LoaderWithMessage';
const formatDate = (value) => {
  if (!value) return 'No expiry date';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatAmount = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState('');
  const [availablePlans, setAvailablePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionOverview();
      setSubscription(data);
      setError('');
    } catch (err) {
      setError('We could not load your subscription details right now.');
    } finally {
      setLoading(false);
    }
  };
  const loadAvailablePlans = async () => {
    try {
        setPlansLoading(true);

        const data = await getAvailablePlans();

        setAvailablePlans(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error(err);
    } finally {
        setPlansLoading(false);
    }
};
  const loadPaymentHistory = async () => {
    try {
      setPaymentsLoading(true);
      const data = await getPaymentHistory();
      setPayments(data);
    } catch (err) {
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

 useEffect(() => {
    loadSubscription();
    loadPaymentHistory();
    loadAvailablePlans();
}, []);

 const handlePlanSelect = (planName) => {
    const plan = availablePlans.find(
        (item) => item.name === planName
    );

    if (plan) {
        setSelectedPlan(plan);
    }
};

  const handlePayment = async () => {
    if (!selectedPlan) return;
    try {
      setPaymentProcessing(true);
      await createSubscriptionPayment(selectedPlan.name);
      setSelectedPlan(null);
      await Promise.all([loadSubscription(), loadPaymentHistory()]);
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'Your subscription has been activated successfully.',
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-3xl' },
      });
    } catch (err) {
      const backendMessage = err?.response?.data?.message || 'We could not process your payment. Please try again.';
      setError(backendMessage);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: backendMessage,
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-3xl' },
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const planName = subscription?.plan?.toUpperCase() || 'FREE';
  const status = subscription?.status?.toUpperCase() || 'ACTIVE';
  const projectLimit = subscription?.projectLimit ?? 1;
  const memberLimit = subscription?.memberLimit ?? 5;
  const issueLimit = subscription?.issueLimit ?? 100;
  const currentProjects = subscription?.currentProjects ?? 0;
  const currentMembers = subscription?.currentMembers ?? 0;
  const currentIssues = subscription?.currentIssues ?? 0;

  const usageItems = [
    {
      label: 'Projects',
      current: currentProjects,
      limit: projectLimit,
      suffix: projectLimit === null ? '' : ` / ${projectLimit}`,
      percent: projectLimit ? Math.min((currentProjects / projectLimit) * 100, 100) : 100,
    },
    {
      label: 'Members',
      current: currentMembers,
      limit: memberLimit,
      suffix: memberLimit === null ? '' : ` / ${memberLimit}`,
      percent: memberLimit ? Math.min((currentMembers / memberLimit) * 100, 100) : 100,
    },
    {
      label: 'Issues',
      current: currentIssues,
      limit: issueLimit,
      suffix: issueLimit === null ? '' : ` / ${issueLimit}`,
      percent: issueLimit ? Math.min((currentIssues / issueLimit) * 100, 100) : 100,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.10),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Organization Subscription</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Manage your plan and usage</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep your team on the right tier, review current limits, and update your plan instantly from here.
            </p>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            {loading ? 'Loading subscription…' : `${planName} • ${status}`}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Current Plan</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{planName}</h2>
              </div>
              <div className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
                {status}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{status}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Expiry Date</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(subscription?.endDate)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Plan Limits</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{projectLimit} Projects • {memberLimit} Members</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Current Usage</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Usage Overview</h2>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {usageItems.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">
                      {item.current}
                      {item.suffix}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Payment History</h2>
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {paymentsLoading ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">Loading payment history…</td></tr>
                  ) : payments.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No payments yet.</td></tr>
                  ) : payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(payment.paymentDate || payment.createdAt)}</td>
                      <td className="px-4 py-3 font-medium">{payment.plan}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatAmount(payment.amount, payment.currency)}</td>
                      <td className="px-4 py-3">{payment.paymentMethod}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.paymentStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{payment.paymentStatus}</span></td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      {plansLoading ? (
      <LoaderWithMessage message="Loading plans..." />
    ) : ( 
      <PricingPlans
        plans={availablePlans}
        mode="owner"
        currentPlan={planName}
        subscriptionStatus={status}
        onSelectPlan={handlePlanSelect}
      />
    )}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Confirm Purchase</h2>
            <dl className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3"><dt className="text-sm text-slate-500">Plan Name</dt><dd className="text-sm font-semibold text-slate-900">{selectedPlan.name}</dd></div>
              <div className="flex items-center justify-between px-4 py-3"><dt className="text-sm text-slate-500">Duration</dt><dd className="text-sm font-semibold text-slate-900">{selectedPlan.durationDays
              ? `${selectedPlan.durationDays} days`
              : "Custom"}
            </dd>
            </div>
              <div className="flex items-center justify-between px-4 py-3"><dt className="text-sm text-slate-500">Amount</dt><dd className="text-sm font-semibold text-slate-900">{selectedPlan.name === "ENTERPRISE"
                  ? "Contact Sales"
                  : formatAmount(
                  selectedPlan.price,
                  selectedPlan.currency
              )}</dd></div>
              <div className="flex items-center justify-between px-4 py-3"><dt className="text-sm text-slate-500">Payment Method</dt><dd className="text-sm font-semibold text-slate-900">MANUAL</dd></div>
            </dl>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedPlan(null)} disabled={paymentProcessing} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={handlePayment} disabled={paymentProcessing} className="inline-flex min-w-28 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
                {paymentProcessing ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Processing…</> : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
