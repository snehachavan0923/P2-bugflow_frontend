import React from 'react';

const MembersTable = ({ members, onRemove }) => {
  return (
    <table className="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Email</th>
          <th className="border border-gray-300 px-4 py-2">Role</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td className="border border-gray-300 px-4 py-2">{member.email}</td>
            <td className="border border-gray-300 px-4 py-2">{member.role}</td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onRemove(member.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersTable;