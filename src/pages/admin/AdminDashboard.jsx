import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardStats } from '../../api/adminDashboardApi';
import { formatRelativeTime } from '../../utils/helpers';
import './AdminDashboard.css';
import {
  Building,
  CreditCard,
  UserPlus,
  FolderOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart,
  FileText,
  AlertTriangle,
  Inbox,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminDashboardStats();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      ORGANIZATION: <Building size={16} />,
      USER: <UserPlus size={16} />,
      PAYMENT: <CreditCard size={16} />,
      SUBSCRIPTION: <TrendingUp size={16} />,
      PROJECT: <FolderOpen size={16} />,
    };
    return icons[type] || <FileText size={16} />;
  };

  const getActivityIconClass = (type) => `activity-icon ${type?.toLowerCase()}`;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const KPICard = ({ title, value, icon, className, description }) => (
    <div className="kpi-card compact">
      <div className="kpi-top">
        <div className={`kpi-icon-square ${className}`}>{icon}</div>
        <div className="kpi-title-row">
          <p className="kpi-title">{title}</p>
        </div>
      </div>

      <div className="kpi-value-large">{value}</div>
      {description && <p className="kpi-desc">{description}</p>}
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="activity-item">
      <div className={getActivityIconClass(activity.type)}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="activity-content">
        <div className="activity-row">
          <div className="activity-title">{activity.title}</div>
          <div className="activity-time">{formatRelativeTime(activity.createdAt)}</div>
        </div>
        {activity.description && <div className="activity-description">{activity.description}</div>}
      </div>
    </div>
  );

  const RecentActivitiesRenderer = ({ activities = [] }) => {
    const limit = 5;
    const total = activities.length;
    const visible = showAllActivities ? activities : activities.slice(0, limit);

    return (
      <>
        <div className="activity-list">
          {visible.map((activity, i) => (
            <ActivityItem key={i} activity={activity} />
          ))}
        </div>
        {total > limit && (
          <div className="activity-view-toggle">
            <button className="view-toggle-button" onClick={() => setShowAllActivities((s) => !s)}>
              {showAllActivities ? 'Show Less' : `View All (+${total - limit})`}
            </button>
          </div>
        )}
      </>
    );
  };

  const QuickActionCard = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="action-card modern action-vertical">
      <div className="action-icon-square">{icon}</div>
      <div className="action-body">
        <div className="action-card-title">{title}</div>
        <div className="action-card-desc">{description}</div>
      </div>
    </button>
  );

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="max-w-7xl mx-auto">
          <div className="error-container">
            <div className="error-icon">
              <AlertTriangle size={36} color="#dc2626" />
            </div>
            <div className="error-message">Error Loading Dashboard</div>
            <div className="error-description">{error}</div>
            <button className="retry-button" onClick={fetchDashboardData}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="max-w-7xl mx-auto">
          <div className="dashboard-header">
            <div className="loading-skeleton loading-bar" style={{ width: '30%', height: '2rem' }}></div>
            <div className="loading-skeleton loading-text mt-2" style={{ width: '50%', height: '0.875rem' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-card">
                <div className="loading-skeleton loading-bar"></div>
                <div className="loading-skeleton loading-bar"></div>
                <div className="loading-skeleton loading-text"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 loading-card" style={{ height: '400px' }}></div>
            <div className="loading-card" style={{ height: '400px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle text-gray-600 mt-2">
            Welcome back! Monitor your platform's key metrics and recent activities.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Organizations"
            value={dashboardData?.totalOrganizations || 0}
            icon={<Building size={22} />}
            className="organizations"
            description="All registered organizations"
          />
          <KPICard
            title="Total Users"
            value={dashboardData?.totalUsers || 0}
            icon={<UserPlus size={22} />}
            className="users"
            description="All platform users"
          />
          <KPICard
            title="Total Projects"
            value={dashboardData?.totalProjects || 0}
            icon={<FolderOpen size={22} />}
            className="projects"
            description="All active projects"
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(dashboardData?.totalRevenue)}
            icon={<CreditCard size={22} />}
            className="revenue"
            description="Lifetime platform revenue"
          />
        </div>

        {/* Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="subscription-card sub-refined">
            <div className="kpi-top">
              <div className="kpi-icon-square sub-active"><CheckCircle size={22}/></div>
              <div className="kpi-title-row"><p className="kpi-title">Active Subscriptions</p></div>
            </div>
            <div className="kpi-value-large">{dashboardData?.activeSubscriptions || 0}</div>
            <p className="kpi-desc">Current active subscriptions</p>
          </div>

          <div className="subscription-card sub-refined">
            <div className="kpi-top">
              <div className="kpi-icon-square sub-expired"><Clock size={22}/></div>
              <div className="kpi-title-row"><p className="kpi-title">Expired Subscriptions</p></div>
            </div>
            <div className="kpi-value-large">{dashboardData?.expiredSubscriptions || 0}</div>
            <p className="kpi-desc">Subscriptions expired recently</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 activity-section">
            <div className="activity-header">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
              <RecentActivitiesRenderer activities={dashboardData.recentActivities} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><Inbox size={36} /></div>
                <div className="empty-state-text">No recent activities</div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickActionCard title="Revenue Analytics" description="View platform revenue trends" icon={<BarChart size={20} />} onClick={() => navigate('/admin/revenue')} />
              <QuickActionCard title="Plan Management" description="Manage subscription plans" icon={<TrendingUp size={20} />} onClick={() => navigate('/admin/plans')} />
              <QuickActionCard title="Payment History" description="View all payments" icon={<CreditCard size={20} />} onClick={() => navigate('/admin/history')} />
              <QuickActionCard title="Subscriptions" description="Manage subscriptions" icon={<CheckCircle size={20} />} onClick={() => navigate('/admin/subscriptions')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
