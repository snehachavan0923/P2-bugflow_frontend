import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  getProjectTasks,
  moveIssueStatus,
  resolveIssue
} from "../../api/issueApi";

import { useAuth }
from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const MyTasks = () => {

  const { user } = useAuth();
  const { projectId } = useParams();


  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [resolveModal,
    setResolveModal] =
      useState(null);

  const [proofFile,
    setProofFile] =
      useState(null);

const loadTasks =
  useCallback(async () => {

    try {

      const data =
        await getProjectTasks(
          projectId
        );

      setTasks(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }

  }, [projectId]);

  useEffect(() => {

    if(user?.email){
      loadTasks();
    }

 }, [loadTasks, user, projectId]);

  const handleMove =
    async (task, status) => {

      await moveIssueStatus(
        task.projectId,
        task.id,
        status
      );

      loadTasks();
    };

  const handleProofSubmit =
    async () => {

      if(!proofFile){
        alert("Upload proof image");
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        proofFile
      );

      await resolveIssue(
        resolveModal.projectId,
        resolveModal.id,
        formData
      );

      setResolveModal(null);
      setProofFile(null);

      loadTasks();
    };

  if(loading){
    return (
      <div className="p-6">
        Loading Tasks...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Tasks
      </h1>

      <div className="grid gap-4">

        {tasks.map(task => (

          <div
            key={task.id}
            className="bg-white rounded-xl shadow p-5"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-xl">
                  {task.title}
                </h2>

                <p className="text-gray-600">
                  {task.projectName}
                </p>

              </div>

              <span>
                {task.priority}
              </span>

            </div>

            <p className="mt-3">
              {task.description}
            </p>

            <div className="mt-4">

              <strong>
                Status:
              </strong>{" "}
              {task.status}

            </div>

            <div className="flex gap-3 mt-5">

              {task.status === "Open" && (
                <button
                  onClick={() =>
                    handleMove(
                      task,
                      "In Progress"
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Start Work
                </button>
              )}

              {task.status ===
                "In Progress" && (

                <button
                  onClick={() =>
                    setResolveModal(task)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit Fix
                </button>
              )}

              {task.status ===
                "Review" && (

                <span className="text-orange-600 font-semibold">
                  Waiting For Tester
                </span>
              )}

              {task.status ===
                "Done" && (

                <span className="text-green-600 font-semibold">
                  Completed
                </span>
              )}

            </div>

          </div>

        ))}

      </div>

      {resolveModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

          <div className="bg-white p-6 rounded-xl w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              Upload Resolution Proof
            </h2>

            <input
              type="file"
              onChange={(e) =>
                setProofFile(
                  e.target.files[0]
                )
              }
            />

            <div className="flex gap-3 mt-6">

              <button
                onClick={
                  handleProofSubmit
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>

              <button
                onClick={() =>
                  setResolveModal(null)
                }
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyTasks;