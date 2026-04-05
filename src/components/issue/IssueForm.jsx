import React, { useState } from 'react';
import './IssueForm.css';

const IssueForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [assignedTo, setAssignedTo] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  try {
    setLoading(true);

    await onSubmit(
      { title, description, priority, assignedTo },
      file
    );

  } catch (err) {
    console.error("Submit error:", err);
    alert("Failed to create issue ❌");
  } finally {
    setLoading(false); 
  }
};

  return (
    <div className="issue-container">
      <form onSubmit={handleSubmit} className="issue-card">

        <div className="issue-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter issue title"
            required
          />
        </div>

        <div className="issue-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            rows="3"
          />
        </div>

        <div className="issue-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="issue-group">
          <label>Assigned To</label>
          <input
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Assign developer"
          />
        </div>

        <div className="issue-group">
          <label>Upload Bug Image</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />
        </div>

       <button className="issue-btn" disabled={loading}>
        {loading ? (
          <span className="loader"></span>
        ) : (
          "🚀 Create Issue"
        )}
      </button>

      </form>
    </div>
  );
};

export default IssueForm;