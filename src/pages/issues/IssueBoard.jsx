import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getIssues,
  updateIssue,
  editIssue,
  resolveIssue
} from '../../api/issueApi';
import './IssueBoard.css';

const tabs = ["Open", "In Progress", "Review", "Done"];

const IssueBoard = () => {
  const { projectId } = useParams();

  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState("Open");

  const [imageModal, setImageModal] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  const [editModal, setEditModal] = useState(null);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolveFile, setResolveFile] = useState(null);

  const fetchIssues = useCallback(async () => {
    const data = await getIssues(projectId);
    setIssues(data);
  }, [projectId]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleStatusChange = async (issueId, status) => {
    await updateIssue(projectId, issueId, status);
    fetchIssues();
  };

  const filtered = issues.filter(i => i.status === activeTab);

  return (
    <div className="board-container">
      <h1 className="board-title">Issue Board</h1>

      {/* Tabs */}
      <div className="board-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "tab active" : "tab"}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="board-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Assigned</th>
              <th>Image</th>
              <th>Move</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(issue => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
                <td>{issue.priority}</td>
                <td>{issue.assignedTo}</td>

                {/* Image */}
                <td>
                  {issue.imageUrl ? (
                    <button
                      className="btn-view"
                      onClick={() => setImageModal(issue.imageUrl)}
                    >
                      View
                    </button>
                  ) : "-"}
                </td>

                {/* Status */}
                <td>
                  <select
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                  >
                    {tabs.map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </td>

                {/* ACTIONS */}
                <td>
                  {issue.status !== "Done" && (
                    <button
                      className="btn-edit"
                      onClick={() => setEditModal(issue)}
                    >
                      Edit
                    </button>
                  )}

                  {issue.status === "Review" && (
                    <button
                      className="btn-resolve"
                      onClick={() => setResolveModal(issue)}
                    >
                      Resolve
                    </button>
                  )}

                  <button
                    className="btn-details"
                    onClick={() => setDetailsModal(issue)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IMAGE MODAL */}
      {imageModal && (
        <div className="modal-overlay" onClick={() => setImageModal(null)}>
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Image Preview</h2>
              <button onClick={() => setImageModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="image-box">
                <img src={imageModal} alt="issue" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsModal && (
        <div className="modal-overlay" onClick={() => setDetailsModal(null)}>
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue Details</h2>
              <button onClick={() => setDetailsModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Title</label>
                <div className="field-box">{detailsModal.title}</div>
              </div>

              <div className="field">
                <label>Description</label>
                <div className="field-box">{detailsModal.description}</div>
              </div>

              <div className="field">
                <label>Priority</label>
                <div className="field-box">{detailsModal.priority}</div>
              </div>

              <div className="field">
                <label>Status</label>
                <div className="field-box">{detailsModal.status}</div>
              </div>

              <div className="field">
                <label>Assigned</label>
                <div className="field-box">{detailsModal.assignedTo}</div>
              </div>

              {detailsModal.imageUrl && (
                <div className="field">
                  <label>Bug Image</label>
                  <div className="image-box">
                    <img src={detailsModal.imageUrl} alt="bug" />
                  </div>
                </div>
              )}

              {detailsModal.resolutionImageUrl && (
                <div className="field">
                  <label>Resolution Proof</label>
                  <div className="image-box">
                    <img src={detailsModal.resolutionImageUrl} alt="resolved" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Edit Issue</h2>
              <button onClick={() => setEditModal(null)}>✕</button>
            </div>

            <div className="modal-body">

              <div className="field">
                <label>Title</label>
                <input
                  className="input"
                  value={editModal.title}
                  onChange={(e) =>
                    setEditModal({ ...editModal, title: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  className="input"
                  value={editModal.description}
                  onChange={(e) =>
                    setEditModal({ ...editModal, description: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Priority</label>
                <select
                  className="input"
                  value={editModal.priority}
                  onChange={(e) =>
                    setEditModal({ ...editModal, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="field">
                <label>Assigned</label>
                <input
                  className="input"
                  value={editModal.assignedTo}
                  onChange={(e) =>
                    setEditModal({ ...editModal, assignedTo: e.target.value })
                  }
                />
              </div>

              {/* 🔥 Existing Image */}
              {editModal.imageUrl && (
                <div className="field">
                  <label>Bug Image</label>
                  <div className="image-box">
                    <img src={editModal.imageUrl} alt="bug" />
                  </div>
                </div>
              )}

              <button
                className="btn-save"
                onClick={async () => {
                  await editIssue(projectId, editModal.id, editModal);
                  setEditModal(null);
                  fetchIssues();
                }}
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}

      {/* RESOLVE MODAL */}
      {resolveModal && (
        <div className="modal-overlay" onClick={() => setResolveModal(null)}>
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Resolve Issue</h2>
              <button onClick={() => setResolveModal(null)}>✕</button>
            </div>

            <div className="modal-body">

              {/* Existing Bug Image */}
              {resolveModal.imageUrl && (
                <div className="field">
                  <label>Bug Image</label>
                  <div className="image-box">
                    <img src={resolveModal.imageUrl} alt="bug" />
                  </div>
                </div>
              )}

              {/* Upload */}
              <div className="field">
                <label>Upload Resolution Proof</label>
                <input
                  type="file"
                  className="input"
                  onChange={(e) => setResolveFile(e.target.files[0])}
                />
              </div>

              <button
                className="btn-save"
                onClick={async () => {
                  if (!resolveFile) {
                    alert("Upload proof image ❌");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("file", resolveFile);

                  await resolveIssue(projectId, resolveModal.id, formData);

                  setResolveModal(null);
                  setResolveFile(null);
                  fetchIssues();
                }}
              >
                Submit Proof
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueBoard;