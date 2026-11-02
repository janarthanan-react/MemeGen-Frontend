import React, { useState } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Heart,
  ShieldCheck,
  Smile,
  AlertCircle,
} from 'lucide-react';
import type { CommunityPost, PostAuthor } from '../../types/community';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  currentAuthor: PostAuthor;
  onSubmitComment: (postId: string, content: string, author: PostAuthor) => Promise<void>;
  onLike: (postId: string) => void;
  currentUserId: string;
}

function formatRelativeTime(isoString: string): string {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  post,
  currentAuthor,
  onSubmitComment,
  onLike,
  currentUserId,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!post) return null;

  const isLiked = post.likedBy?.includes(currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    if (trimmed.length > 300) {
      setErrorMessage('Comment cannot exceed 300 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmitComment(post.id, trimmed, currentAuthor);
      setCommentText('');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Meme Image & Creator Overview */}
        <div className="lg:col-span-7 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Mobile Top Bar */}
          <div className="lg:hidden p-3 bg-slate-900/90 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatarUrl || '/Profille/no-dp_16.webp'}
                alt={post.author.name}
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
                }}
              />
              <span className="text-xs font-bold truncate">{post.author.name}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Image */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 min-h-[300px] lg:min-h-[460px] max-h-[520px]">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-white flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold truncate">{post.title}</p>
              <p className="text-[11px] text-slate-400 truncate">
                Posted by {post.author.handle} • {formatRelativeTime(post.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 hover:-translate-y-0.5 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/30'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
              <span>{post.likesCount}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Comments Thread */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white text-slate-900 h-full max-h-[580px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Comments ({post.commentsCount})
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer hidden lg:block"
              aria-label="Close comments"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={comment.author.avatarUrl || '/Profille/no-dp_16.webp'}
                        alt={comment.author.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
                        }}
                      />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {comment.author.name}
                      </span>
                      {comment.author.isVerified && (
                        <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 pl-8 leading-relaxed break-words">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <Smile className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No comments yet</p>
                <p className="text-[11px]">Be the first to share what you think!</p>
              </div>
            )}
          </div>

          {/* Comment Input Footer */}
          <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Comment as ${currentAuthor.name}...`}
                maxLength={300}
                aria-label="Write a comment"
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!commentText.trim() || isSubmitting}
                isLoading={isSubmitting}
                className="rounded-xl px-3"
                aria-label="Post comment"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Local Demo Mode (stored in browser)</span>
              <span>{commentText.length}/300</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
