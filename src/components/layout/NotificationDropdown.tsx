import React, { useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Zap,
  Flame,
  Bookmark,
  MessageSquare,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { useNotificationStore, type AppNotification } from '../../stores/useNotificationStore';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (item: AppNotification) => {
    markAsRead(item.id);
    onClose();
    if (item.targetRoute && onNavigate) {
      onNavigate(item.targetRoute);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'trending':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'feature':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'draft':
        return <Bookmark className="w-4 h-4 text-emerald-400" />;
      case 'system':
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <>
      {/* Backdrop overlay for focus trapping & dismissing */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-label="User notifications"
        aria-modal="true"
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#071330]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] p-3 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10 px-1">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-slate-300 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-white/10 transition-all duration-150 active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Read all</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-medium text-slate-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-950/30 transition-all duration-150 active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[340px] overflow-y-auto space-y-1.5 pr-0.5 divide-y divide-white/5">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 group pt-2.5 ${
                  item.isRead
                    ? 'hover:bg-white/5 opacity-85 hover:opacity-100'
                    : 'bg-white/10 hover:bg-white/15 border-l-2 border-cyan-400 pl-2.5 shadow-xs'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  {item.targetRoute && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400 font-semibold group-hover:underline">
                      <span>View details</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center space-y-2 text-slate-400">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">You&apos;re all caught up!</p>
              <p className="text-[11px] text-slate-400">
                No new notifications right now. Check back when templates trend.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 mt-2 border-t border-white/10 px-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>Local Demo Storage</span>
          <span>{notifications.length} total</span>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
