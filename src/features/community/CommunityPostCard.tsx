import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Check,
  Repeat,
  ShieldCheck,
} from 'lucide-react';
import type { CommunityPost } from '../../types/community';
import { Badge } from '../../components/ui/Badge';
import { IconButton } from '../../components/ui/IconButton';

export interface CommunityPostCardProps {
  post: CommunityPost;
  currentUserId: string;
  onLike: (postId: string) => void;
  onOpenComments: (post: CommunityPost) => void;
  onRemix?: (post: CommunityPost) => void;
}

// Module-level helper to avoid re-invoking impure Date.now inside render
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

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onOpenComments,
  onRemix,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = post.likedBy?.includes(currentUserId);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiking(true);
    await onLike(post.id);
    setIsLiking(false);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/community#post-${post.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <article
      id={`post-${post.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* Post Header: Creator Info & Category Badge */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-2xs">
            <img
              src={post.author.avatarUrl || '/Profille/no-dp_16.webp'}
              alt={post.author.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
              }}
            />
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {post.author.name}
              </span>
              {post.author.isVerified && (
                <span title="Verified Creator" className="inline-flex">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="truncate">{post.author.handle}</span>
              <span>•</span>
              <span className="shrink-0">{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <Badge variant="primary" size="sm">
          {post.category}
        </Badge>
      </div>

      {/* Post Image with Hover Quick-View */}
      <div
        onClick={() => onOpenComments(post)}
        className="relative bg-slate-950 aspect-square w-full overflow-hidden cursor-pointer flex items-center justify-center select-none"
      >
        <img
          src={post.imageUrl}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 ease-out"
        />

        {/* Quick Click Hint Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            View Comments ({post.commentsCount})
          </span>
        </div>
      </div>

      {/* Post Caption & Details */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight line-clamp-2">
            {post.title}
          </h2>

          {post.caption && post.caption !== post.title && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {post.caption}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Like & Comment Buttons */}
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLikeClick}
              disabled={isLiking}
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1463E9] border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
                }`}
              />
              <span>{post.likesCount}</span>
            </button>

            {/* Comments Trigger */}
            <button
              type="button"
              onClick={() => onOpenComments(post)}
              aria-label="View comments"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1463E9] border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
            >
              <MessageCircle className="w-4 h-4 text-slate-400" />
              <span>{post.commentsCount}</span>
            </button>
          </div>

          {/* Right Actions: Share & Remix */}
          <div className="flex items-center gap-1.5">
            {/* Share Button */}
            <IconButton
              variant="outline"
              size="sm"
              onClick={handleShareClick}
              aria-label="Share post link"
              title={copied ? 'Link copied!' : 'Share meme'}
              className={copied ? 'text-emerald-600 border-emerald-300 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            </IconButton>

            {/* Remix in Editor Button */}
            {onRemix && (
              <IconButton
                variant="outline"
                size="sm"
                onClick={() => onRemix(post)}
                aria-label="Remix in Meme Editor"
                title="Remix in Meme Editor"
                className="text-[#1463E9] hover:text-[#0E52C7] hover:bg-[#EFF6FF] border-[#1463E9]/30 hover:border-[#1463E9]"
              >
                <Repeat className="w-3.5 h-3.5 text-[#1463E9]" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
