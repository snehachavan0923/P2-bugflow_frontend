import React from 'react';

const About = () => {
  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '50,000+', label: 'Issues Tracked' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former engineering lead at TechCorp with 10+ years in software development.',
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Ex-Google engineer specializing in scalable systems and user experience.',
    },
    {
      name: 'Emily Davis',
      role: 'Head of Product',
      bio: 'Product manager with experience at leading SaaS companies.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BugFlow</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            We're on a mission to make bug tracking simple, efficient, and collaborative for teams worldwide.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                BugFlow was born from the frustration of dealing with complex, expensive bug tracking tools
                that didn't meet the needs of modern development teams. Our founders experienced firsthand
                the pain of managing issues across multiple projects and teams.
              </p>
              <p className="text-gray-600 mb-4">
                In 2020, we set out to build a better solution. We focused on simplicity, collaboration,
                and powerful features that actually help teams ship better software faster.
              </p>
              <p className="text-gray-600">
                Today, BugFlow serves thousands of teams worldwide, from startups to Fortune 500 companies,
                helping them track bugs, manage projects, and improve their development workflows.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To empower development teams with the best tools for tracking and resolving issues,
                  fostering collaboration and driving software quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Simplicity',
                description: 'We believe great tools should be intuitive and easy to use.',
                icon: '🎨',
              },
              {
                title: 'Collaboration',
                description: 'Teamwork is at the heart of everything we build.',
                icon: '🤝',
              },
              {
                title: 'Innovation',
                description: 'We continuously improve and adapt to meet evolving needs.',
                icon: '🚀',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-indigo-100">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;