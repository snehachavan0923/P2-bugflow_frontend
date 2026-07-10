import React from 'react';
import { subscriptionPlans } from '../../constants/subscriptionPlans';
import PlanCard from './PlanCard';

const PricingPlans = ({ mode = 'public', currentPlan = 'FREE', onSelectPlan, loadingPlan }) => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Flexible plans for every stage
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Choose the plan that fits your team
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Built for modern product teams that need clarity, speed, and calm collaboration.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-4">
          {subscriptionPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              mode={mode}
              currentPlan={currentPlan}
              onSelectPlan={onSelectPlan}
              loadingPlan={loadingPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
