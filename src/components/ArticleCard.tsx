import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ChevronDown } from 'lucide-react';
import CommentSection from './CommentSection';
import { Comment } from '../types';

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
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] border-b border-gray-800 bg-black pb-16">
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </div>

      <div className="absolute bottom-16 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-200 line-clamp-3">{extract}</p>
            <a 
              href={`https://en.wikipedia.org/?curid=${pageId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 mt-4 inline-block text-base px-4 py-2 bg-gray-900/80 rounded-full"
            >
              Read more on Wikipedia
            </a>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button 
              className="flex flex-col items-center"
              onClick={() => setIsLiked(!isLiked)}
            >
              <div className="w-12 h-12 bg-gray-900/80 rounded-full flex items-center justify-center">
                <Heart 
                  size={24} 
                  className={isLiked ? 'fill-red-500 text-red-500' : ''} 
                />
              </div>
              <span className="text-sm mt-1">{isLiked ? likes + 1 : likes}</span>
            </button>
            <button 
              className="flex flex-col items-center"
              onClick={() => setShowComments(!showComments)}
            >
              <div className="w-12 h-12 bg-gray-900/80 rounded-full flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <span className="text-sm mt-1">{comments.length}</span>
            </button>
            <button 
              className="flex flex-col items-center"
              onClick={async () => {
                const shareData = {
                  title: title,
                  text: title,
                  url: `https://en.wikipedia.org/?curid=${pageId}`
                };

                try {
                  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(`${title}\nRead more: https://en.wikipedia.org/?curid=${pageId}`);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Article link copied to clipboard!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  }
                } catch (error) {
                  console.error('Share failed:', error);
                  try {
                    await navigator.clipboard.writeText(`${title}\nRead more: https://en.wikipedia.org/?curid=${pageId}`);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Article link copied to clipboard!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  } catch (clipboardError) {
                    console.error('Clipboard failed:', clipboardError);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Unable to share article';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  }
                }
              }}
            >
              <div className="w-12 h-12 bg-gray-900/80 rounded-full flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <span className="text-sm mt-1">Share</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button onClick={() => setShowComments(false)}>
              <ChevronDown size={24} />
            </button>
          </div>
          <CommentSection comments={comments} articleId={pageId} />
        </div>
      )}
    </div>
  );
};

export default ArticleCard;