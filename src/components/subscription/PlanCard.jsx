import React from "react";
import { useNavigate } from "react-router-dom";

const accentStyles = {
  slate: {
    border: "border-slate-300",
    shadow: "shadow-slate-200/70",
    badge: "bg-slate-900 text-white",
    button: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20",
    hover: "hover:border-slate-400 hover:text-slate-700",
    chip: "bg-slate-100 text-slate-700",
    check: "bg-slate-100 text-slate-700",
  },
  indigo: {
    border: "border-indigo-200",
    shadow: "shadow-indigo-100/70",
    badge: "bg-indigo-600 text-white",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25",
    hover: "hover:border-indigo-400 hover:text-indigo-600",
    chip: "bg-indigo-50 text-indigo-700",
    check: "bg-indigo-100 text-indigo-600",
  },
  emerald: {
    border: "border-emerald-200",
    shadow: "shadow-emerald-100/70",
    badge: "bg-emerald-600 text-white",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25",
    hover: "hover:border-emerald-400 hover:text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700",
    check: "bg-emerald-100 text-emerald-600",
  },
  violet: {
    border: "border-violet-200",
    shadow: "shadow-violet-100/70",
    badge: "bg-violet-600 text-white",
    button: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/25",
    hover: "hover:border-violet-400 hover:text-violet-600",
    chip: "bg-violet-50 text-violet-700",
    check: "bg-violet-100 text-violet-600",
  },
  rose: {
    border: "border-rose-200",
    shadow: "shadow-rose-100/70",
    badge: "bg-rose-600 text-white",
    button: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25",
    hover: "hover:border-rose-400 hover:text-rose-600",
    chip: "bg-rose-50 text-rose-700",
    check: "bg-rose-100 text-rose-600",
  },
  sky: {
    border: "border-sky-200",
    shadow: "shadow-sky-100/70",
    badge: "bg-sky-600 text-white",
    button: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25",
    hover: "hover:border-sky-400 hover:text-sky-600",
    chip: "bg-sky-50 text-sky-700",
    check: "bg-sky-100 text-sky-600",
  },
};

const planOrder = {
  FREE: 0,
  STARTER: 1,
  BUSINESS: 2,
  ENTERPRISE: 3,
};

const PlanCard = ({
  plan,
  mode = "public",
  currentPlan = "FREE",
  subscriptionStatus = "ACTIVE",
  onSelectPlan,
  loadingPlan,
}) => {
  const navigate = useNavigate();

  const accent =
    accentStyles[plan?.accentColor?.toLowerCase()] || accentStyles.indigo;

  const normalizedCurrentPlan = currentPlan?.toUpperCase();

  const isCurrentPlan = normalizedCurrentPlan === plan.name;

  const isCurrentPlanExpired =
    isCurrentPlan &&
    subscriptionStatus?.toUpperCase() === "EXPIRED";

  const isRecommended = plan.highlight;

  const currentRank = planOrder[normalizedCurrentPlan] ?? 0;

  const targetRank = planOrder[plan.name] ?? 0;

  const isDisabled =
    (isCurrentPlan && !isCurrentPlanExpired) ||
    loadingPlan === plan.name ||
    (mode === "owner" && plan.name === "ENTERPRISE");

  const getButtonLabel = () => {
    if (mode === "owner") {
      if (isCurrentPlanExpired) return "Renew Plan";
      if (isCurrentPlan) return "Current Plan";
      if (plan.name === "ENTERPRISE") return "Contact Sales";
      if (targetRank > currentRank) return "Upgrade Plan";
      return "Downgrade Plan";
    }

    if (plan.name === "ENTERPRISE") return "Contact Sales";

    return "Get Started";
  };

  const getButtonStyle = () => {
    if (isCurrentPlan)
      return "bg-slate-900 text-white shadow-lg shadow-slate-900/20";

    if (isRecommended)
      return `${accent.button} shadow-lg`;

    return `border border-slate-200 bg-white text-slate-700 ${accent.hover}`;
  };

  return (
    <article
      className={`group rounded-2xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isRecommended
          ? `${accent.border} shadow-xl ${accent.shadow}`
          : "border-slate-200 shadow-lg shadow-slate-200/60"
      }`}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {plan.name}
        </p>

        {isRecommended && (
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${accent.badge}`}
          >
            Recommended
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-4xl font-semibold text-slate-950">
          {plan.price == null
            ? "Contact Sales"
            : new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: plan.currency || "INR",
                maximumFractionDigits: 0,
              }).format(plan.price)}
        </h3>

        {plan.billingPeriod && (
          <p className="mt-2 text-sm text-slate-500">
            {plan.billingPeriod === "MONTHLY"
              ? "/month"
              : plan.billingPeriod === "YEARLY"
              ? "/year"
              : plan.billingPeriod}
          </p>
        )}

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {plan.description}
        </p>
      </div>

      {/* Colored Feature Chips */}

      <div className="mt-6 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}
        >
          {plan.projectLimit == null ? "Unlimited" : plan.projectLimit} Projects
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}
        >
          {plan.memberLimit == null ? "Unlimited" : plan.memberLimit} Members
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${accent.chip}`}
        >
       {plan.issueLimit == null ? "Unlimited" : plan.issueLimit} Issues
        </span>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features?.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-slate-700"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${accent.check}`}
            >
              ✓
            </span>

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          if (plan.name === "ENTERPRISE") return;

          if (mode === "public") {
            navigate("/login");
            return;
          }

          if (!onSelectPlan || isDisabled) return;

          onSelectPlan(plan.name);
        }}
        disabled={isDisabled}
        className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${getButtonStyle()} ${
          isDisabled ? "cursor-not-allowed opacity-80" : ""
        }`}
      >
        {loadingPlan === plan.name ? "Updating..." : getButtonLabel()}
      </button>
    </article>
  );
};

export default PlanCard;