import React, { useState } from 'react';
import { AlertCircle, FolderPlus, Loader2, X } from 'lucide-react';
import Modal from '../common/Modal';
import { validation } from '../../utils/validation';
import { alertApiError, alertSuccess } from '../../utils/alerts';

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateName = (value) => {
    const nextErrors = { ...errors };

    if (!validation.isRequired(value)) {
      nextErrors.name = 'Project name is required';
    } else if (!validation.minLength(value, 2)) {
      nextErrors.name = 'Project name must be at least 2 characters';
    } else if (!validation.maxLength(value, 50)) {
      nextErrors.name = 'Project name must not exceed 50 characters';
    } else {
      delete nextErrors.name;
    }

    return nextErrors;
  };

  const validateDescription = (value) => {
    const nextErrors = { ...errors };

    if (value && !validation.maxLength(value, 500)) {
      nextErrors.description = 'Description must not exceed 500 characters';
    } else {
      delete nextErrors.description;
    }

    return nextErrors;
  };

  const handleBlur = (e) => {
    const { name: fieldName, value } = e.target;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    if (fieldName === 'name') {
      setErrors(validateName(value));
    } else if (fieldName === 'description') {
      setErrors(validateDescription(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ name: true, description: true });

    const nameErrors = validateName(name);
    const descErrors = validateDescription(description);
    const allErrors = { ...nameErrors, ...descErrors };

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({ name: name.trim(), description: description.trim() });
      alertSuccess('Project Created', 'Your project has been created successfully!');
      setName('');
      setDescription('');
      setErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      alertApiError(err, 'Unable to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBaseClass =
    'w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-4';

  const renderError = (field) => {
    if (!errors[field] || !touched[field]) return null;

    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600" id={`${field}-error`}>
        <AlertCircle className="h-4 w-4" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="-mt-2">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Create Project</h2>
              <p className="mt-1 text-sm text-slate-500">Set up a new project to organize and track your work.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close create project modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form id="create-project-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="project-name" className="block text-sm font-medium text-slate-700">
                Project name
              </label>
              <span className="text-xs text-slate-400">Required</span>
            </div>

            <input
              id="project-name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) {
                  setErrors(validateName(e.target.value));
                }
              }}
              onBlur={handleBlur}
              placeholder="e.g. Website Redesign"
              aria-invalid={Boolean(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              className={`${inputBaseClass} ${
                errors.name && touched.name
                  ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />

            <p className="mt-1.5 text-xs text-slate-500">Choose a clear name for your project.</p>
            {renderError('name')}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="project-description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <span className="text-xs text-slate-400">Optional</span>
            </div>

            <p className="mb-2 text-xs text-slate-500">Add a short description to help your team understand the project.</p>

            <textarea
              id="project-description"
              name="description"
              value={description}
              rows={5}
              onChange={(e) => {
                setDescription(e.target.value);
                if (touched.description) {
                  setErrors(validateDescription(e.target.value));
                }
              }}
              onBlur={handleBlur}
              placeholder="Describe what this project is about..."
              aria-invalid={Boolean(errors.description && touched.description)}
              aria-describedby={errors.description && touched.description ? 'description-error' : undefined}
              className={`${inputBaseClass} min-h-[120px] resize-y ${
                errors.description && touched.description
                  ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <div>{renderError('description')}</div>
              <span className="text-xs font-medium text-slate-400">{description.length} / 500</span>
            </div>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-project-form"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
