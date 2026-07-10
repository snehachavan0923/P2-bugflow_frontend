import React from 'react';
import PricingPlans from '../../components/subscription/PricingPlans';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.10),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f8fafc_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
       <PricingPlans mode="public" />

        <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
          <h2 className="text-center text-2xl font-semibold text-slate-950">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              {
                question: 'Can I change plans anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
              },
              {
                question: 'Do you offer discounts for non-profits?',
                answer: 'Yes, we offer special pricing for educational institutions and non-profit organizations.',
              },
            ].map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;