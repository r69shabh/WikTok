export interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  replies?: Comment[];
}