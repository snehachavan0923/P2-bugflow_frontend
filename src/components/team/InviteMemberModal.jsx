import React, { useState } from 'react';

const InviteMemberModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');

  const handleSubmit = (e) => {
    e.preventDefault();
    onInvite({ email, role });
    setEmail('');
    setRole('Viewer');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Invite Team Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="Owner">Owner</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;