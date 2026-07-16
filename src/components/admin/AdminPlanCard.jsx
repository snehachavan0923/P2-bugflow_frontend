import React from 'react';
import { Sparkles, PencilLine, CheckCircle2, CircleOff, Layers3, Users, Bug, Palette } from 'lucide-react';

const accentStyles = {
  slate: {
    chip: 'bg-slate-100 text-slate-700',
    ring: 'ring-slate-200',
    badge: 'bg-slate-900 text-white',
  },
  indigo: {
    chip: 'bg-indigo-50 text-indigo-700',
    ring: 'ring-indigo-200',
    badge: 'bg-indigo-600 text-white',
  },
  violet: {
    chip: 'bg-violet-50 text-violet-700',
    ring: 'ring-violet-200',
    badge: 'bg-violet-600 text-white',
  },
  sky: {
    chip: 'bg-sky-50 text-sky-700',
    ring: 'ring-sky-200',
    badge: 'bg-sky-600 text-white',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700',
    ring: 'ring-emerald-200',
    badge: 'bg-emerald-600 text-white',
  },
  rose: {
    chip: 'bg-rose-50 text-rose-700',
    ring: 'ring-rose-200',
    badge: 'bg-rose-600 text-white',
  },
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatDuration = (days) => {
  if (!days) return 'Custom billing';
  if (days === 30) return '1 month';
  if (days === 90) return '3 months';
  if (days === 365) return '1 year';
  return `${days} days`;
};

const AdminPlanCard = ({ plan, onEdit }) => {
  const accent = accentStyles[plan?.accentColor] || accentStyles.indigo;
  const featureLimit = 4;
  const visibleFeatures = (plan?.features || []).slice(0, featureLimit);
  const hiddenCount = Math.max(0, (plan?.features || []).length - featureLimit);

  return (
    <article className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-30px_rgba(79,70,229,0.35)] ${plan?.highlight ? 'ring-2 ' + accent.ring : ''}`}>
      {plan?.highlight && (
        <div className={`absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${accent.badge}`}>
          <Sparkles className="h-3.5 w-3.5" />
          Highlighted
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {plan?.displayName || plan?.name || 'Plan'}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {plan?.name || 'Unnamed Plan'}
            </h3>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${plan?.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {plan?.active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleOff className="h-3.5 w-3.5" />}
            {plan?.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-slate-950">{formatCurrency(plan?.price)}</span>
            <span className="text-sm text-slate-500">/{plan?.billingPeriod || 'month'}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Duration: {formatDuration(plan?.durationDays)}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{plan?.description || 'No description provided.'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}>
            <Layers3 className="h-4 w-4" />
            {plan.projectLimit == null ? "Unlimited" : plan.projectLimit} Projects
          </span>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}>
            <Users className="h-4 w-4" />
          {plan?.memberLimit == null ? "Unlimited" : plan.memberLimit} Members
          </span>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}>
            <Bug className="h-4 w-4" />
            {plan?.issueLimit == null ? "Unlimited" : plan.issueLimit} Issues
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Palette className="h-4 w-4" />
            Accent color
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-600 capitalize">{plan?.accentColor || 'indigo'}</span>
            <span className={`h-3.5 w-3.5 rounded-full ${plan?.accentColor === 'slate' ? 'bg-slate-700' : plan?.accentColor === 'violet' ? 'bg-violet-600' : plan?.accentColor === 'sky' ? 'bg-sky-600' : plan?.accentColor === 'emerald' ? 'bg-emerald-600' : plan?.accentColor === 'rose' ? 'bg-rose-600' : 'bg-indigo-600'}`} />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Features</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{(plan?.features || []).length} included</p>
          </div>
          <ul className="space-y-2">
            {visibleFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-sm text-slate-500">+{hiddenCount} more feature{hiddenCount > 1 ? 's' : ''}</li>
            )}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          <PencilLine className="h-4 w-4" />
          Edit plan
        </button>
      </div>
    </article>
  );
};

export default AdminPlanCard;
