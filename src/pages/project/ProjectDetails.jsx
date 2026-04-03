import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

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

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      {/* Project Info */}
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* ACTION BUTTONS 🔥 */}
      <div className="flex gap-4 mb-6">
        
        {/* View Issues */}
        <Link
          to={`/projects/${projectId}/issues`}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Issues
        </Link>

        {/* Create Issue */}
        <Link
          to={`/projects/${projectId}/create-issue`}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Issue
        </Link>

      </div>

      {/* OPTIONAL: quick stats later */}
      <div className="bg-white p-4 rounded shadow">
    <p>Project ID: {projectId}</p>
      </div>
    </div>
  );
};

export default ProjectDetails;