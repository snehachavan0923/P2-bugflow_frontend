import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import LoaderWithMessage from '../../components/common/LoaderWithMessage';
import AdminPlanCard from '../../components/admin/AdminPlanCard';
import PlanEditModal from '../../components/admin/PlanEditModal';
import { getAdminPlans, updateAdminPlan } from '../../api/adminPlanApi';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to load plans right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const stats = useMemo(() => {
    const activeCount = plans.filter((plan) => plan?.active).length;
    const inactiveCount = plans.length - activeCount;
    return {
      total: plans.length,
      active: activeCount,
      inactive: inactiveCount,
    };
  }, [plans]);

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSavePlan = async (payload) => {
    if (!selectedPlan?.id) return;

    try {
      setSaving(true);
      const updatedPlan = await updateAdminPlan(selectedPlan.id, {
        ...selectedPlan,
        ...payload,
        id: selectedPlan.id,
      });

      setPlans((current) => current.map((plan) => (plan.id === selectedPlan.id ? updatedPlan : plan)));
      closeEditModal();
      Swal.fire({
        icon: 'success',
        title: 'Plan updated',
        text: `${updatedPlan.displayName || updatedPlan.name} was updated successfully.`,
        confirmButtonText: 'Done',
        customClass: { popup: 'rounded-3xl' },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err?.response?.data?.message || 'The plan could not be updated.',
        confirmButtonText: 'Try again',
        customClass: { popup: 'rounded-3xl' },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Platform Administration</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Plan Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review every subscription plan from the backend and update its pricing, limits, and feature set in one place.
            </p>
          </div>
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            {loading ? 'Loading plans…' : `${plans.length} plan${plans.length === 1 ? '' : 's'}`} 
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total plans</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.total}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active plans</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-600">{stats.active}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Inactive plans</p>
            <p className="mt-3 text-3xl font-semibold text-slate-700">{stats.inactive}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <LoaderWithMessage message="Loading subscription plans..." />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-rose-700">Unable to load plan data</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-950">No plans found</p>
            <p className="mt-2 text-sm text-slate-600">No subscription plans are available from the admin API yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {plans.map((plan) => (
              <AdminPlanCard key={plan.id} plan={plan} onEdit={openEditModal} />
            ))}
          </div>
        )}
      </div>

      <PlanEditModal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        plan={selectedPlan}
        onSave={handleSavePlan}
        saving={saving}
      />
    </div>
  );
};

export default PlanManagement;