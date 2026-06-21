import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Search,
  UserX,
  Users,
} from "lucide-react";

import { getOrganizationMembers } from "../../api/organizationApi";

const filters = ["All", "Developer", "Tester", "Viewer"];

const roleStyles = {
  Developer: "bg-blue-50 text-blue-700 ring-blue-200",
  Tester: "bg-green-50 text-green-700 ring-green-200",
  Viewer: "bg-gray-50 text-gray-700 ring-gray-200",
  Owner: "bg-purple-50 text-purple-700 ring-purple-200",
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2
            className="h-5 w-5 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-slate-700">
            Loading members...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-950">
                Could not load members
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
              <Users className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              Members Directory
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Manage members across your organization
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
                <UserX className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                No members found
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Members added to your organization will appear here.
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
                <Search className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                No matching members
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try adjusting your search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredMembers.map((member) => {
                    const name = getMemberName(member);
                    const email = getMemberEmail(member);
                    const role = getMemberRole(member);
                    const badgeClassName =
                      roleStyles[role] ||
                      "bg-slate-50 text-slate-700 ring-slate-200";

                    return (
                      <tr
                        key={member?.id || member?._id || email}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-950">
                              {name}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {email}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClassName}`}
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
          )}
        </section>
      </div>
    </div>
  );
};

export default MembersDirectory;
