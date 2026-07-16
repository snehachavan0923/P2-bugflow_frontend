import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import LoaderWithMessage from '../../components/common/LoaderWithMessage';
import SubscriptionDetailModal from '../../components/admin/SubscriptionDetailModal';
import SubscriptionStatCard from '../../components/admin/SubscriptionStatCard';
import { getAdminSubscriptions, getAdminSubscriptionDetail, getAdminRevenueDashboard } from '../../api/adminSubscriptionApi';

const PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, totalElements: 0 });
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadData = useCallback(async (nextPage = 0, filters = { search: searchTerm, plan: planFilter, status: statusFilter, paymentStatus: paymentFilter }) => {
    try {
      setLoading(true);
      setError('');
      const [pageData, revenueData] = await Promise.all([
        getAdminSubscriptions({
          search: filters.search,
          plan: filters.plan,
          status: filters.status,
          paymentStatus: filters.paymentStatus,
          page: nextPage,
          size: PAGE_SIZE,
        }),
        getAdminRevenueDashboard(),
      ]);
      setSubscriptions(Array.isArray(pageData?.content) ? pageData.content : []);
      setPageInfo({
        totalPages: pageData?.totalPages || 1,
        totalElements: pageData?.totalElements || 0,
      });
      setDashboard(revenueData || {});
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to load subscription data right now.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, planFilter, statusFilter, paymentFilter]);

  useEffect(() => {
    loadData(0);
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(0, { search: searchTerm, plan: planFilter, status: statusFilter, paymentStatus: paymentFilter });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, planFilter, statusFilter, paymentFilter, loadData]);

  const openDetails = async (subscriptionId) => {
    try {
      const data = await getAdminSubscriptionDetail(subscriptionId);
      setSelectedSubscription(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Unable to load subscription',
        text: err?.response?.data?.message || 'We could not load the subscription details.',
        confirmButtonText: 'Try again',
        customClass: { popup: 'rounded-3xl' },
      });
    }
  };

  const stats = useMemo(() => {
    const stats = [
      { label: 'Total Subscriptions', value: dashboard.totalSubscriptions ?? pageInfo.totalElements, accent: 'indigo' },
      { label: 'Active', value: dashboard.activeSubscriptions ?? 0, accent: 'emerald' },
      { label: 'Expired', value: dashboard.expiredSubscriptions ?? 0, accent: 'rose' },
      { label: 'Free', value: dashboard.freePlanCount ?? 0, accent: 'slate' },
      { label: 'Starter', value: dashboard.starterPlanCount ?? 0, accent: 'sky' },
      { label: 'Business', value: dashboard.businessPlanCount ?? 0, accent: 'violet' },
    ];
    if (dashboard.enterprisePlanCount !== undefined && dashboard.enterprisePlanCount !== null) {
      stats.push({ label: 'Enterprise', value: dashboard.enterprisePlanCount, accent: 'purple' });
    }
    stats.push(
      { label: 'Monthly Revenue', value: formatCurrency(dashboard.monthlyRevenue), accent: 'indigo' },
      { label: 'Total Revenue', value: formatCurrency(dashboard.totalRevenue), accent: 'emerald' },
      { label: 'Renewals Today', value: dashboard.renewalsToday ?? 0, accent: 'amber' },
      { label: 'Renewals This Week', value: dashboard.renewalsThisWeek ?? 0, accent: 'cyan' }
    );
    return stats;
  }, [dashboard, pageInfo.totalElements]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Platform Administration</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Subscription Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review every organization subscription, track billing status, and view plan usage without leaving the admin console.
            </p>
          </div>
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            {loading ? 'Loading subscriptions…' : `${pageInfo.totalElements} subscriptions`}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => (
            <SubscriptionStatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search organization, owner, or email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <select value={planFilter} onChange={(event) => setPlanFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50">
                <option value="">All plans</option>
                <option value="FREE">Free</option>
                <option value="STARTER">Starter</option>
                <option value="BUSINESS">Business</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50">
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
              </select>
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50">
                <option value="">All payments</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <LoaderWithMessage message="Loading subscriptions..." />
            </div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
              {error}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">No subscriptions match your filters</h2>
              <p className="mt-2 text-sm text-slate-600">Try broadening the search or clearing one of the filters to see more results.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Organization</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Subscription Status</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">Expiry Date</th>
                    <th className="px-4 py-3">Days Remaining</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{subscription.organizationName || 'Unknown'}</td>
                      <td className="px-4 py-4 text-slate-600">{subscription.ownerName || 'Unknown'}</td>
                      <td className="px-4 py-4 text-slate-600">{subscription.plan || '—'}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${subscription.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {subscription.status || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${subscription.paymentStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : subscription.paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {subscription.paymentStatus || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{formatCurrency(subscription.amount)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(subscription.startDate)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(subscription.expiryDate)}</td>
                      <td className="px-4 py-4 text-slate-600">{subscription.daysRemaining ?? '—'}</td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => openDetails(subscription.id)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600">
                          <Eye className="h-4 w-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && subscriptions.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing page {page + 1} of {Math.max(1, pageInfo.totalPages)} • {pageInfo.totalElements} total subscriptions
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => loadData(Math.max(0, page - 1))} disabled={page === 0} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button type="button" onClick={() => loadData(page + 1)} disabled={page + 1 >= pageInfo.totalPages} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SubscriptionDetailModal isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} subscription={selectedSubscription} />
    </div>
  );
};

export default SubscriptionManagement;