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
        return `${base} bg-blue-100 text-blue-700`;
      case "Tester":
        return `${base} bg-emerald-100 text-emerald-700`;
      case "Viewer":
        return `${base} bg-slate-100 text-slate-700`;
      case "Manager":
        return `${base} bg-purple-100 text-purple-700`;
      default:
        return `${base} bg-slate-100 text-slate-700`;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {members.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">
                      No Members Found
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Invite team members to collaborate on this project.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <span className="font-medium text-slate-900">
                      {member.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {member.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <span className={rolePillStyles(member.role)}>
                      {member.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onChangePassword(member)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => onRemove(member.id)}
                        className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;