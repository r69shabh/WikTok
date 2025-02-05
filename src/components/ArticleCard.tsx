import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ChevronDown, Bookmark } from 'lucide-react';
import CommentSection from './CommentSection';
import { Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface ArticleCardProps {
  title: string;
  extract: string;
  imageUrl?: string;
  pageId: number;
  likes: number;
  comments: Comment[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  extract,
  imageUrl,
  pageId,
  likes,
  comments,
}) => {
  const { isAuthenticated, showAuthModal, setShowAuthModal } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    return bookmarks.includes(pageId);
  });

  const handleInteraction = (action: () => void) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((id: number) => id !== pageId);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
    } else {
      bookmarks.push(pageId);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] border-b border-gray-800 dark:bg-black light:bg-white pb-16">
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black dark:from-gray-900 dark:to-black light:from-gray-100 light:to-white" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black dark:to-black light:to-white" />
      </div>

      <div className="absolute bottom-16 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
            <p className="text-sm text-white line-clamp-3">{extract}</p>
            <a 
              href={`https://en.wikipedia.org/?curid=${pageId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0645AD] dark:text-[#0645AD] hover:text-[#0645AD]/80 mt-4 inline-block text-base px-4 py-2 bg-gray-100/80 rounded-full"
            >
              Read more on Wikipedia
            </a>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button 
              className="flex flex-col items-center"
              onClick={() => handleInteraction(() => setIsLiked(!isLiked))}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <Heart 
                  size={24} 
                  className={isLiked ? 'fill-red-500 text-red-500' : 'fill-white text-white'} 
                />
              </div>
              <span className="text-sm mt-1 text-white">{isLiked ? likes + 1 : likes}</span>
            </button>
            <button 
              className="flex flex-col items-center"
              onClick={() => handleInteraction(() => setShowComments(!showComments))}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <MessageCircle size={24} className="fill-white text-white" />
              </div>
              <span className="text-sm mt-1 text-white">{comments.length}</span>
            </button>
            <button 
              className="flex flex-col items-center"
              onClick={() => handleInteraction(() => handleBookmark())}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <Bookmark 
                  size={24} 
                  className={isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'fill-white text-white'} 
                />
              </div>
              <span className="text-sm mt-1 text-white">Save</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <Share2 size={24} className="fill-white text-white" />
              </div>
              <span className="text-sm mt-1 text-white">Share</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="fixed inset-0 dark:bg-black light:bg-white z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 light:border-gray-200">
            <h3 className="text-lg font-semibold dark:text-white light:text-black">Comments</h3>
            <button onClick={() => setShowComments(false)}>
              <ChevronDown size={24} className="dark:text-white light:text-black" />
            </button>
          </div>
          <CommentSection comments={comments} articleId={pageId} />
        </div>
      )}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default ArticleCard;