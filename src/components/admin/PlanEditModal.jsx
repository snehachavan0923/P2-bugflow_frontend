import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Palette, Layers3, Users, Bug } from 'lucide-react';

const accentOptions = [
  { value: 'indigo', label: 'Indigo' },
  { value: 'slate', label: 'Slate' },
  { value: 'violet', label: 'Violet' },
  { value: 'sky', label: 'Sky' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'rose', label: 'Rose' },
];

const PlanEditModal = ({ isOpen, onClose, plan, onSave, saving }) => {
  const [formData, setFormData] = useState({
    price: '',
    description: '',
    billingPeriod: 'month',
    durationDays: '',
    projectLimit: '',
    memberLimit: '',
    issueLimit: '',
    highlight: false,
    accentColor: 'indigo',
    features: [],
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        price: plan.price ?? '',
        description: plan.description ?? '',
        billingPeriod: plan.billingPeriod ?? 'month',
        durationDays: plan.durationDays ?? '',
        projectLimit: plan.projectLimit ?? '',
        memberLimit: plan.memberLimit ?? '',
        issueLimit: plan.issueLimit ?? '',
        highlight: Boolean(plan.highlight),
        accentColor: plan.accentColor ?? 'indigo',
        features: Array.isArray(plan.features) ? plan.features : [],
      });
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const handleFeatureAdd = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (formData.features.includes(trimmed)) return;
    setFormData((current) => ({ ...current, features: [...current.features, trimmed] }));
    setFeatureInput('');
  };

  const handleFeatureRemove = (feature) => {
    setFormData((current) => ({ ...current, features: current.features.filter((item) => item !== feature) }));
  };

  const moveFeature = (index, direction) => {
    const nextFeatures = [...formData.features];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextFeatures.length) return;
    [nextFeatures[index], nextFeatures[targetIndex]] = [nextFeatures[targetIndex], nextFeatures[index]];
    setFormData((current) => ({ ...current, features: nextFeatures }));
  };

  const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  return Number(value);
};

 const handleSubmit = (event) => {
  event.preventDefault();

  onSave({
    ...formData,
    price: toNullableNumber(formData.price),
    durationDays: toNullableNumber(formData.durationDays),
    projectLimit: toNullableNumber(formData.projectLimit),
    memberLimit: toNullableNumber(formData.memberLimit),
    issueLimit: toNullableNumber(formData.issueLimit),
  });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Plan Editor</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{plan.displayName || plan.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Billing period</label>
                  <input
                    type="text"
                    value={formData.billingPeriod}
                    onChange={(event) => setFormData((current) => ({ ...current, billingPeriod: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    placeholder="month"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Duration (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.durationDays}
                    onChange={(event) => setFormData((current) => ({ ...current, durationDays: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Layers3 className="h-4 w-4" /> Project limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.projectLimit}
                    onChange={(event) => setFormData((current) => ({ ...current, projectLimit: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Users className="h-4 w-4" /> Member limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.memberLimit}
                    onChange={(event) => setFormData((current) => ({ ...current, memberLimit: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Bug className="h-4 w-4" /> Issue limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.issueLimit}
                    onChange={(event) => setFormData((current) => ({ ...current, issueLimit: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Highlight this plan</span>
                  <input
                    type="checkbox"
                    checked={formData.highlight}
                    onChange={(event) => setFormData((current) => ({ ...current, highlight: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Palette className="h-4 w-4" /> Accent color</label>
                <select
                  value={formData.accentColor}
                  onChange={(event) => setFormData((current) => ({ ...current, accentColor: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                >
                  {accentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Features</p>
                <p className="mt-1 text-sm text-slate-600">Add, remove, or reorder the features shown on this plan card.</p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(event) => setFeatureInput(event.target.value)}
                  placeholder="Add a feature"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 sm:w-64"
                />
                <button
                  type="button"
                  onClick={handleFeatureAdd}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {formData.features.map((feature, index) => (
                <div key={`${feature}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-700">{feature}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveFeature(index, -1)}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFeature(index, 1)}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeatureRemove(feature)}
                      className="rounded-full border border-rose-200 p-2 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                      title="Remove feature"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEditModal;
