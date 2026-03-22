import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../../components/project/CreateProjectModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mock data
    const mockProjects = [
      { id: 1, name: 'Project Alpha', openIssues: 5, teamSize: 3 },
      { id: 2, name: 'Project Beta', openIssues: 2, teamSize: 5 },
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreate = (newProject) => {
    setProjects((prev) => [...prev, { ...newProject, id: Date.now(), openIssues: 0, teamSize: 1 }]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-2">Open Issues: {project.openIssues}</p>
            <p className="text-gray-600 mb-4">Team Size: {project.teamSize}</p>
            <Link to={`/projects/${project.id}`} className="bg-blue-500 text-white px-4 py-2 rounded">View Project</Link>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default ProjectList;