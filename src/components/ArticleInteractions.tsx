import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { articleAPI } from '../lib/api';
import { useSupabaseRealtime } from '../hooks/useSupabaseRealtime';

interface ArticleInteractionsProps {
  articleId: number;
}

export const ArticleInteractions: React.FC<ArticleInteractionsProps> = ({ articleId }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Initial data load
  useEffect(() => {
    loadInteractions();
  }, [articleId]);

  // Real-time updates for likes
  useSupabaseRealtime('likes', 'article_id', articleId, (payload) => {
    if (payload.eventType === 'INSERT') {
      setLikes((prev) => prev + 1);
    } else if (payload.eventType === 'DELETE') {
      setLikes((prev) => prev - 1);
    }
  });

  // Real-time updates for comments
  useSupabaseRealtime('comments', 'article_id', articleId, (payload) => {
    if (payload.eventType === 'INSERT') {
      setComments((prev) => [payload.new, ...prev]);
    }
  });

  const loadInteractions = async () => {
    const [likesCount, commentsData] = await Promise.all([
      articleAPI.getLikes(articleId),
      articleAPI.getComments(articleId)
    ]);
    setLikes(likesCount);
    setComments(commentsData);
  };

  const handleLike = async () => {
    if (!user) return;
    await articleAPI.toggleLike(articleId, user.id);
    setIsLiked(!isLiked);
  };

  const handleBookmark = async () => {
    if (!user) return;
    await articleAPI.toggleBookmark(articleId, user.id);
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={handleLike}
        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
      >
        <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        <span>{likes}</span>
      </button>

      <button className="flex items-center gap-1 text-gray-500">
        <MessageCircle size={20} />
        <span>{comments.length}</span>
      </button>

      <button 
        onClick={handleBookmark}
        className={`flex items-center gap-1 ${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
      >
        <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};