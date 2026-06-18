import React, {
  useEffect,
  useState,
} from "react";

import { getTeamMembers }
from "../../api/teamApi";

import "./IssueForm.css";

const IssueForm = ({
  projectId,
  onSubmit,
}) => {

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [priority,
    setPriority] =
    useState("Low");

  const [members,
    setMembers] =
    useState([]);

  const [
    assignedToUserId,
    setAssignedToUserId,
  ] = useState("");

  const [file, setFile] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

  const loadMembers = async () => {

    try {

      const data =
        await getTeamMembers(
          projectId
        );

      setMembers(data);

    } catch (err) {

      console.error(err);

    }
  };

  loadMembers();

}, [projectId]);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (loading) return;

      try {

        setLoading(true);

        const selected =
          members.find(
            m =>
              m.id ===
              assignedToUserId
          );

        await onSubmit(
          {
            title,
            description,
            priority,

            assignedToUserId,

            assignedToEmail:
              selected?.email,

            assignedToRole:
              selected?.role,
          },
          file
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="issue-container">

      <form
        onSubmit={handleSubmit}
        className="issue-card"
      >

        <div className="issue-group">
          <label>Title</label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />
        </div>

        <div className="issue-group">
          <label>Description</label>

          <textarea
            rows="3"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </div>

        <div className="issue-group">
          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="issue-group">

          <label>
            Assign To
          </label>

          <select
            value={
              assignedToUserId
            }
            onChange={(e) =>
              setAssignedToUserId(
                e.target.value
              )
            }
            required
          >

            <option value="">
              Select Member
            </option>

            {members.map(
              (member) => (

                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                  {" "}
                  (
                  {member.role}
                  )
                </option>
              )
            )}

          </select>

        </div>

        <div className="issue-group">

          <label>
            Upload Bug Image
          </label>

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

        </div>

        <button
          className="issue-btn"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Issue"}
        </button>

      </form>

    </div>
  );
};

export default IssueForm;