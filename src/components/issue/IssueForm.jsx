import React, {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

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
    developerUserId,
    setDeveloperUserId,
  ] = useState("");

  const [
    testerUserId,
    setTesterUserId,
  ] = useState("");

  const [file, setFile] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);
    
  const [membersLoading, setMembersLoading] =
  useState(true);

  useEffect(() => {

    const loadMembers =
      async () => {

        try {

          const data =
            await getTeamMembers(
              projectId
            );

          setMembers(data);

        } catch (err) {

          console.error(err);

        } finally {

          setMembersLoading(false);

        }
      };

    loadMembers();

  }, [projectId]);

  const developers =
    members.filter(
      (member) =>
        member.role ===
        "Developer"
    );

  const testers =
    members.filter(
      (member) =>
        member.role ===
        "Tester"
    );

  useEffect(() => {

  if (membersLoading) return;

  if (
    developers.length === 0 ||
    testers.length === 0
  ) {

    Swal.fire({
      icon: "warning",
      title: "Team Incomplete",
      text:
        "Please add at least one Developer and one Tester before creating issues.",
    });
  }

}, [
  membersLoading,
  developers.length,
  testers.length,
]);

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (loading) return;

  try {

    setLoading(true);

    await onSubmit(
      {
        title,
        description,
        priority,
        developerUserId,
        testerUserId,
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
          <label>
            Title
          </label>

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
          <label>
            Description
          </label>

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
          <label>
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>
          </select>
        </div>

      <div className="issue-group">

        <label>
          Developer
        </label>

        <select
          value={developerUserId}
          onChange={(e) =>
            setDeveloperUserId(
              e.target.value
            )
          }
          required
        >

          <option value="">
            Select Developer
          </option>

          {developers.map(
            (member) => (

              <option
                key={member.userId}
                value={member.userId}
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
          Tester
        </label>

        <select
          value={testerUserId}
          onChange={(e) =>
            setTesterUserId(
              e.target.value
            )
          }
          required
        >

          <option value="">
            Select Tester
          </option>

          {testers.map(
            (member) => (

              <option
                key={member.userId}
                value={member.userId}
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
          disabled={
            loading ||
            developers.length === 0 ||
            testers.length === 0
          }
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