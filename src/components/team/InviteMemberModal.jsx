import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { validation } from "../../utils/validation";

const InviteMemberModal = ({
  onClose,
  onInvite,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateName = (value) => {
    const newErrors = { ...errors };
    
    if (!validation.isRequired(value)) {
      newErrors.name = 'Name is required';
    } else if (!validation.minLength(value, 2)) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!validation.maxLength(value, 50)) {
      newErrors.name = 'Name must not exceed 50 characters';
    } else {
      delete newErrors.name;
    }
    
    return newErrors;
  };

  const validateEmail = (value) => {
    const newErrors = { ...errors };
    
    if (!validation.isRequired(value)) {
      newErrors.email = 'Email is required';
    } else if (!validation.isValidEmail(value)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      delete newErrors.email;
    }
    
    return newErrors;
  };

  const validatePassword = (value) => {
    const newErrors = { ...errors };
    const strength = validation.getPasswordStrength(value);
    
    if (strength.score < 3) {
      newErrors.password = strength.message;
    } else {
      delete newErrors.password;
    }
    
    return newErrors;
  };

  const validateRole = (value) => {
    const newErrors = { ...errors };
    const validRoles = ['Developer', 'Tester', 'Viewer'];
    
    if (!validRoles.includes(value)) {
      newErrors.role = 'Invalid role selected';
    } else {
      delete newErrors.role;
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      if (name === 'name') {
        setErrors(validateName(value));
      } else if (name === 'email') {
        setErrors(validateEmail(value));
      } else if (name === 'password') {
        setErrors(validatePassword(value));
      } else if (name === 'role') {
        setErrors(validateRole(value));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    
    if (name === 'name') {
      setErrors(validateName(value));
    } else if (name === 'email') {
      setErrors(validateEmail(value));
    } else if (name === 'password') {
      setErrors(validatePassword(value));
    } else if (name === 'role') {
      setErrors(validateRole(value));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      role: true,
    });

    // Validate all
    const nameErrs = validateName(formData.name);
    const emailErrs = validateEmail(formData.email);
    const passErrs = validatePassword(formData.password);
    const roleErrs = validateRole(formData.role);
    
    const allErrors = { ...nameErrs, ...emailErrs, ...passErrs, ...roleErrs };
    setErrors(allErrors);

    // Prevent submit if there are errors
    if (Object.keys(allErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await onInvite({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    });

    // ONLY if request succeeded
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Developer",
    });

    setErrors({});
    setTouched({});

    onClose();
    } catch (err) {
      console.error('Error inviting member:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Add Team Member
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`border p-2 w-full rounded focus:outline-none focus:ring-2 transition ${
                errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && touched.name && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john@example.com"
              className={`border p-2 w-full rounded focus:outline-none focus:ring-2 transition ${
                errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && touched.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Password
              <span className="text-xs font-normal text-gray-500 ml-1">
                (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
              </span>
            </label>
         <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className={`w-full border p-2 pr-10 rounded focus:outline-none focus:ring-2 transition ${
                errors.password && touched.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
            {errors.password && touched.password && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-2 w-full rounded focus:outline-none focus:ring-2 transition ${
                errors.role && touched.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="Developer">
                Developer
              </option>

              <option value="Tester">
                Tester
              </option>

              <option value="Viewer">
                Viewer
              </option>
            </select>
            {errors.role && touched.role && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.role}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || Object.keys(errors).length > 0}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Adding...' : 'Add Member'}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default InviteMemberModal;