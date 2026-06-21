import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import Swal from "sweetalert2";
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

      Swal.fire({
        icon: "success",
        title: "Member Added",
        text: "Team member added successfully",
        timer: 1800,
        showConfirmButton: false,
      });

      setShowModal(false);

      loadMembers();

    } catch (error) {

      console.error(error);

      const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Error adding member";

    Swal.fire({
      icon: "error",
      title: "Cannot Add Member",
      text: message,
      confirmButtonColor: "#2563eb",
    });   
    }
  };

  const handleRemoveMember =
    async (memberId) => {

      const result = await Swal.fire({
      title: "Remove Member?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

      try {

        await removeTeamMember(
          projectId,
          memberId
        );
        
        Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Member removed successfully",
        timer: 1800,
        showConfirmButton: false,
      });

        loadMembers();

      } catch (error) {

          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Remove Failed",
            text:
              error?.response?.data?.message ||
              "Unable to remove member",
            confirmButtonColor: "#2563eb",
          });
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