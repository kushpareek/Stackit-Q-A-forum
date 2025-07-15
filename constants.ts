import type { Notification } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'NEW_ANSWER',
    content: 'Alice answered your question: "How to vertically align a div?"',
    link: '/question/q1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    type: 'MENTION',
    content: 'You were mentioned in a comment on "Best practices for React hooks".',
    link: '/question/q2',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'COMMENT',
    content: 'Bob commented on your answer for "CSS Grid vs Flexbox".',
    link: '/question/q3',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
    {
    id: '4',
    type: 'OTHER',
    content: 'Charlie answered your question about Firebase security rules.',
    link: '/question/q4',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];
