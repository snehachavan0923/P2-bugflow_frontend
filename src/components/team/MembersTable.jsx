import React from "react";

const MembersTable = ({
  members,
  onRemove,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Role
            </th>

            <th className="p-3 text-left">
              Joined
            </th>

            <th className="p-3 text-left">
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {members.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center p-6"
              >
                No Members Found
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr
                key={member.id}
                className="border-t"
              >
                <td className="p-3">
                  {member.name}
                </td>

                <td className="p-3">
                  {member.email}
                </td>

                <td className="p-3">
                  {member.role}
                </td>

                <td className="p-3">
                  {member.joinedAt
                    ? new Date(
                        member.joinedAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      onRemove(member.id)
                    }
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
};

export default MembersTable;