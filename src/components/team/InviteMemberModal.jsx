import React, { useState } from "react";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onInvite(formData);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Developer",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Add Team Member
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-4">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 w-full rounded"
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
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Member
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default InviteMemberModal;