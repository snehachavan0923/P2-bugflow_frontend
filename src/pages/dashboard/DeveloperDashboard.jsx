import React from "react";

const DeveloperDashboard = () => {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Developer Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold">
            Assigned Tasks
          </h3>
          <p className="text-3xl mt-3">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold">
            In Progress
          </h3>
          <p className="text-3xl mt-3">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold">
            Review
          </h3>
          <p className="text-3xl mt-3">
            0
          </p>
        </div>

      </div>

    </div>
  );
};

export default DeveloperDashboard;