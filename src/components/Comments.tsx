import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { articleAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2, Edit2, Save, X } from 'lucide-react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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

interface CommentsProps {
  articleId: number;
  comments: Comment[];
  onNewComment: (comment: Comment) => void;
  isLoading: boolean;
  error: string | null;
}

export const Comments: React.FC<CommentsProps> = ({ 
  articleId, 
  comments, 
  onNewComment, 
  isLoading,
  error 
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await articleAPI.addComment(
        articleId,
        user.id,
        content,
        parentId
      );

      if (error) throw error;
      if (data) {
        onNewComment(data);
        setContent('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await articleAPI.deleteComment(commentId);
      // Update comments list locally
      onNewComment(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEdit = async (commentId: string) => {
    try {
      const { data, error } = await articleAPI.updateComment(commentId, editContent);
      if (error) throw error;
      if (data) {
        onNewComment(comments.map(c => c.id === commentId ? { ...c, content: editContent } : c));
        setEditingId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const moreComments = await articleAPI.getComments(articleId, nextPage);
      if (moreComments.length === 0) {
        setHasMore(false);
      } else {
        onNewComment([...comments, ...moreComments]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more comments:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8' : 'border-b border-gray-200 dark:border-gray-800'} py-3`}>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.user.username}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {editingId === comment.id ? (
            <div className="mt-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(comment.id)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-gray-500 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm">{comment.content}</p>
          )}

          <div className="flex gap-4 mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleReaction(comment.id, 'like')}
                className={`flex items-center gap-1 ${
                  comment.reactions.userReaction === 'like' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <ThumbsUp size={14} />
                <span className="text-xs">{comment.reactions.likes}</span>
              </button>
              <button
                onClick={() => handleReaction(comment.id, 'dislike')}
                className={`flex items-center gap-1 ${
                  comment.reactions.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <ThumbsDown size={14} />
                <span className="text-xs">{comment.reactions.dislikes}</span>
              </button>
            </div>
            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Reply
              </button>
            )}
            
            {user?.id === comment.user_id && (
              <>
                <button
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {replyTo === comment.id && (
        <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-3 ml-8">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        </form>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  if (error) {
    return <div className="text-red-500 p-4">Error loading comments: {error}</div>;
  }

  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <form onSubmit={(e) => handleSubmit(e)} className="mb-4">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={user ? "Write a comment..." : "Please login to comment"}
              disabled={!user}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            />
          </form>

          <div className="space-y-2">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {isLoadingMore ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                'Load more comments'
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};