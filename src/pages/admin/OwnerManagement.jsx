import { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Building2,
  CalendarDays,
  UserRound,
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { getAdminOwners, getAdminOwnerById } from '../../api/adminOwnerApi';

const PAGE_SIZE = 8;

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const normalizeStatus = (value) => {
  if (!value) return 'Unknown';
  const normalized = String(value).trim().toUpperCase();
  if (normalized === 'ACTIVE') return 'Active';
  if (normalized === 'SUSPENDED') return 'Suspended';
  if (normalized === 'DISABLED') return 'Disabled';
  if (normalized === 'PENDING') return 'Pending';
  return value;
};

const badgeClasses = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'active') return 'bg-emerald-100 text-emerald-700';
  if (normalized === 'suspended' || normalized === 'disabled' || normalized === 'inactive') {
    return 'bg-red-100 text-red-700';
  }
  if (normalized === 'pending') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-700';
};

const OwnerManagement = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await getAdminOwners();
        setOwners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            'Unable to load organization owners. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
  }, []);

  const filteredOwners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return owners.filter((owner) => {
      const ownerName = owner.ownerName?.toLowerCase() || '';
      const organizationName = owner.organizationName?.toLowerCase() || '';
      const ownerEmail = owner.ownerEmail?.toLowerCase() || '';

      return (
        !query ||
        ownerName.includes(query) ||
        organizationName.includes(query) ||
        ownerEmail.includes(query)
      );
    });
  }, [owners, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredOwners.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const currentOwners = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOwners.slice(start, start + PAGE_SIZE);
  }, [filteredOwners, page]);

  const openDetails = async (ownerId) => {
    if (detailsOpen) return;

    try {
      setError('');
      setDetailsLoading(true);
      const data = await getAdminOwnerById(ownerId);
      setSelectedOwner(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Unable to load owner details. Please try again.'
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Platform Administration
            </p>

            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Owner Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review organization owners, account status, and platform access.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Search owner, organization, or email"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader />
              <p className="text-sm text-slate-500">Loading owner details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Unable to load owners</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-950">No owners found</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No organization owners match your search.
              <br />
              Try searching by owner name, organization, or email.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentOwners.map((owner) => (
                    <tr key={owner.ownerId || owner.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-950">
                        {owner.ownerName || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {owner.organizationName || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {owner.email || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(owner.organizationStatus)}`}>
                          {normalizeStatus(owner.organizationStatus)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(owner.accountStatus)}`}>
                          {normalizeStatus(owner.accountStatus)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(owner.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => openDetails(owner.ownerId || owner.id)}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="inline h-4 w-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {currentOwners.length} of {filteredOwners.length} owners
              </p>

              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-700">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={page === pageCount}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
          onClick={() => {
            setDetailsOpen(false);
            setSelectedOwner(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                  Owner details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {selectedOwner ? 'View Owner' : 'Owner Details'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedOwner(null);
                }}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center p-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader />
                  <p className="text-sm text-slate-500">Loading owner details...</p>
                </div>
              </div>
            ) : selectedOwner ? (
              <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Organization Owner
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                        {selectedOwner.ownerName || 'Unknown'}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Review owner and organization information for platform administration.
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(selectedOwner.organizationStatus)}`}
                      >
                        {normalizeStatus(selectedOwner.organizationStatus)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(selectedOwner.accountStatus)}`}
                      >
                        {normalizeStatus(selectedOwner.accountStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Owner Email
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                       {selectedOwner.email || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Organization
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {selectedOwner.organizationName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                        Created Date
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {formatDate(selectedOwner.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Building2 className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                        Organization Status
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {normalizeStatus(selectedOwner.organizationStatus)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <UserRound className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                        Account Status
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {normalizeStatus(selectedOwner.accountStatus)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[200px] items-center justify-center p-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader />
                  <p className="text-sm text-slate-500">Loading owner details...</p>
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedOwner(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerManagement;
