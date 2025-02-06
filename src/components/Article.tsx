import React, { useState, useEffect } from 'react';
import { ArticleInteractions } from './ArticleInteractions';
import { Comments } from './Comments';
import Reader from './Reader';
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
  const [showReader, setShowReader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullContent, setFullContent] = useState('');

  const handleTitleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`
      );
      const articleContent = await response.text();
      setFullContent(articleContent);
      setShowReader(true);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h2 
          onClick={handleTitleClick}
          className="text-xl font-bold mb-2 cursor-pointer hover:text-blue-500 transition-colors duration-200 active:text-blue-600"
        >
          {title}
        </h2>
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

      {showReader && (
        <Reader
          title={title}
          content={fullContent || content}
          onClose={() => setShowReader(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};