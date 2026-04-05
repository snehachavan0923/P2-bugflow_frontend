import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import IssueForm from '../../components/issue/IssueForm';
import { createIssue } from '../../api/issueApi';
import Modal from '../../components/common/Modal';

const CreateIssue = () => {
  const { projectId } = useParams();
  const [open, setOpen] = useState(true); 

const handleSubmit = async (data, file) => {
  try {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    if (file) {
      formData.append("file", file);
    }

    await createIssue(projectId, formData);
    setOpen(false);

  } catch (err) {
    console.error(err);
    alert("Error creating issue");
  }
};
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Create Issue"
    >
      <IssueForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default CreateIssue;