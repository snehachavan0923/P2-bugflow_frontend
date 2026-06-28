import React, { useState } from "react";
import { X } from "lucide-react";

import IssueBoard from "../../issues/IssueBoard";
import IssueForm from "../../../components/issue/IssueForm";
import { createIssue } from "../../../api/issueApi";
import { alertSuccess, alertApiError } from "../../../utils/alerts";
import { useProjectWorkspace } from "./WorkspaceContext";

const ProjectKanban = () => {
  const { projectId, refreshWorkspace } =
    useProjectWorkspace();
  const [showModal, setShowModal] = useState(false);

  const handleCreateIssue = async (data, file) => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(data));

      if (file) {
        formData.append("file", file);
      }

      await createIssue(projectId, formData);
      alertSuccess('Issue Created', 'Your issue has been created successfully!');
      setShowModal(false);
      refreshWorkspace();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'Error creating issue. Please try again.');
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-1 h-full min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
        <IssueBoard onCreateIssue={() => setShowModal(true)} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Close create issue"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 pr-10">
              <h2 className="text-2xl font-bold text-slate-950">
                Create New Issue
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Add a new issue to this project board.
              </p>
            </div>

            <IssueForm
              projectId={projectId}
              onSubmit={handleCreateIssue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectKanban;
