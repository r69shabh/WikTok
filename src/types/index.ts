export interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  token?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  extract: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Notification {
  id: string;
  user_id: string;
  content: string;
  type: 'like' | 'comment' | 'mention';
  read: boolean;
  created_at: string;
}