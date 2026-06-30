import { fireEvent, render, screen } from '@testing-library/react';
import IssueCard from './IssueCard';

describe('IssueCard overflow menu', () => {
  const issue = {
    id: 1,
    title: 'Issue A',
    description: 'Description',
    priority: 'High',
    assignedToName: 'Alice',
  };

  it('opens details when card clicked', () => {
    const onClick = jest.fn();
    render(
      <IssueCard issue={issue} mode="owner" onClick={onClick} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByText(/Issue A/i));
    expect(onClick).toHaveBeenCalledWith(issue);
  });

  it('opens overflow menu and prevents card open when menu clicked', () => {
    const onClick = jest.fn();
    render(
      <IssueCard issue={issue} mode="owner" onClick={onClick} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByLabelText(/open issue actions/i));
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows Edit/Delete only for owner', () => {
    render(
      <IssueCard issue={issue} mode="owner" onClick={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByLabelText(/open issue actions/i));
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('shows only View Details for non-owner', () => {
    render(
      <IssueCard issue={issue} mode="developer" onClick={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByLabelText(/open issue actions/i));
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
