import React from 'react';
import { Package, FileText, Users, Briefcase, Settings, PlusCircle } from 'lucide-react';

/**
 * Professional empty state component for lists and tables
 * @param {string} icon - Icon type: 'project', 'organization', 'owner', 'issue', 'team', 'file', 'default'
 * @param {string} title - Empty state title
 * @param {string} message - Empty state message
 * @param {ReactNode} action - Optional action button or element
 */
const EmptyState = ({
  icon = 'default',
  title = 'No items found',
  message = 'There are no items to display.',
  action = null,
  height = 'min-h-96',
}) => {
  const iconMap = {
    project: Package,
    organization: Briefcase,
    owner: Users,
    issue: FileText,
    team: Users,
    file: FileText,
    settings: Settings,
    default: Package,
  };

  const IconComponent = iconMap[icon] || iconMap.default;

  return (
    <div className={`flex flex-col items-center justify-center ${height} px-6 py-12`}>
      {/* Icon */}
      <div className="mb-6 p-4 bg-gray-100 rounded-full">
        <IconComponent className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">
        {message}
      </p>

      {/* Action Button */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
