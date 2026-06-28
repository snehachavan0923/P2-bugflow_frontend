import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { validation } from '../../utils/validation';
import { alertSuccess } from '../../utils/alerts';

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validate name field
  const validateName = (value) => {
    const newErrors = { ...errors };
    
    if (!validation.isRequired(value)) {
      newErrors.name = 'Project name is required';
    } else if (!validation.minLength(value, 2)) {
      newErrors.name = 'Project name must be at least 2 characters';
    } else if (!validation.maxLength(value, 50)) {
      newErrors.name = 'Project name must not exceed 50 characters';
    } else {
      delete newErrors.name;
    }
    
    return newErrors;
  };

  // Validate description field
  const validateDescription = (value) => {
    const newErrors = { ...errors };
    
    if (value && !validation.maxLength(value, 500)) {
      newErrors.description = 'Description must not exceed 500 characters';
    } else {
      delete newErrors.description;
    }
    
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    
    if (name === 'name') {
      setErrors(validateName(value));
    } else if (name === 'description') {
      setErrors(validateDescription(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ name: true, description: true });
    
    // Validate all fields
    const nameErrors = validateName(name);
    const descErrors = validateDescription(description);
    const allErrors = { ...nameErrors, ...descErrors };
    
    setErrors(allErrors);
    
    // Prevent submit if there are errors
    if (Object.keys(allErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    
    try {
      onCreate({ name: name.trim(), description: description.trim() });
      alertSuccess('Project Created', 'Your project has been created successfully!');
      setName('');
      setDescription('');
      setErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
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
            placeholder="My Project"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
              errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.name && touched.name && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {errors.name}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.description) {
                setErrors(validateDescription(e.target.value));
              }
            }}
            onBlur={handleBlur}
            placeholder="Project description (optional)"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
              errors.description && touched.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows="3"
          />
          {errors.description && touched.description && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {errors.description}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || Object.keys(errors).length > 0}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
        >
          {submitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;