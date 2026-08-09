import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Search,
  UserX,
  Users,
  Sparkles,
  Code2,
  ShieldCheck,
  Eye,
} from "lucide-react";

import { getOrganizationMembers } from "../../api/organizationApi";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const filters = ["All", "Developer", "Tester", "Viewer"];

const roleStyles = {
  Developer: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  Tester: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Viewer: "bg-slate-100 text-slate-700 border-slate-200/60",
  Owner: "bg-violet-50 text-violet-700 border-violet-200/60",
};

const getMemberName = (member) =>
  member?.name ||
  member?.fullName ||
  member?.user?.name ||
  member?.user?.fullName ||
  "Unknown Member";

const getMemberEmail = (member) =>
  member?.email ||
  member?.user?.email ||
  "No email available";

const getMemberRole = (member) =>
  member?.role ||
  member?.user?.role ||
  "Viewer";

const MembersDirectory = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setError("");

        const data = await getOrganizationMembers();
        const memberList = Array.isArray(data)
          ? data
          : data?.members || data?.data || [];

        setMembers(memberList);
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load organization members."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return members.filter((member) => {
      const name = getMemberName(member).toLowerCase();
      const email = getMemberEmail(member).toLowerCase();
      const role = getMemberRole(member);
      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);
      const matchesRole =
        activeFilter === "All" ||
        role.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, activeFilter]);

  const memberStats = useMemo(() => {
    const total = members.length;
    const developers = members.filter(
      (m) => getMemberRole(m).toLowerCase() === "developer"
    ).length;
    const testers = members.filter(
      (m) => getMemberRole(m).toLowerCase() === "tester"
    ).length;
    const viewers = members.filter(
      (m) => getMemberRole(m).toLowerCase() === "viewer"
    ).length;

    return { total, developers, testers, viewers };
  }, [members]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading organization members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-rose-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(244,63,94,0.15)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-950">
                  Could not load members
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Header Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Directory & access
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Members Directory
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage access, track collaborators, and view member role distributions across your organization.
              </p>
            </div>
          </div>

          {/* Member Statistics Summary Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-2.5 text-indigo-700">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Members</p>
                  <p className="text-2xl font-semibold text-slate-950">{memberStats.total}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700">
                  <Code2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Developers</p>
                  <p className="text-2xl font-semibold text-slate-950">{memberStats.developers}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Testers</p>
                  <p className="text-2xl font-semibold text-slate-950">{memberStats.testers}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-700">
                  <Eye className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Viewers</p>
                  <p className="text-2xl font-semibold text-slate-950">{memberStats.viewers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Panel */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.12)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/80 placeholder:text-slate-400"
              />
            </div>

            <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-100 p-1.5">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Members Directory Table Container */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-6">
          {members.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center shadow-sm my-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-indigo-600 shadow-sm">
                <UserX className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                No members found
              </h2>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                Members added to your organization will appear here.
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center shadow-sm my-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-indigo-600 shadow-sm">
                <Search className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                No matching members
              </h2>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                Try adjusting your search query or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Role
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredMembers.map((member) => {
                      const name = getMemberName(member);
                      const email = getMemberEmail(member);
                      const role = getMemberRole(member);
                      const badgeClassName =
                        roleStyles[role] ||
                        "bg-slate-100 text-slate-700 border-slate-200/60";

                      return (
                        <tr
                          key={member?.id || member?._id || email}
                          className="transition-colors hover:bg-slate-50/80"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-700 shadow-sm">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-950">
                                {name}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                            {email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClassName}`}
                            >
                              {role}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersDirectory;

