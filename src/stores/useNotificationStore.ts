import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'trending' | 'feature' | 'system' | 'draft';
  targetRoute?: string;
}

interface NotificationStoreState {
  notifications: AppNotification[];
  isNotificationsOpen: boolean;
  unreadCount: number;

  // Actions
  toggleNotifications: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
}

const STORAGE_KEY = 'memegen_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'trending',
    title: 'Shin-chan Meme is Trending',
    message: 'Over 25,000 creators remixed the featured template today. Tap to customize in studio!',
    timestamp: '10m ago',
    isRead: false,
    targetRoute: '/editor',
  },
  {
    id: 'notif-2',
    type: 'feature',
    title: 'GIF Maker 2.0 Live',
    message: 'Turn videos or photo bursts into high-res animated GIFs with zero watermarks.',
    timestamp: '1h ago',
    isRead: false,
    targetRoute: '/gif-maker',
  },
  {
    id: 'notif-3',
    type: 'draft',
    title: 'Draft Auto-Saved',
    message: 'Your canvas workspace is safely cached in your browser. Continue editing anytime.',
    timestamp: '3h ago',
    isRead: true,
    targetRoute: '/drafts',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Community Feed Active',
    message: 'New viral memes published in Anime & Gaming. Like, comment, and remix your favorites!',
    timestamp: '1d ago',
    isRead: true,
    targetRoute: '/community',
  },
];

function loadSavedNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item: AppNotification) => ({
        ...item,
        title: item.title ? item.title.replace(/\u2728/g, '').trim() : item.title,
        message: item.message ? item.message.replace(/\u2728/g, '').trim() : item.message,
      }));
    }
    return INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

function persistNotifications(notifications: AppNotification[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // ignore storage quota errors
  }
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => {
  const initial = loadSavedNotifications();
  const initialUnread = initial.filter((n) => !n.isRead).length;

  return {
    notifications: initial,
    isNotificationsOpen: false,
    unreadCount: initialUnread,

    toggleNotifications: () =>
      set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),

    openNotifications: () => set({ isNotificationsOpen: true }),

    closeNotifications: () => set({ isNotificationsOpen: false }),

    markAsRead: (id: string) => {
      const updated = get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      persistNotifications(updated);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      });
    },

    markAllAsRead: () => {
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      persistNotifications(updated);
      set({
        notifications: updated,
        unreadCount: 0,
      });
    },

    clearAll: () => {
      persistNotifications([]);
      set({
        notifications: [],
        unreadCount: 0,
      });
    },

    addNotification: (notif) => {
      const newEntry: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        isRead: false,
      };
      const updated = [newEntry, ...get().notifications];
      persistNotifications(updated);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      });
    },
  };
});

