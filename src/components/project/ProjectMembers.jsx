import React from 'react';

const ProjectMembers = ({ members }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Project Members</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex items-center space-x-2">
            <span>{member.name}</span>
            <span className="text-sm text-gray-500">({member.role})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectMembers;