import React from "react";

const MembersTable = ({
  members,
  onRemove,
  onChangePassword,
}) => {
  const rolePillStyles = (role) => {
    const base = "rounded-full px-3 py-1 text-xs font-semibold";
    switch (role) {
      case "Developer":
        return `${base} bg-blue-50 text-blue-700`;
      case "Tester":
        return `${base} bg-emerald-50 text-emerald-700`;
      case "Viewer":
        return `${base} bg-slate-100 text-slate-700`;
      case "Manager":
        return `${base} bg-blue-50 text-blue-700`;
      default:
        return `${base} bg-slate-100 text-slate-700`;
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 w-56">
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="max-h-[520px] overflow-y-auto overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.6)_transparent]">
        <table className="min-w-full table-fixed border-collapse">
          <tbody className="divide-y divide-slate-200 bg-white">
            {members.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center shadow-sm">
                    <h2 className="mt-4 text-xl font-semibold text-slate-950">
                      No members yet
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Invite collaborators to start building momentum on this project.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const initial = (member.name?.charAt(0) || "U").toUpperCase();

                return (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                          {initial}
                        </div>
                        <span className="font-medium text-slate-900">{member.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {member.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <span className={rolePillStyles(member.role)}>{member.role}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() => onChangePassword(member)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => onRemove(member.id)}
                          className="rounded-full bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;