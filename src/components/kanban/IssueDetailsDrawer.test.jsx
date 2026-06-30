import { render, screen } from '@testing-library/react';
import IssueDetailsDrawer from './IssueDetailsDrawer';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('IssueDetailsDrawer delete action', () => {
  const baseIssue = {
    id: 1,
    title: 'Bug report',
    description: 'A sample issue',
    priority: 'High',
    status: 'Open',
    assignedToEmail: 'owner@example.com',
    assignedToName: 'Owner User',
    assignedToRole: 'Owner',
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: { email: 'owner@example.com' } });
  });

  it('shows the delete button for owner mode', () => {
    render(
      <IssueDetailsDrawer
        issue={baseIssue}
        mode="owner"
        onClose={() => {}}
        onEditIssue={() => {}}
        onMoveIssue={() => {}}
        onResolveIssue={() => {}}
        onApproveIssue={() => {}}
        onRejectIssue={() => {}}
        onOpenImage={() => {}}
        onOpenEdit={() => {}}
        onOpenResolve={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('hides the delete button for non-owner modes', () => {
    render(
      <IssueDetailsDrawer
        issue={baseIssue}
        mode="developer"
        onClose={() => {}}
        onEditIssue={() => {}}
        onMoveIssue={() => {}}
        onResolveIssue={() => {}}
        onApproveIssue={() => {}}
        onRejectIssue={() => {}}
        onOpenImage={() => {}}
        onOpenEdit={() => {}}
        onOpenResolve={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
