export const canEditProject = (user, project) => {
  return user.id === project.ownerId || user.role === 'Admin';
};

export const canDeleteIssue = (user, issue) => {
  return user.id === issue.creatorId || user.role === 'Admin';
};

export const canInviteMembers = (user, project) => {
  return user.role === 'Admin' || project.members.some(m => m.id === user.id && m.role === 'Admin');
};

export const isAdmin = (user) => {
  return user.role === 'Admin' || user.role === 'Super Admin';
};