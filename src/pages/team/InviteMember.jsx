import React, { useState } from 'react';
import InviteMemberModal from '../../components/team/InviteMemberModal';

const InviteMember = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invite Team Member</h1>
      <p className="mb-4 text-gray-600">Send an invite link to add someone to your project team.</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Invite a Member
      </button>

      {isOpen && (
        <InviteMemberModal onClose={() => setIsOpen(false)} onInvite={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default InviteMember;
