import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Swal from 'sweetalert2';

import LoaderWithMessage from '../../components/common/LoaderWithMessage';
import { getAdminRevenueDashboard } from '../../api/adminSubscriptionApi';

const planOptions = [
  { value: '', label: 'All plans' },
  { value: 'FREE', label: 'Free' },
  { value: 'STARTER', label: 'Starter' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const COLORS = ['#4f46e5', '#0ea5e9', '#14b8a6', '#f97316', '#d946ef'];

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const RevenueAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAdminRevenueDashboard({
        plan: planFilter,
        from: fromDate,
        to: toDate,
      });
      setDashboard(response || {});
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || 'Unable to load revenue analytics.';
      setError(message);
      Swal.fire({
        icon: 'error',
        title: 'Unable to load analytics',
        text: message,
        confirmButtonText: 'Retry',
        customClass: { popup: 'rounded-3xl' },
      });
    } finally {
      setLoading(false);
    }
  }, [fromDate, planFilter, toDate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const stats = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        label: 'Total Revenue',
        value: formatCurrency(dashboard.totalRevenue),
      },
      {
        label: 'Monthly Revenue',
        value: formatCurrency(dashboard.monthlyRevenue),
      },
      {
        label: 'Today Renewals',
        value: dashboard.renewalsToday ?? 0,
      },
      {
        label: 'This Week Renewals',
        value: dashboard.renewalsThisWeek ?? 0,
      },
      {
        label: 'Active Subscriptions',
        value: dashboard.activeSubscriptions ?? 0,
      },
      {
        label: 'Expired Subscriptions',
        value: dashboard.expiredSubscriptions ?? 0,
      },
    ];
  }, [dashboard]);

  const monthlyRevenueData = useMemo(() => {
    return dashboard?.monthlyRevenueChart?.map((item) => ({
      ...item,
      value: Number(item.value) || 0,
    })) || [];
  }, [dashboard]);

  const revenueByPlanData = useMemo(() => {
    return dashboard?.revenueByPlan?.map((item) => ({
      ...item,
      value: Number(item.value) || 0,
    })) || [];
  }, [dashboard]);

  const planDistributionData = useMemo(() => {
    return dashboard?.planDistribution?.map((item) => ({
      name: item.plan,
      value: Number(item.count) || 0,
    })) || [];
  }, [dashboard]);

  const renewalsTrendData = useMemo(() => {
    return dashboard?.renewalsTrend?.map((item) => ({
      ...item,
      renewals: Number(item.renewals) || 0,
    })) || [];
  }, [dashboard]);

  const hasOverviewData = stats.length > 0 && dashboard;
  const hasChartData = monthlyRevenueData.length > 0 || revenueByPlanData.length > 0 || renewalsTrendData.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Platform Administration</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Revenue Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Live revenue analytics from the backend. Filter by plan and date window to focus your insights.
            </p>
          </div>
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            {loading ? 'Refreshing analytics…' : 'Live data '}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,1fr)]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Plan</label>
              <select
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              >
                {planOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="mt-6 flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <LoaderWithMessage message="Loading revenue analytics..." />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
            {error}
          </div>
        ) : !hasOverviewData ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">No analytics data available</h2>
            <p className="mt-2 text-sm text-slate-600">Try selecting a wider date range or clearing the plan filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
                  <h2 className="text-xl font-semibold text-slate-900">Revenue over time</h2>
                </div>
                <div className="p-6">
                  {monthlyRevenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 16 }} />
                        <Line type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-slate-50">
                      <p className="text-slate-500">No revenue timeline data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-sm font-medium text-slate-500">Revenue by Plan</p>
                  <h2 className="text-xl font-semibold text-slate-900">Compare plan earnings</h2>
                </div>
                <div className="p-6">
                  {revenueByPlanData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByPlanData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                        />
                        <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-slate-50">
                      <p className="text-slate-500">No plan revenue data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-sm font-medium text-slate-500">Renewals Trend</p>
                  <h2 className="text-xl font-semibold text-slate-900">Renewals over time</h2>
                </div>
                <div className="p-6">
                  {renewalsTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={renewalsTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 16 }} />
                        <Line type="monotone" dataKey="renewals" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Renewals" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-slate-50">
                      <p className="text-slate-500">No renewals trend data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <p className="text-sm font-medium text-slate-500">Plan Distribution</p>
                  <h2 className="text-xl font-semibold text-slate-900">Active subscriptions by plan</h2>
                </div>
                <div className="p-6">
                  {planDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={planDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={50}
                          paddingAngle={4}
                          label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                        >
                          {planDistributionData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-slate-50">
                      <p className="text-slate-500">No plan distribution data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
