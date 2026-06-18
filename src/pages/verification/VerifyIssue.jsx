import React,
{
  useEffect,
  useState,
  useCallback
} from "react";

import {
   getProjectReviewIssues,
  approveIssue,
  rejectIssue
} from "../../api/issueApi";
import { useParams } from "react-router-dom";
const VerifyIssue = () => {

  const [issues, setIssues] =
    useState([]);
 
  const [loading, setLoading] =
    useState(true);
    
  const { projectId } = useParams();

  const [previewImage,
    setPreviewImage] =
      useState(null);

 const loadIssues =
  useCallback(async () => {

    try {

      const data =
        await getProjectReviewIssues(
          projectId
        );

      setIssues(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }

  }, [projectId]);

  useEffect(() => {

    loadIssues();

 }, [loadIssues, projectId]);

  const handleApprove =
    async (issue) => {

      await approveIssue(
        issue.projectId,
        issue.id
      );

      loadIssues();
    };

  const handleReject =
    async (issue) => {

      await rejectIssue(
        issue.projectId,
        issue.id
      );

      loadIssues();
    };

  if(loading){
    return (
      <div className="p-6">
        Loading Issues...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Verify Issues
      </h1>

      {issues.length === 0 && (

        <div className="bg-white p-6 rounded-xl shadow">

          No Issues Waiting For Verification

        </div>

      )}

      <div className="grid gap-4">

        {issues.map(issue => (

          <div
            key={issue.id}
            className="bg-white p-5 rounded-xl shadow"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-xl">
                  {issue.title}
                </h2>

                <p className="text-gray-500">
                  {issue.projectName}
                </p>

              </div>

              <span className="font-semibold">
                {issue.priority}
              </span>

            </div>

            <p className="mt-3">
              {issue.description}
            </p>

            <div className="mt-4">

              <strong>Assigned:</strong>{" "}

              {issue.assignedToName}
              {" "}
              ({issue.assignedToRole})

            </div>

            {issue.imageUrl && (

              <div className="mt-4">

                <button
                  onClick={() =>
                    setPreviewImage(
                      issue.imageUrl
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Bug Image
                </button>

              </div>

            )}

            {issue.resolutionImageUrl && (

              <div className="mt-4">

                <button
                  onClick={() =>
                    setPreviewImage(
                      issue.resolutionImageUrl
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  View Resolution Proof
                </button>

              </div>

            )}

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  handleApprove(issue)
                }
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  handleReject(issue)
                }
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

      {previewImage && (

        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() =>
            setPreviewImage(null)
          }
        >

          <div
            className="bg-white p-4 rounded-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <img
              src={previewImage}
              alt="preview"
              className="max-h-[80vh]"
            />

          </div>

        </div>

      )}

    </div>
  );
};

export default VerifyIssue;