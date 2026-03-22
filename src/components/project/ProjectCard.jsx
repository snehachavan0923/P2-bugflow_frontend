import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg"
      onClick={() => onClick(project.id)}
    >
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-gray-600">{project.description}</p>
      <p className="text-sm text-gray-500">Members: {project.members?.length || 0}</p>
    </div>
  );
};

export default ProjectCard;