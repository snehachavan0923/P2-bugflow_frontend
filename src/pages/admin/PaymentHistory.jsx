import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  IndianRupee,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";

import LoaderWithMessage from "../../components/common/LoaderWithMessage";

import {
  getAdminPayments,
  getRevenueDashboard,
} from "../../api/adminPaymentApi";

const PAGE_SIZE = 10;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [plan, setPlan] = useState("");

  const [status, setStatus] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(0);

  const [size] = useState(PAGE_SIZE);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  /* ------------------------------------------ */
  /* Helpers                                    */
  /* ------------------------------------------ */

  const formatCurrency = (amount) => {
    if (amount == null) return "₹0";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const paymentBadge = (paymentStatus) => {
    switch ((paymentStatus || "").toUpperCase()) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  /* ------------------------------------------ */
  /* Load Dashboard                             */
  /* ------------------------------------------ */

  const loadDashboard = async () => {
    try {
      const data = await getRevenueDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------------------------------ */
  /* Load Payments                              */
  /* ------------------------------------------ */

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdminPayments({
        search,
        plan,
        status,
        from: fromDate,
        to: toDate,
        page,
        size,
      });

      setPayments(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(data.totalElements || 0);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load payment history."
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Unable to load payment history.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, plan, status, fromDate, toDate, page, size]);

  /* ------------------------------------------ */
  /* Initial Load                               */
  /* ------------------------------------------ */

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
  loadPayments();
}, [loadPayments]);
  /* ------------------------------------------ */
  /* Dashboard Cards                            */
  /* ------------------------------------------ */

  const cards = useMemo(() => {
    return [
      {
        title: "Total Revenue",
        value: formatCurrency(dashboard?.totalRevenue),
        icon: IndianRupee,
        color: "bg-indigo-500",
      },

      {
        title: "Today's Revenue",
        value: formatCurrency(dashboard?.todayRevenue),
        icon: CalendarDays,
        color: "bg-emerald-500",
      },

      {
        title: "Monthly Revenue",
        value: formatCurrency(dashboard?.monthlyRevenue),
        icon: CreditCard,
        color: "bg-violet-500",
      },

      {
        title: "Successful Payments",
        value: dashboard?.successfulPaymentsCount ?? 0,
        icon: CheckCircle2,
        color: "bg-sky-500",
      },

      {
        title: "Failed Payments",
        value: dashboard?.failedPaymentsCount ?? 0,
        icon: XCircle,
        color: "bg-red-500",
      },

      {
        title: "Refunded",
        value: "-",
        icon: AlertCircle,
        color: "bg-slate-500",
      },
    ];
  }, [dashboard, payments]);
    if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderWithMessage message="Loading payment history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-6">

        {/* -------------------------------- */}
        {/* Header                           */}
        {/* -------------------------------- */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Platform Administration
          </p>

          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Payment History
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review all subscription payments made across organizations.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Error                            */}
        {/* -------------------------------- */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* -------------------------------- */}
        {/* Dashboard Cards                  */}
        {/* -------------------------------- */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {cards.map((card) => {

            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      {card.value}
                    </h2>

                  </div>

                  <div
                    className={`rounded-xl p-3 text-white ${card.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                </div>
              </div>
            );

          })}

        </div>

        {/* -------------------------------- */}
        {/* Filters                          */}
        {/* -------------------------------- */}

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

            {/* Search */}

            <div className="relative">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-indigo-500"
              />

            </div>

            {/* Plan */}

            <select
              value={plan}
              onChange={(e) => {
                setPlan(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-slate-300 px-3 py-3"
            >
              <option value="">All Plans</option>
              <option value="FREE">FREE</option>
              <option value="STARTER">STARTER</option>
              <option value="BUSINESS">BUSINESS</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>

            {/* Status */}

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>

            {/* From */}

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />

            {/* To */}

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

        </div> 
        {/* -------------------------------- */}
        {/* Payments Table                   */}
        {/* -------------------------------- */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Owner
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Plan
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Method
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Transaction ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment Date
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">

                {payments.length === 0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="py-16 text-center text-slate-500"
                    >
                      No payment records found.
                    </td>

                  </tr>

                ) : (

                  payments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="whitespace-nowrap px-6 py-3 font-medium text-slate-900">
                        {payment.organizationName}
                      </td>

                      <td className="whitespace-nowrap px-6 py-3 text-slate-700">
                        {payment.ownerName}
                      </td>

                      <td className="whitespace-nowrap px-6 py-3">

                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {payment.plan}
                        </span>

                      </td>

                      <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-3 text-slate-700">
                        {payment.paymentMethod}
                      </td>

                      <td className="whitespace-nowrap px-6 py-3">

                        <span className="font-mono text-xs text-slate-600">
                          {payment.transactionId}
                        </span>

                      </td>

                      <td className="whitespace-nowrap px-6 py-3">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentBadge(
                            payment.paymentStatus
                          )}`}
                        >
                          {payment.paymentStatus}
                        </span>

                      </td>

                      <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                        {formatDate(payment.paymentDate)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* -------------------------------- */}
          {/* Pagination                       */}
          {/* -------------------------------- */}

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex-row">

            <p className="text-sm text-slate-600">

              Showing{" "}
              {payments.length === 0
                ? 0
                : page * size + 1}{" "}
              -
              {" "}
              {page * size + payments.length}
              {" "}
              of
              {" "}
              {totalElements}

            </p>

            <div className="flex items-center gap-3">

              <button
                disabled={page === 0}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="rounded-full border border-slate-300 bg-white p-2 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm font-medium text-slate-700">

                Page {page + 1} of{" "}
                {Math.max(totalPages, 1)}

              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="rounded-full border border-slate-300 bg-white p-2 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default PaymentHistory;