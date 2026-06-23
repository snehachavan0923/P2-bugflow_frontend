import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "../../api/axios";

import IssueForm from "../../components/issue/IssueForm";

import { createIssue } from "../../api/issueApi";

import { useAuth } from "../../context/AuthContext";

const ProjectDetails = () => {

  const { role } = useAuth();

  const { projectId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {

    const fetchProject = async () => {

      try {

        const res = await axios.get(
          `/projects/${projectId}`
        );

        setProject(res.data);

      } catch (err) {

        console.error(err);

      }
    };

    fetchProject();

  }, [projectId]);

  const handleCreateIssue = async (
    data,
    file
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "data",
        JSON.stringify(data)
      );

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      await createIssue(
        projectId,
        formData
      );

      alert(
        "Issue created successfully"
      );

      setShowModal(false);

    } catch (err) {

      console.error(err);

      alert(
        "Error creating issue"
      );
    }
  };

  if (!project) {

    return (
      <div className="p-6">
        Loading Project...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold mb-2">
          {project.name}
        </h1>

        <p className="text-gray-600">
          {project.description}
        </p>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* OWNER */}
        {role === "Owner" && (
          <>
            <Link
              to={`/projects/${projectId}/issues`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Open Board
            </Link>

            <button
              onClick={() =>
                navigate(
                  `/projects/${projectId}/team`
                )
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
            >
              Manage Team
            </button>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              + Create Issue
            </button>
          </>
        )}

        {/* DEVELOPER */}
        {role === "Developer" && (
         <button
          onClick={() => navigate(`/projects/${projectId}/my-tasks`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          My Tasks
        </button>
        )}

        {/* TESTER */}
        {role === "Tester" && (
       <button
          onClick={() => navigate(`/projects/${projectId}/verify-issues`)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Verify Issues
        </button>
        )}

        {role === "Viewer" && (

      <button
        onClick={() =>
          navigate(
            `/projects/${projectId}/view-board`
          )
        }
        className="
          bg-slate-700
          hover:bg-slate-800
          text-white
          px-5
          py-2
          rounded-lg
        "
      >
        View Board
      </button>

    )}

      </div>

      {/* Project Information */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Project Information
        </h2>

        <div className="space-y-3">

          <p>
            <span className="font-semibold">
              Project ID:
            </span>{" "}
            {projectId}
          </p>

          <p>
            <span className="font-semibold">
              Name:
            </span>{" "}
            {project.name}
          </p>

          <p>
            <span className="font-semibold">
              Description:
            </span>{" "}
            {project.description}
          </p>

          {project.ownerId && (
            <p>
              <span className="font-semibold">
                Owner:
              </span>{" "}
              {project.ownerId}
            </p>
          )}

        </div>

      </div>

      {/* CREATE ISSUE MODAL */}
      {role === "Owner" &&
        showModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative">

            <button
              onClick={() =>
                setShowModal(false)
              }
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-5">
              Create New Issue
            </h2>

            <IssueForm
              projectId={projectId}
              onSubmit={
                handleCreateIssue
              }
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default ProjectDetails;