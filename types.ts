
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  reputation: number;
}

export interface Answer {
  id: string;
  authorId: string;
  content: string; // HTML content from rich text editor
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
  questionId: string;
}

export interface Question {
  id:string;
  title: string;
  description: string; // HTML content from rich text editor
  tags: string[];
  authorId: string;
  views: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'NEW_ANSWER' | 'MENTION' | 'COMMENT' | 'OTHER';
  content: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
}