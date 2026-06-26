import { useEffect, useMemo, useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  getAdminOrganizations,
  suspendAdminOrganization,
  activateAdminOrganization,
  deleteAdminOrganization,
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
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmOrganization, setConfirmOrganization] = useState(null);
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

  const currentOrganizations = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrganizations.slice(start, start + PAGE_SIZE);
  }, [filteredOrganizations, page]);

  const openDetails = async (organizationId) => {
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

  const handleConfirm = async () => {
    if (!confirmAction || !confirmOrganization) {
      return;
    }

    setActionLoading(true);

    try {
      if (confirmAction === 'delete') {
        await deleteAdminOrganization(confirmOrganization.organizationId);
      } else if (confirmAction === 'suspend') {
        await suspendAdminOrganization(confirmOrganization.organizationId);
      } else if (confirmAction === 'activate') {
        await activateAdminOrganization(confirmOrganization.organizationId);
      }

      await refreshOrganizations();
      setConfirmAction(null);
      setConfirmOrganization(null);
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

  const prepareAction = (action, organization) => {
    setConfirmAction(action);
    setConfirmOrganization(organization);
  };

  const closeConfirmDialog = () => {
    setConfirmAction(null);
    setConfirmOrganization(null);
  };

  const selectedActionMessage = () => {
    if (!confirmOrganization) return '';

    if (confirmAction === 'delete') {
      return `Permanently delete ${confirmOrganization.organizationName}? This action cannot be undone.`;
    }

    if (confirmAction === 'suspend') {
      return `Suspend ${confirmOrganization.organizationName} and prevent access for its members?`;
    }

    if (confirmAction === 'activate') {
      return `Activate ${confirmOrganization.organizationName} and restore access.`;
    }

    return '';
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
              Platform Admin
            </p>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Organization Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review organizations, monitor activity, and manage status.
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
            <Loader />
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
            <h2 className="mt-6 text-xl font-semibold text-slate-950">No organizations found</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Try a different search term or return later when more organizations are available.
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
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          organization.organizationStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {organization.organizationStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(organization.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          type="button"
                          onClick={() => openDetails(organization.organizationId)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Eye className="inline h-4 w-4 mr-1" />
                          View
                        </button>
                        {organization.organizationStatus === 'ACTIVE' ? (
                          <button
                            type="button"
                            onClick={() => prepareAction('suspend', organization)}
                            className="rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-amber-600"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => prepareAction('activate', organization)}
                            className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-600"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => prepareAction('delete', organization)}
                          className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>
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

      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Organization Details"
      >
        {selectedOrganization ? (
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Organization</p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {selectedOrganization.organizationName}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Owner</p>
                <p className="mt-1 text-sm text-slate-900">
                  {selectedOrganization.ownerName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedOrganization.ownerEmail}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                <p className="mt-1 text-sm text-slate-900">
                  {formatDate(selectedOrganization.createdAt)}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Projects</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {selectedOrganization.totalProjects}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Members</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {selectedOrganization.totalMembers}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                selectedOrganization.organizationStatus === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {selectedOrganization.organizationStatus}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <Loader />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(confirmAction && confirmOrganization)}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirm}
        message={selectedActionMessage()}
      />
    </div>
  );
};

export default OrganizationManagement;
