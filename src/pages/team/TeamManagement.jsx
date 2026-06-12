import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useParams } from "react-router-dom";

import InviteMemberModal from "../../components/team/InviteMemberModal";

import MembersTable from "../../components/team/MembersTable";

import {
  addTeamMember,
  getTeamMembers,
  removeTeamMember,
} from "../../api/teamApi";

const TeamManagement = () => {

  const { projectId } = useParams();

  const [members, setMembers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

    const loadMembers = useCallback(async () => {

      try {

        const data =
          await getTeamMembers(projectId);

        setMembers(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }

    }, [projectId]);

    useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleAddMember = async (
    memberData
  ) => {
    try {

      await addTeamMember(
        projectId,
        memberData
      );

      setShowModal(false);

      loadMembers();

    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Error adding member"
      );
    }
  };

  const handleRemoveMember =
    async (memberId) => {

      const confirmed = window.confirm(
        "Remove this member?"
      );

      if (!confirmed) return;

      try {

        await removeTeamMember(
          projectId,
          memberId
        );

        loadMembers();

      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading Members...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Team Management
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Member
        </button>

      </div>

      <MembersTable
        members={members}
        onRemove={handleRemoveMember}
      />

      {showModal && (
        <InviteMemberModal
          onClose={() =>
            setShowModal(false)
          }
          onInvite={handleAddMember}
        />
      )}
    </div>
  );
};

export default TeamManagement;