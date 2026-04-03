import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IssueForm from '../../components/issue/IssueForm';
import { createIssue } from '../../api/issueApi';

const CreateIssue = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createIssue(projectId, data);
    navigate(`/projects/${projectId}/issues`);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Create Issue</h1>
      <IssueForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateIssue;