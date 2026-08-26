import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  X,
  Building2,
  FolderKanban,
  Users,
} from 'lucide-react';
import PricingPlans from '../../components/subscription/PricingPlans';
import { createSubscriptionPayment, getPaymentHistory, getSubscriptionOverview, getAvailablePlans } from '../../api/subscriptionApi';
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
    const plan = availablePlans.find((item) => item.name === planName);
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
      const backendMessage =
        err?.response?.data?.message || 'We could not process your payment. Please try again.';
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
      icon: FolderKanban,
      suffix: projectLimit === null ? '' : ` / ${projectLimit}`,
      percent: projectLimit ? Math.min((currentProjects / projectLimit) * 100, 100) : 100,
    },
    {
      label: 'Members',
      current: currentMembers,
      limit: memberLimit,
      icon: Users,
      suffix: memberLimit === null ? '' : ` / ${memberLimit}`,
      percent: memberLimit ? Math.min((currentMembers / memberLimit) * 100, 100) : 100,
    },
    {
      label: 'Issues',
      current: currentIssues,
      limit: issueLimit,
      icon: AlertCircle,
      suffix: issueLimit === null ? '' : ` / ${issueLimit}`,
      percent: issueLimit ? Math.min((currentIssues / issueLimit) * 100, 100) : 100,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading subscription overview..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Header Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Organization Billing & Plan
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Subscription & Billing
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage your plan tier, monitor resource limits, review payment history, and upgrade seamlessy.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              {`${planName} • ${status}`}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50/50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Current Plan & Usage Overview Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Plan Overview Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Active Tier</h2>
                  <p className="text-xs font-medium text-slate-500">Current plan subscription details</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                {planName}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{status}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiry Date</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{formatDate(subscription?.endDate)}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Limits Summary</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{projectLimit} Projects • {memberLimit} Members</p>
              </div>
            </div>
          </div>

          {/* Usage Overview Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50 p-2.5 text-emerald-700">
                <FolderKanban className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Usage Tracking</h2>
                <p className="text-xs font-medium text-slate-500">Allocated resource consumption</p>
              </div>
            </div>

            <div className="space-y-4">
              {usageItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold text-slate-950">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {item.current}
                        {item.suffix}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full border border-slate-200/60 bg-white p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Payment History</h2>
              <p className="text-xs font-medium text-slate-500">Billing transactions & receipts</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        Loading payment history…
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        No payments logged yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="transition-colors hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600 font-medium">
                          {formatDate(payment.paymentDate || payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-950">{payment.plan}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{payment.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${payment.paymentStatus === 'SUCCESS'
                              ? 'border-emerald-200/60 bg-emerald-50 text-emerald-700'
                              : 'border-rose-200/60 bg-rose-50 text-rose-700'
                              }`}
                          >
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 border border-slate-200/80">
                            {payment.transactionId || '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pricing Plans Section */}
        {plansLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center bg-slate-50">
            <LoaderWithMessage message="Loading plans..." />
          </div>
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

      {/* Confirm Purchase Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-blue-100/80 bg-blue-50 p-2.5 text-blue-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-950">Confirm Purchase</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 divide-y divide-slate-100 rounded-[24px] border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Plan Name</span>
                <span className="text-sm font-semibold text-slate-950">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</span>
                <span className="text-sm font-semibold text-slate-950">
                  {selectedPlan.durationDays ? `${selectedPlan.durationDays} days` : 'Custom'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</span>
                <span className="text-sm font-bold text-blue-600">
                  {selectedPlan.name === 'ENTERPRISE'
                    ? 'Contact Sales'
                    : formatAmount(selectedPlan.price, selectedPlan.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payment Method</span>
                <span className="text-sm font-semibold text-slate-950">MANUAL</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                disabled={paymentProcessing}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="inline-flex min-w-28 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paymentProcessing ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing…
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;

