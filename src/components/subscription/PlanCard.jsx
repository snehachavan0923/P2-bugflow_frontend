import React from 'react';
import { useNavigate } from 'react-router-dom';

const planOrder = {
  FREE: 0,
  STARTER: 1,
  BUSINESS: 2,
  ENTERPRISE: 3,
};

const PlanCard = ({ plan, mode = 'public', currentPlan = 'FREE', subscriptionStatus = 'ACTIVE', onSelectPlan, loadingPlan }) => {
  const normalizedCurrentPlan = currentPlan?.toUpperCase();
  const isCurrentPlan = normalizedCurrentPlan === plan.name;
  const isCurrentPlanExpired = isCurrentPlan && subscriptionStatus?.toUpperCase() === 'EXPIRED';
  const navigate = useNavigate();
  const isRecommended = plan.highlight;
  const currentRank = planOrder[normalizedCurrentPlan] ?? 0;
  const targetRank = planOrder[plan.name] ?? 0;

  const getButtonLabel = () => {
    if (mode === 'owner') {
      if (isCurrentPlanExpired) return 'Renew Plan';
      if (isCurrentPlan) return 'Current Plan';
      if (plan.name === 'ENTERPRISE') return 'Contact Sales';
      if (targetRank > currentRank) return 'Upgrade Plan';
      return 'Downgrade Plan';
    }

    if (plan.name === 'ENTERPRISE') return 'Contact Sales';
    return 'Get Started';
  };

  const getButtonStyle = () => {
    if (isCurrentPlan) {
      return 'bg-slate-900 text-white shadow-lg shadow-slate-900/20';
    }

    if (isRecommended) {
      return 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/25';
    }

    return 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600';
  };

  const isDisabled = (isCurrentPlan && !isCurrentPlanExpired)
    || loadingPlan === plan.name
    || (mode === 'owner' && plan.name === 'ENTERPRISE');

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isRecommended ? 'border-indigo-200 shadow-xl shadow-indigo-100/70' : 'border-slate-200 shadow-lg shadow-slate-200/60'
      }`}
    >
      {isRecommended && (
        <div className="absolute right-5 top-5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Recommended
        </div>
      )}

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{plan.name}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-950">{plan.price}</h3>
          {plan.billingPeriod && (
            <p className="mt-2 text-sm text-slate-500">{plan.billingPeriod}</p>
          )}
          <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            if (plan.name === 'ENTERPRISE') return;

            if (mode === 'public') {
              navigate('/login');
              return;
            }

            if (!onSelectPlan || isDisabled) return;
            onSelectPlan(plan.name);
          }}
          disabled={isDisabled}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${getButtonStyle()} ${isDisabled ? 'cursor-not-allowed opacity-80' : ''}`}
        >
          {loadingPlan === plan.name ? 'Updating…' : getButtonLabel()}
        </button>
      </div>
    </article>
  );
};

export default PlanCard;
