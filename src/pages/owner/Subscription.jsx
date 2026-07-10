import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PricingPlans from '../../components/subscription/PricingPlans';
import { getSubscriptionOverview, upgradeSubscription } from '../../api/subscriptionApi';

const formatDate = (value) => {
  if (!value) return 'No expiry date';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

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

  useEffect(() => {
    loadSubscription();
  }, []);

  const handlePlanSelect = async (planName) => {
    const currentPlan = (subscription?.plan || 'FREE').toUpperCase();
    const isDowngrade = ['STARTER', 'BUSINESS', 'ENTERPRISE'].includes(planName) && currentPlan !== 'FREE'
      ? ['STARTER', 'BUSINESS', 'ENTERPRISE'].indexOf(planName) < ['STARTER', 'BUSINESS', 'ENTERPRISE'].indexOf(currentPlan)
      : false;

    const confirmed = await Swal.fire({
      title: isDowngrade ? `Downgrade to ${planName}?` : `Upgrade to ${planName}?`,
      text: isDowngrade
        ? 'Current limits will decrease. Continue?'
        : 'Your subscription will change immediately.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isDowngrade ? 'Downgrade' : 'Upgrade',
      cancelButtonText: 'Cancel',
      customClass: { popup: 'rounded-3xl' },
    });

    if (!confirmed.isConfirmed) return;

    try {
      setLoadingPlan(planName);
      await upgradeSubscription(planName);
      await loadSubscription();
      Swal.fire({
        icon: 'success',
        title: 'Subscription updated successfully',
        text: `Your plan was changed to ${planName}.`,
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-3xl' },
      });
    } catch (err) {
      const backendMessage = err?.response?.data?.message || 'We could not update your plan. Please try again.';
      setError(backendMessage);
      Swal.fire({
        icon: 'error',
        title: 'Plan change failed',
        text: backendMessage,
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-3xl' },
      });
    } finally {
      setLoadingPlan(null);
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

        <PricingPlans mode="owner" currentPlan={planName} onSelectPlan={handlePlanSelect} loadingPlan={loadingPlan} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Billing center</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Invoice history and payment controls are being prepared for this workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Plan changes update the backend directly.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Subscription;
