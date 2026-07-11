import React from 'react';
import { render, screen } from '@testing-library/react';
import Subscription from './Subscription';
import { getPaymentHistory, getSubscriptionOverview } from '../../api/subscriptionApi';

jest.mock('../../api/subscriptionApi', () => ({
  getSubscriptionOverview: jest.fn(),
  upgradeSubscription: jest.fn(),
  createSubscriptionPayment: jest.fn(),
  getPaymentHistory: jest.fn(),
}));

describe('Subscription page', () => {
  beforeEach(() => {
    getSubscriptionOverview.mockResolvedValue({
      plan: 'FREE',
      status: 'ACTIVE',
      projectLimit: 5,
      memberLimit: 25,
      issueLimit: 100,
      currentProjects: 3,
      currentMembers: 12,
      currentIssues: 75,
      endDate: null,
    });
    getPaymentHistory.mockResolvedValue([]);
  });

  it('renders the current plan, usage, and billing sections', async () => {
    render(<Subscription />);

    expect(await screen.findAllByText(/Current Plan/i)).toHaveLength(2);
    expect(screen.getByText(/Current Usage/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Billing/i).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/FREE/i)).length).toBeGreaterThan(0);
  });
});
