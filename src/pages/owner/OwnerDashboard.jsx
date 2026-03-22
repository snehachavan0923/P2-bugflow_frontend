import React from 'react';

const OwnerDashboard = () => {
  const stats = [
    { title: 'Total Projects', value: 5 },
    { title: 'Open Issues', value: 12 },
    { title: 'Assigned Tasks', value: 8 },
    { title: 'Resolved Issues', value: 20 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;