import React, { useState } from 'react';
import { Heart, Reply, MoreVertical } from 'lucide-react';
import { CSSTransition } from 'react-transition-group';

interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  articleId: number;
}

const CommentComponent: React.FC<{ 
  comment: Comment; 
  depth?: number;
  onReply: (parentId: number) => void;
}> = ({ comment, depth = 0, onReply }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-800 dark:border-gray-800 light:border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold dark:text-white light:text-black">{comment.author}</span>
            <span className="text-xs text-gray-400">{comment.timestamp}</span>
          </div>
          <p className="mt-1 dark:text-gray-200 light:text-gray-800">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button 
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
              <span>{isLiked ? comment.likes + 1 : comment.likes}</span>
            </button>
            <button 
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              onClick={async () => {
                const shareData = {
                  title: `Comment by ${comment.author}`,
                  text: comment.content,
                  url: window.location.href
                };

                try {
                  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(`${comment.author}: ${comment.content}\n${window.location.href}`);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 dark:bg-gray-800 light:bg-gray-200 dark:text-white light:text-black px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Comment copied to clipboard!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  }
                } catch (error) {
                  console.error('Share failed:', error);
                  try {
                    await navigator.clipboard.writeText(`${comment.author}: ${comment.content}\n${window.location.href}`);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 dark:bg-gray-800 light:bg-gray-200 dark:text-white light:text-black px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Comment copied to clipboard!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  } catch (clipboardError) {
                    console.error('Clipboard failed:', clipboardError);
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-50';
                    notification.textContent = 'Unable to share comment';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  }
                }
              }}
            >
              <MoreVertical size={16} />
              <span>Share</span>
            </button>
            <button 
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              onClick={() => onReply(comment.id)}
            >
              <Reply size={16} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          <button
            className="text-sm text-gray-400 hover:text-gray-300"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
          </button>
          <CSSTransition
            in={showReplies}
            timeout={300}
            classNames="comment-section"
            unmountOnExit
          >
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                />
              ))}
            </div>
          </CSSTransition>
        </div>
      )}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ comments, articleId }) => {
  const [allComments, setAllComments] = useState(comments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCommentObj = {
      id: Date.now(),
      author: 'CurrentUser', // In a real app, get from auth
      content: newComment,
      likes: 0,
      timestamp: 'Just now',
      replies: []
    };

    if (replyingTo) {
      setAllComments(comments => comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newCommentObj]
          };
        }
        return comment;
      }));
      setReplyingTo(null);
      setReplyingToAuthor('');
    } else {
      setAllComments(comments => [...comments, newCommentObj]);
    }

    setNewComment('');
  };

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={300}
      classNames="comment-section"
    >
      <div className="h-full flex flex-col dark:bg-black light:bg-white">
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          {allComments.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onReply={(id) => {
                setReplyingTo(id);
                setReplyingToAuthor(comment.author);
              }}
            />
          ))}
        </div>
        <div className="sticky bottom-0 border-t dark:border-gray-800 light:border-gray-200 dark:bg-black light:bg-white p-4">
          {replyingTo && (
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm text-gray-400">
                Replying to <span className="text-blue-400">@{replyingToAuthor}</span>
              </span>
              <button 
                onClick={() => {
                  setReplyingTo(null);
                  setReplyingToAuthor('');
                }}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 flex-shrink-0" />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? `Reply to @${replyingToAuthor}...` : "Add a comment..."}
              className="flex-1 dark:bg-gray-900 light:bg-gray-100 rounded-full px-4 py-2 dark:text-white light:text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {replyingTo ? 'Reply' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </CSSTransition>
  );
};

export default CommentSection;