import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";

import InviteMemberModal from "../../components/team/InviteMemberModal";
import ChangePasswordModal from "../../components/team/ChangePasswordModal";
import MembersTable from "../../components/team/MembersTable";

import {
  addTeamMember,
  changeTeamMemberPassword,
  getTeamMembers,
  removeTeamMember,
} from "../../api/teamApi";
import {
  alertSuccess,
  alertApiError,
  confirmDelete,
} from "../../utils/alerts";

const TeamManagement = () => {

  const { projectId } = useParams();

  const [members, setMembers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);
  const [selectedMember, setSelectedMember] =
    useState(null);
  const [showPasswordModal, setShowPasswordModal] =
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

      alertSuccess(
        "Member Added",
        "Team member added successfully"
      );

      setShowModal(false);
      loadMembers();
    } catch (error) {
      console.error(error);
      alertApiError(error, "Error adding member");
    }
  };

  const handleRemoveMember =
    async (memberId) => {

      const result = await confirmDelete(
        "member",
        {
          title: "Remove Member?",
          text: "This action cannot be undone.",
          confirmButtonText: "Remove",
        }
      );

      if (!result.isConfirmed) return;

      try {
        await removeTeamMember(
          projectId,
          memberId
        );

        alertSuccess(
          "Removed",
          "Member removed successfully"
        );

        loadMembers();
      } catch (error) {
        console.error(error);
        alertApiError(error, "Unable to remove member");
      }
    };

  const handleOpenChangePassword = (member) => {
    setSelectedMember(member);
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (
  memberId,
  password
) => {
  try {
    await changeTeamMemberPassword(
      projectId,
      memberId,
      password
    );

    alertSuccess(
      "Password Updated",
      "Team member password changed successfully"
    );

    return true;
  } catch (error) {
    alertApiError(error, "Unable to update password");
    return false;
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
        onChangePassword={handleOpenChangePassword}
      />

      {showModal && (
        <InviteMemberModal
          onClose={() =>
            setShowModal(false)
          }
          onInvite={handleAddMember}
        />
      )}

      {showPasswordModal && selectedMember && (
        <ChangePasswordModal
          member={selectedMember}
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedMember(null);
          }}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
};

export default TeamManagement;