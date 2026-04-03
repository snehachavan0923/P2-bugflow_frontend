import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import IssueForm from '../../components/issue/IssueForm';
import { createIssue } from '../../api/issueApi';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProject();
  }, [projectId]);

  // Create issue handler
  const handleCreateIssue = async (data) => {
    try {
      setLoading(true);
      await createIssue(projectId, data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {/* Project Info */}
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-6">
        
        {/* View Issues */}
        <Link
          to={`/projects/${projectId}/issues`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Board
        </Link>

        {/* Create Issue → MODAL */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create Issue
        </button>

      </div>

      {/* Project Info Box */}
      <div className="bg-white p-4 rounded shadow">
        <p>Project ID: {projectId}</p>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Create Issue</h2>

            {/* Form */}
            <IssueForm onSubmit={handleCreateIssue} />

            {loading && (
              <p className="text-sm text-gray-500 mt-2">Creating...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;