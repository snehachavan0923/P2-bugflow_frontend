import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const project = { id: projectId, name: 'Sample Project', description: 'A sample project description.' };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div><h2>Overview</h2><p>{project.description}</p></div>;
      case 'issues':
        return <div><Link to="issues" className="bg-blue-500 text-white px-4 py-2 rounded">View Issues</Link></div>;
      case 'team':
        return <div><Link to="team" className="bg-green-500 text-white px-4 py-2 rounded">Manage Team</Link></div>;
      case 'settings':
        return <div><h2>Settings</h2><p>Project settings here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{project.name}</h1>
      <div className="mb-4">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Overview</button>
        <button onClick={() => setActiveTab('issues')} className={`px-4 py-2 ${activeTab === 'issues' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Issues</button>
        <button onClick={() => setActiveTab('team')} className={`px-4 py-2 ${activeTab === 'team' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Team</button>
        <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Settings</button>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default ProjectDetails;