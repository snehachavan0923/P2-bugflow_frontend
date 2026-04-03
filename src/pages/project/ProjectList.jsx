import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject } from '../../api/projectApi';
import CreateProjectModal from '../../components/project/CreateProjectModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (newProject) => {
    try {
      const saved = await createProject(newProject);
      setProjects((prev) => [...prev, saved]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Project
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>

            <Link
              to={`/projects/${project.id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-3 py-2 rounded"
            >
              View
            </Link>
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