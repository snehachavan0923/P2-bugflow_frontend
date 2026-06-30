import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Modal from "../common/Modal";
import { validation } from "../../utils/validation";
import { alertValidationError } from "../../utils/alerts";

const ChangePasswordModal = ({ member, isOpen, onClose, onChangePassword }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password, confirmPassword) => {
    const newErrors = {};
    const strength = validation.getPasswordStrength(password);

    if (strength.score < 3) {
      newErrors.password = strength.message;
    }

    if (confirmPassword && !validation.passwordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords must match";
    }

    return newErrors;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const newErrors = {};

    if (!validation.passwordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords must match";
    }

    if (password && validation.getPasswordStrength(password).score < 3) {
      newErrors.password = validation.getPasswordStrength(password).message;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(nextFormData);

    if (touched[name]) {
      if (name === "password") {
        setErrors(validatePassword(nextFormData.password, nextFormData.confirmPassword));
      } else if (name === "confirmPassword") {
        setErrors(validateConfirmPassword(nextFormData.password, nextFormData.confirmPassword));
      }
    }
  };

  const handleBlur = (e) => {
  const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);

    if (name === "password") {
      setErrors(validatePassword(formData.password, formData.confirmPassword));
    } else if (name === "confirmPassword") {
      setErrors(validateConfirmPassword(formData.password, formData.confirmPassword));
    }
  };

  const resetForm = () => {
    setFormData({ password: "", confirmPassword: "" });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextTouched = {
      password: true,
      confirmPassword: true,
    };
    setTouched(nextTouched);

    const nextErrors = {
      ...validatePassword(formData.password, formData.confirmPassword),
      ...validateConfirmPassword(formData.password, formData.confirmPassword),
    };
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      alertValidationError(
        "Password",
        nextErrors.password || nextErrors.confirmPassword || "Please fix the validation errors"
      );
      return;
    }

    setSubmitting(true);

    try {
    const success = await onChangePassword(
        member.id,
        formData.password
    );

    if (success) {
        resetForm();
        onClose();
    }
    } finally {
    setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={`Change Password for ${member?.name || "Member"}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            New Password
          </label>
         <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 transition ${
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters, include uppercase, lowercase, number, and special character.
          </p>
          {errors.password && touched.password && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {errors.password}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 transition ${
                errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
            />

            <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
            >
                {showConfirmPassword ? (
                <EyeOff size={18} />
                ) : (
                <Eye size={18} />
                )}
            </button>
            </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
        >
          {submitting ? "Saving..." : "Save Password"}
        </button>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
