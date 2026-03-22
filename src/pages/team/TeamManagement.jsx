import React, { useState } from 'react';
import MembersTable from '../../components/team/MembersTable';
import InviteMemberModal from '../../components/team/InviteMemberModal';

const TeamManagement = () => {
  const [members, setMembers] = useState([
    { id: 1, email: 'owner@example.com', role: 'Owner' },
    { id: 2, email: 'dev@example.com', role: 'Developer' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = (newMember) => {
    setMembers([...members, { ...newMember, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleRemove = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div>
      <h1>Team Management</h1>
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Invite Member
      </button>
      <MembersTable members={members} onRemove={handleRemove} />
      {isModalOpen && (
        <InviteMemberModal onClose={() => setIsModalOpen(false)} onInvite={handleInvite} />
      )}
    </div>
  );
};

export default TeamManagement;