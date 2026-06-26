import { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Building2,
  Users,
  CalendarDays,
  UserRound,
} from 'lucide-react';
import Swal from "sweetalert2";
import Loader from '../../components/common/Loader';
import {
  getAdminOrganizations,
  suspendAdminOrganization,
  activateAdminOrganization,
  getAdminOrganizationById,
} from '../../api/adminOrganizationApi';

const PAGE_SIZE = 8;

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await getAdminOrganizations();
        setOrganizations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            'Unable to load organizations. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  const filteredOrganizations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return organizations.filter((organization) => {
      const organizationName =
        organization.organizationName?.toLowerCase() || '';
      const ownerName = organization.ownerName?.toLowerCase() || '';
      const ownerEmail = organization.ownerEmail?.toLowerCase() || '';

      return (
        !query ||
        organizationName.includes(query) ||
        ownerName.includes(query) ||
        ownerEmail.includes(query)
      );
    });
  }, [organizations, searchTerm]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredOrganizations.length / PAGE_SIZE)
  );
  useEffect(() => {
  if (page > pageCount) {
    setPage(pageCount);
  }
}, [page, pageCount]);

  const currentOrganizations = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrganizations.slice(start, start + PAGE_SIZE);
  }, [filteredOrganizations, page]);

  const openDetails = async (organizationId) => {
    if (detailsOpen) return;
    try {
      setError('');
      setLoading(true);
      const data = await getAdminOrganizationById(organizationId);
      setSelectedOrganization(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Unable to load organization details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganizations = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getAdminOrganizations();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Unable to refresh organizations.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusAction = async (action, organization) => {
    if (!organization) return;

    const isSuspend = action === 'suspend';
    const result = await Swal.fire({
      title: isSuspend ? 'Suspend Organization?' : 'Activate Organization?',
      text: isSuspend
        ? `Suspend "${organization.organizationName}"?\n\nAll users belonging to this organization will immediately lose access to BugFlow.\n\nNo projects or data will be deleted.`
        : `Activate "${organization.organizationName}"?\n\nAll members of this organization will immediately regain access to BugFlow.`,
      icon: isSuspend ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: isSuspend ? 'Suspend' : 'Activate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: isSuspend ? '#f59e0b' : '#10b981',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);

    try {
      if (isSuspend) {
        await suspendAdminOrganization(organization.organizationId);
      } else {
        await activateAdminOrganization(organization.organizationId);
      }

      await refreshOrganizations();

      Swal.fire({
        icon: 'success',
        title: isSuspend ? 'Organization Suspended' : 'Organization Activated',
        text: isSuspend
          ? 'Users of this organization can no longer access BugFlow.'
          : 'Organization access has been restored successfully.',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Unable to complete the requested action.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
  Organization Management
</h1>

<p className="mt-2 text-sm leading-6 text-slate-600">
  Monitor organizations, manage platform access, and review organization activity.
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
                placeholder="Search organization, owner, or email"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
         <div className="flex flex-col items-center gap-4">
    <Loader />
    <p className="text-sm text-slate-500">
      Loading organization details...
    </p>
</div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Unable to load organizations</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-950">
  No organizations found
</h2>

<p className="mt-2 text-sm leading-6 text-slate-600">
  No organizations match your search.
  <br />
  Try searching by organization name, owner name, or owner email.
</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner Email
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Projects
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Members
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
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
                  {currentOrganizations.map((organization) => (
                    <tr key={organization.organizationId} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-950">
                        {organization.organizationName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {organization.ownerName || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {organization.ownerEmail || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-900">
                        {organization.totalProjects}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-900">
                        {organization.totalMembers}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                       <span
  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
    organization.organizationStatus === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {organization.organizationStatus === "ACTIVE"
    ? "Active"
    : "Suspended"}
</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(organization.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          type="button"
                          onClick={() => openDetails(organization.organizationId)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="inline h-4 w-4 mr-1" />
                          View
                        </button>
                        {organization.organizationStatus === 'ACTIVE' ? (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusAction('suspend', organization)}
                            className="rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusAction('activate', organization)}
                            className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {currentOrganizations.length} of {filteredOrganizations.length} organizations
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
            setSelectedOrganization(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                  Organization details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {selectedOrganization ? 'View Organization' : 'Organization Details'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedOrganization(null);
                }}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedOrganization ? (
              <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Organization
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                        {selectedOrganization.organizationName}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Review organization access, ownership details, and platform activity.
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedOrganization.organizationStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedOrganization.organizationStatus === 'ACTIVE'
                        ? 'Active'
                        : 'Suspended'}
                    </span>
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
                          Owner Name
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {selectedOrganization.ownerName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Owner Email
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {selectedOrganization.ownerEmail || 'Unknown'}
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
                      {formatDate(selectedOrganization.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Building2 className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                        Total Projects
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {selectedOrganization.totalProjects}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                        Total Members
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {selectedOrganization.totalMembers}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader />
                  <p className="text-sm text-slate-500">Loading organization details...</p>
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedOrganization(null);
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

export default OrganizationManagement;
