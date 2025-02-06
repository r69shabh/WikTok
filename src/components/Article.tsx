import React, { useState, useEffect } from 'react';
import { ArticleInteractions } from './ArticleInteractions';
import { Comments } from './Comments';
import { articleAPI } from '../lib/api';

interface ArticleProps {
  id: number;
  title: string;
  content: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: { username: string };
  replies?: Comment[];
  reactions: {
    likes: number;
    dislikes: number;
    userReaction?: 'like' | 'dislike';
  };
}

export const Article: React.FC<ArticleProps> = ({ id, title, content }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [id]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await articleAPI.getComments(id);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewComment = (commentData: any) => {
    if (Array.isArray(commentData)) {
      setComments(commentData);
    } else {
      setComments((prev) => [commentData, ...prev]);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="mb-4">{content}</div>
      <ArticleInteractions articleId={id} />
      <Comments 
        articleId={id} 
        comments={comments}
        onNewComment={handleNewComment}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};