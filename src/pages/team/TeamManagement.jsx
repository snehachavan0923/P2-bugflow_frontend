import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { Plus, Users, ShieldCheck, Sparkles } from "lucide-react";

import InviteMemberModal from "../../components/team/InviteMemberModal";
import ChangePasswordModal from "../../components/team/ChangePasswordModal";
import MembersTable from "../../components/team/MembersTable";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      const data = await getTeamMembers(projectId);

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

  const handleAddMember = async (memberData) => {
    try {
      await addTeamMember(projectId, memberData);

      alertSuccess("Member Added", "Team member added successfully");

      setShowModal(false);
      loadMembers();
    } catch (error) {
      console.error(error);
      if (!error?.isSubscriptionAccessError) {
        alertApiError(error, "Error adding member");
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    const result = await confirmDelete("member", {
      title: "Remove Member?",
      text: "This action cannot be undone.",
      confirmButtonText: "Remove",
    });

    if (!result.isConfirmed) return;

    try {
      await removeTeamMember(projectId, memberId);

      alertSuccess("Removed", "Member removed successfully");

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

  const handleChangePassword = async (memberId, password) => {
    try {
      await changeTeamMemberPassword(projectId, memberId, password);

      alertSuccess("Password Updated", "Team member password changed successfully");

      return true;
    } catch (error) {
      alertApiError(error, "Unable to update password");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading team members..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Team operations
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Team Management
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage access, track collaborators, and keep your project team aligned with a clean workspace experience.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Team size</p>
                  <p className="text-2xl font-semibold text-slate-950">{members.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Access status</p>
                  <p className="text-2xl font-semibold text-slate-950">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-6">
          <MembersTable
            members={members}
            onRemove={handleRemoveMember}
            onChangePassword={handleOpenChangePassword}
          />
        </div>
      </div>

      {showModal && (
        <InviteMemberModal
          onClose={() => setShowModal(false)}
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
