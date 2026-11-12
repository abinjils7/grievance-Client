import { Badge } from '../ui/BadgeAdapter.jsx';

const statusColors = {
  Submitted: 'slate',
  'Under Review': 'blue',
  'In Progress': 'amber',
  'Pending Review': 'blue',
  Resolved: 'green',
  Reopened: 'red',
};

export function StatusBadge({ status, actionTakenReport }) {
  const displayStatus = actionTakenReport?.submittedAt && !actionTakenReport.reviewed ? 'Pending Review' : status;
  return <Badge tone={statusColors[displayStatus] || 'slate'}>{displayStatus}</Badge>;
}
