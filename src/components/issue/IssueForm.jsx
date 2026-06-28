import React, {
  useEffect,
  useState,
} from "react";

import { AlertCircle } from "lucide-react";
import { getTeamMembers }
from "../../api/teamApi";
import { validation } from "../../utils/validation";
import { alertWarning } from "../../utils/alerts";

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

    alertWarning(
      "Team Incomplete",
      "Please add at least one Developer and one Tester before creating issues."
    );
  }

}, [
  membersLoading,
  developers.length,
  testers.length,
]);

  // Validation functions
  const validateTitle = (value) => {
    const newErrors = { ...errors };
    
    if (!validation.isRequired(value)) {
      newErrors.title = 'Issue title is required';
    } else if (!validation.minLength(value, 5)) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (!validation.maxLength(value, 100)) {
      newErrors.title = 'Title must not exceed 100 characters';
    } else {
      delete newErrors.title;
    }
    
    return newErrors;
  };

  const validateDescription = (value) => {
    const newErrors = { ...errors };
    
    if (value && !validation.maxLength(value, 1000)) {
      newErrors.description = 'Description must not exceed 1000 characters';
    } else {
      delete newErrors.description;
    }
    
    return newErrors;
  };

  const validateDeveloper = (value) => {
    const newErrors = { ...errors };
    
    if (!value) {
      newErrors.developer = 'Please select a developer';
    } else {
      delete newErrors.developer;
    }
    
    return newErrors;
  };

  const validateTester = (value) => {
    const newErrors = { ...errors };
    
    if (!value) {
      newErrors.tester = 'Please select a tester';
    } else {
      delete newErrors.tester;
    }
    
    return newErrors;
  };

  const validateFile = (fileObj) => {
    const newErrors = { ...errors };
    
    if (fileObj) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      
      if (fileObj.size > maxSize) {
        newErrors.file = 'File size must not exceed 5MB';
      } else if (!allowedTypes.includes(fileObj.type)) {
        newErrors.file = 'Only images (JPG, PNG, GIF) and PDF are allowed';
      } else {
        delete newErrors.file;
      }
    } else {
      delete newErrors.file;
    }
    
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    
    if (name === 'title') {
      setErrors(validateTitle(value));
    } else if (name === 'description') {
      setErrors(validateDescription(value));
    } else if (name === 'developer') {
      setErrors(validateDeveloper(value));
    } else if (name === 'tester') {
      setErrors(validateTester(value));
    }
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (loading) return;

  // Mark all as touched
  setTouched({
    title: true,
    description: true,
    developer: true,
    tester: true,
    file: true,
  });

  // Validate all
  const titleErrs = validateTitle(title);
  const descErrs = validateDescription(description);
  const devErrs = validateDeveloper(developerUserId);
  const testErrs = validateTester(testerUserId);
  const fileErrs = validateFile(file);
  
  const allErrors = { ...titleErrs, ...descErrs, ...devErrs, ...testErrs, ...fileErrs };
  setErrors(allErrors);

  // Prevent submit if there are errors
  if (Object.keys(allErrors).length > 0) {
    return;
  }

  try {

    setLoading(true);

    await onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
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
            Title *
          </label>

          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (touched.title) {
                setErrors(validateTitle(e.target.value));
              }
            }}
            onBlur={handleBlur}
            placeholder="Brief description of the issue"
            className={`${errors.title && touched.title ? 'border-red-500 ring-red-200' : ''}`}
          />
          {errors.title && touched.title && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.title}
            </div>
          )}
        </div>

        <div className="issue-group">
          <label>
            Description
          </label>

          <textarea
            name="description"
            rows="3"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.description) {
                setErrors(validateDescription(e.target.value));
              }
            }}
            onBlur={handleBlur}
            placeholder="Detailed description (optional)"
            className={`${errors.description && touched.description ? 'border-red-500 ring-red-200' : ''}`}
          />
          {errors.description && touched.description && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.description}
            </div>
          )}
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
          Developer *
        </label>

        <select
          name="developer"
          value={developerUserId}
          onChange={(e) => {
            setDeveloperUserId(
              e.target.value
            );
            if (touched.developer) {
              setErrors(validateDeveloper(e.target.value));
            }
          }}
          onBlur={handleBlur}
          className={`${errors.developer && touched.developer ? 'border-red-500 ring-red-200' : ''}`}
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
        {errors.developer && touched.developer && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.developer}
          </div>
        )}

      </div>

      <div className="issue-group">

        <label>
          Tester *
        </label>

        <select
          name="tester"
          value={testerUserId}
          onChange={(e) => {
            setTesterUserId(
              e.target.value
            );
            if (touched.tester) {
              setErrors(validateTester(e.target.value));
            }
          }}
          onBlur={handleBlur}
          className={`${errors.tester && touched.tester ? 'border-red-500 ring-red-200' : ''}`}
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
        {errors.tester && touched.tester && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.tester}
          </div>
        )}

      </div>

        <div className="issue-group">

          <label>
            Upload Bug Image
          </label>

          <input
            type="file"
            name="file"
            onChange={(e) => {
              const fileObj = e.target.files[0];
              setFile(fileObj);
              if (touched.file) {
                setErrors(validateFile(fileObj));
              }
            }}
            onBlur={handleBlur}
          />
          {errors.file && touched.file && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.file}
            </div>
          )}

        </div>

        <button
          className="issue-btn"
          disabled={
            loading ||
            developers.length === 0 ||
            testers.length === 0 ||
            Object.keys(errors).length > 0
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