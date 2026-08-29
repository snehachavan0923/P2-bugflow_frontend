import React, { useState, useEffect } from "react";
import { AlertCircle, Eye, EyeOff, Search, Users } from "lucide-react";
import { validation } from "../../utils/validation";
import { getOrganizationMembers } from "../../api/organizationApi";
import { createInvitation } from "../../api/teamApi";
import { alertSuccess, alertApiError } from "../../utils/alerts";

const InviteMemberModal = ({
  projectId,
  onClose,
  onInvite,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
  });

  const [mode, setMode] = useState("existing"); // existing | invite | create
  const [orgMembers, setOrgMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

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
    // Mark touched fields depending on mode
    setTouched({
      name: mode === 'create',
      email: mode !== 'existing',
      password: mode === 'create',
      role: mode !== 'existing',
    });

    // Validate only relevant fields for current mode
    const nameErrs = mode === 'create' ? validateName(formData.name) : {};
    const emailErrs = mode === 'invite' || mode === 'create' ? validateEmail(formData.email) : {};
    const passErrs = mode === 'create' ? validatePassword(formData.password) : {};
    const roleErrs = mode === 'invite' || mode === 'create' ? validateRole(formData.role) : {};

    // Existing mode only requires a selectedMember
    const selectionErrs = {};
    if (mode === 'existing' && !selectedMember) {
      selectionErrs.selectedMember = 'Select a member to add';
    }

    const allErrors = { ...nameErrs, ...emailErrs, ...passErrs, ...roleErrs, ...selectionErrs };
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setSubmitting(true);

    try {
      if (mode === "create") {
        await onInvite({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        });

        alertSuccess("Member Added", "Team member added successfully");

      } else if (mode === "existing") {
        if (!selectedMember) {
          setErrors({ selectedMember: 'Select a member to add' });
          return;
        }

        // Use parent handler so TeamManagement handles the API call and refresh.
        await onInvite({
          name: selectedMember.name,
          email: selectedMember.email,
          password: "",
          // Do NOT send role here; backend will derive the role from the existing User record.
        });

        alertSuccess("Member Added", "Existing member added to project");

      } else if (mode === "invite") {
        // Invite by email (no password)
        await createInvitation(projectId, {
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
        });

        alertSuccess("Invitation Sent", "Invitation email sent successfully");
      }

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
      console.error("Error inviting member:", err);
      alertApiError(err, "Unable to add/invite member");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (mode === "existing") {
      (async () => {
        try {
          const members = await getOrganizationMembers();
          setOrgMembers(members || []);
        } catch (e) {
          console.error("Failed to load organization members", e);
        }
      })();
    }
  }, [mode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Add Team Member</h3>
              <p className="text-sm text-gray-500">Add existing members, invite by email, or create a new member.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${mode === "existing" ? "bg-blue-600 text-white" : "bg-gray-100 text-slate-700"}`}
            >Existing</button>
            <button
              type="button"
              onClick={() => setMode("invite")}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${mode === "invite" ? "bg-blue-600 text-white" : "bg-gray-100 text-slate-700"}`}
            >Invite</button>
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${mode === "create" ? "bg-blue-600 text-white" : "bg-gray-100 text-slate-700"}`}
            >Create</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {mode === "create" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errors.name && touched.name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm"><AlertCircle size={16} />{errors.name}</div>
              )}
            </div>
          )}

          {mode === "existing" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Search Members</label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
              </div>

              <div className="max-h-48 overflow-auto mt-3 border rounded-lg">
                {orgMembers.filter(m => {
                  const q = search.trim().toLowerCase();
                  if (!q) return true;
                  return (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q);
                }).map((m) => (
                  <div
                    key={m.email}
                    onClick={() => setSelectedMember(m)}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${selectedMember && selectedMember.email === m.email ? 'bg-blue-50' : ''}`}
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">{(m.name?.charAt(0) || 'U').toUpperCase()}</div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-slate-900">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.email}</div>
                        <div className="text-xs text-gray-500">{m.role ? m.role : ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMember && (
                <div className="mt-3 text-sm">
                  <div>Selected: <strong>{selectedMember.name}</strong> — {selectedMember.email}</div>
                  <div className="text-xs text-gray-500">Role: {selectedMember.role ? selectedMember.role : 'Not assigned'}</div>
                </div>
              )}
            </div>
          )}

          {(mode === "invite" || mode === "create") && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="john@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errors.email && touched.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm"><AlertCircle size={16} />{errors.email}</div>
              )}
            </div>
          )}

          {mode === "create" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.password && touched.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters, include uppercase, lowercase, number, and special character.</p>
              {errors.password && touched.password && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm"><AlertCircle size={16} />{errors.password}</div>
              )}
            </div>
          )}

          {mode !== 'existing' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.role && touched.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
              >
                <option value="Developer">Developer</option>
                <option value="Tester">Tester</option>
                <option value="Viewer">Viewer</option>
              </select>
              {errors.role && touched.role && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm"><AlertCircle size={16} />{errors.role}</div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={submitting || Object.keys(errors).length > 0} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition">{submitting ? (mode === 'invite' ? 'Sending...' : 'Processing...') : (mode === 'invite' ? 'Send Invitation' : (mode === 'existing' ? 'Add to Project' : 'Add Member'))}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;