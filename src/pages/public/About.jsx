import { motion } from 'framer-motion';

const About = () => {

  const features = [
    {
      title: 'Smart Bug Tracking',
      desc: 'Easily report, track, and manage bugs with priorities, statuses, and detailed descriptions.',
      icon: '🐛',
    },
    {
      title: 'Project Management',
      desc: 'Organize multiple projects and tasks in a structured and efficient way.',
      icon: '📁',
    },
    {
      title: 'Kanban Workflow',
      desc: 'Visualize your workflow with drag-and-drop Kanban boards.',
      icon: '📋',
    },
    {
      title: 'Team Collaboration',
      desc: 'Assign tasks, update progress, and collaborate in real-time.',
      icon: '👥',
    },
    {
      title: 'Analytics & Reports',
      desc: 'Gain insights into productivity and project performance.',
      icon: '📊',
    },
    {
      title: 'Secure Authentication',
      desc: 'JWT-based authentication ensures secure access and data protection.',
      icon: '🔐',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">

      {/* HERO */}
      <section className="py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          About <span className="text-indigo-600">BugFlow</span>
        </motion.h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          BugFlow is a modern bug tracking and task management platform designed
          to simplify development workflows, improve collaboration, and help teams
          deliver better software faster.
        </p>
      </section>

      {/* WHAT IS BUGFLOW */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 What is BugFlow?
            </h2>

            <p className="text-gray-600 mb-4">
              BugFlow is a SaaS-based platform that helps developers and teams
              efficiently track bugs, manage tasks, and organize projects in one place.
            </p>

            <p className="text-gray-600 mb-4">
              It eliminates the need for multiple tools by combining bug tracking,
              task management, and collaboration into a single, easy-to-use system.
            </p>

            <p className="text-gray-600">
              With a clean interface and powerful features, BugFlow helps teams
              stay organized, reduce errors, and improve productivity.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Our Goal</h3>
            <p className="text-gray-600 text-sm">
              To provide a simple, powerful, and efficient solution for managing bugs and tasks.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES / SERVICES */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services & Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/70 backdrop-blur-xl p-6 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-6 bg-white/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose BugFlow?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-sm">

            {[
              'All-in-one bug tracking solution',
              'Simple and intuitive interface',
              'Improves team productivity',
              'Real-time updates and collaboration',
              'Scalable for projects of any size',
              'Secure and reliable system',
            ].map((item, i) => (
              <div key={i} className="bg-indigo-100 text-indigo-700 p-4 rounded-lg">
                {item}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
     <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Start Using BugFlow 🚀
          </h2>

          <p className="mb-6 text-indigo-100">
            Simplify your workflow and manage bugs efficiently with BugFlow.
          </p>

          <a
            href="/signup"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </a>

        </div>
      </section>

    </div>
  );
};

export default About;
