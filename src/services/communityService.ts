import type {
  CommunityPost,
  PostComment,
  PostAuthor,
  CommunityFilterState,
  PublishMemePayload,
} from '../types/community';

const COMMUNITY_STORAGE_KEY = 'memegen_community_posts_v2';

// In-memory fallback if localStorage is disabled or throws quota errors
let memoryPosts: CommunityPost[] | null = null;

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Initial curated seed posts so the community is lively right on Day 7 launch.
 * All posts use local static assets or reliable public images.
 */
function createInitialSeedPosts(): CommunityPost[] {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  return [
    {
      id: 'post-1',
      title: "When someone compliments my code review",
      caption: "I am not really that special, but thanks anyway!",
      imageUrl: '/shinchan-meme.jpg',
      category: 'Anime',
      author: {
        id: 'author-shinchan',
        name: 'Shinchan Nohara',
        handle: '@shinchan_dev',
        avatarUrl: '/Profille/no-dp_16.webp',
        isVerified: true,
      },
      likesCount: 142,
      likedBy: [],
      commentsCount: 3,
      comments: [
        {
          id: 'c-101',
          postId: 'post-1',
          author: {
            id: 'u-kazama',
            name: 'Kazama',
            handle: '@kazama_elite',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Classic Shinchan moment! Great meme.',
          createdAt: new Date(now - 45 * minute).toISOString(),
        },
        {
          id: 'c-102',
          postId: 'post-1',
          author: {
            id: 'u-masao',
            name: 'Masao',
            handle: '@masao_anxious',
            avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Literally me in daily standup this morning haha',
          createdAt: new Date(now - 25 * minute).toISOString(),
        },
        {
          id: 'c-103',
          postId: 'post-1',
          author: {
            id: 'u-actionkamen',
            name: 'Action Kamen',
            handle: '@action_hero',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            isVerified: true,
          },
          content: 'WAHAHAHA! High quality meme energy!',
          createdAt: new Date(now - 10 * minute).toISOString(),
        },
      ],
      createdAt: new Date(now - 2 * hour).toISOString(),
      tags: ['shinchan', 'coding', 'humor', 'relatable'],
    },
    {
      id: 'post-2',
      title: "WiFi went down for literally 4 minutes",
      caption: "Guess I have to go outside and experience reality now...",
      imageUrl: '/comm-wifi-down.jpg',
      category: 'Tech/Dev',
      author: {
        id: 'author-techie',
        name: 'Alex Rivera',
        handle: '@alex_codes',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        isVerified: true,
      },
      likesCount: 389,
      likedBy: [],
      commentsCount: 2,
      comments: [
        {
          id: 'c-201',
          postId: 'post-2',
          author: {
            id: 'u-sarah',
            name: 'Sarah Connor',
            handle: '@sarah_dev',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          },
          content: 'The graphics outside are great, but the storyline is terrible.',
          createdAt: new Date(now - 3 * hour).toISOString(),
        },
        {
          id: 'c-202',
          postId: 'post-2',
          author: {
            id: 'u-dan',
            name: 'Dan Abramov Fan',
            handle: '@react_enthusiast',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          },
          content: 'I started talking to my family. They seem like nice people.',
          createdAt: new Date(now - 1 * hour).toISOString(),
        },
      ],
      createdAt: new Date(now - 6 * hour).toISOString(),
      tags: ['wifi', 'tech', 'internet', 'offline'],
    },
    {
      id: 'post-3',
      title: "Monday Morning Buffering Sequence",
      caption: "Please do not speak to me before 10 AM.",
      imageUrl: '/comm-monday.jpg',
      category: 'Reactions',
      author: {
        id: 'author-coffee',
        name: 'Maya Patel',
        handle: '@maya_design',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      },
      likesCount: 512,
      likedBy: [],
      commentsCount: 1,
      comments: [
        {
          id: 'c-301',
          postId: 'post-3',
          author: {
            id: 'u-coffee-bot',
            name: 'Barista Bob',
            handle: '@espresso_shots',
            avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Sending emergency caffeine your way ☕',
          createdAt: new Date(now - 4 * hour).toISOString(),
        },
      ],
      createdAt: new Date(now - 14 * hour).toISOString(),
      tags: ['monday', 'tired', 'coffee', 'mood'],
    },
    {
      id: 'post-4',
      title: "First deploy on Friday at 4:59 PM",
      caption: "What could possibly go wrong? Everything is fine.",
      imageUrl: '/comm-prod-bug.jpg',
      category: 'Tech/Dev',
      author: {
        id: 'author-devops',
        name: 'DevOps Dave',
        handle: '@dave_pipelines',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        isVerified: true,
      },
      likesCount: 890,
      likedBy: [],
      commentsCount: 2,
      comments: [
        {
          id: 'c-401',
          postId: 'post-4',
          author: {
            id: 'u-lead',
            name: 'Lead Architect',
            handle: '@who_approved_this',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          },
          content: 'PAGERDUTY SOUNDS INTENSIFY!',
          createdAt: new Date(now - 8 * hour).toISOString(),
        },
        {
          id: 'c-402',
          postId: 'post-4',
          author: {
            id: 'u-intern',
            name: 'New Intern',
            handle: '@first_day_here',
            avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
          },
          content: 'I only changed one line of CSS I swear...',
          createdAt: new Date(now - 5 * hour).toISOString(),
        },
      ],
      createdAt: new Date(now - 1 * day).toISOString(),
      tags: ['devops', 'friday', 'production', 'bug'],
    },
    {
      id: 'post-5',
      title: "Coffee first, then we can talk about life",
      caption: "Cheers to everyone making it through this sprint ☕",
      imageUrl: '/comm-coffee-first.jpg',
      category: 'Classics',
      author: {
        id: 'author-leo',
        name: 'Leo Gatsby',
        handle: '@cheers_leo',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      },
      likesCount: 673,
      likedBy: [],
      commentsCount: 1,
      comments: [
        {
          id: 'c-501',
          postId: 'post-5',
          author: {
            id: 'u-coffee-lover',
            name: 'Elena',
            handle: '@elena_caffeine',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Best toast of all time!',
          createdAt: new Date(now - 12 * hour).toISOString(),
        },
      ],
      createdAt: new Date(now - 1.5 * day).toISOString(),
      tags: ['coffee', 'cheers', 'classic', 'sprint'],
    },
    {
      id: 'post-6',
      title: "Cat debugging my React state machine",
      caption: "Senior QA engineer spotted an unhandled null pointer exception.",
      imageUrl: '/comm-cat-debugger.jpg',
      category: 'Animals',
      author: {
        id: 'author-cat',
        name: 'Whisker Labs',
        handle: '@cat_debugger',
        avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80',
      },
      likesCount: 945,
      likedBy: [],
      commentsCount: 2,
      comments: [
        {
          id: 'c-601',
          postId: 'post-6',
          author: {
            id: 'u-felix',
            name: 'Felix',
            handle: '@paw_coder',
            avatarUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Promote this cat to Principal Engineer immediately.',
          createdAt: new Date(now - 1 * day).toISOString(),
        },
        {
          id: 'c-602',
          postId: 'post-6',
          author: {
            id: 'u-doggo',
            name: 'Good Boy',
            handle: '@canine_dev',
            avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&auto=format&fit=crop&q=80',
          },
          content: 'Cats write bug-free code because they do not care about deadlines.',
          createdAt: new Date(now - 10 * hour).toISOString(),
        },
      ],
      createdAt: new Date(now - 2 * day).toISOString(),
      tags: ['cat', 'pets', 'debugging', 'animals'],
    },
  ];
}

class CommunityService {
  /**
   * Safe getter for all posts from localStorage
   */
  private loadRawPosts(): CommunityPost[] {
    if (!isLocalStorageAvailable()) {
      if (!memoryPosts) {
        memoryPosts = createInitialSeedPosts();
      }
      return memoryPosts;
    }

    try {
      const raw = window.localStorage.getItem(COMMUNITY_STORAGE_KEY);
      if (!raw) {
        const seed = createInitialSeedPosts();
        window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      // Re-seed if empty array
      const seed = createInitialSeedPosts();
      window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    } catch (err) {
      console.warn('[CommunityService] Failed to read from localStorage, using memory storage', err);
      if (!memoryPosts) {
        memoryPosts = createInitialSeedPosts();
      }
      return memoryPosts;
    }
  }

  /**
   * Safe saver to localStorage with quota error fallback
   */
  private saveRawPosts(posts: CommunityPost[]): boolean {
    memoryPosts = posts;

    if (!isLocalStorageAvailable()) return true;

    try {
      window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(posts));
      return true;
    } catch (err) {
      console.warn('[CommunityService] LocalStorage quota exceeded or write failed; using memory fallback', err);
      return false;
    }
  }

  /**
   * Fetch posts with category, search, and sorting applied
   */
  public async getPosts(filters?: Partial<CommunityFilterState>): Promise<{
    posts: CommunityPost[];
    total: number;
    isDemo: boolean;
  }> {
    // Artificial small delay to reflect natural reactive loading
    await new Promise((res) => setTimeout(res, 80));

    let list = [...this.loadRawPosts()];

    // 1. Filter by category
    if (filters?.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase();
      list = list.filter((p) => p.category.toLowerCase() === cat);
    }

    // 2. Filter by search query
    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.caption?.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.author.handle.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    const sort = filters?.sortBy || 'trending';
    if (sort === 'latest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'most-liked') {
      list.sort((a, b) => b.likesCount - a.likesCount);
    } else {
      // 'trending' = score weighted by likes count and recency
      list.sort((a, b) => {
        const timeDiffA = Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 3600));
        const timeDiffB = Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 3600));
        const scoreA = a.likesCount / Math.pow(timeDiffA, 0.7);
        const scoreB = b.likesCount / Math.pow(timeDiffB, 0.7);
        return scoreB - scoreA;
      });
    }

    return {
      posts: list,
      total: list.length,
      isDemo: true,
    };
  }

  /**
   * Toggle Like on a post. Guarantees no duplicate likes per user!
   */
  public async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ post: CommunityPost; isLiked: boolean }> {
    const list = this.loadRawPosts();
    const idx = list.findIndex((p) => p.id === postId);

    if (idx === -1) {
      throw new Error(`Post with id "${postId}" not found`);
    }

    const post = { ...list[idx] };
    const likedSet = new Set(post.likedBy || []);
    const isLikedNow = !likedSet.has(userId);

    if (!isLikedNow) {
      // Already liked -> Unlike
      likedSet.delete(userId);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Not yet liked -> Like
      likedSet.add(userId);
      post.likesCount += 1;
    }

    post.likedBy = Array.from(likedSet);
    list[idx] = post;
    this.saveRawPosts(list);

    return { post, isLiked: isLikedNow };
  }

  /**
   * Add a comment to a post with validation
   */
  public async addComment(
    postId: string,
    content: string,
    author: PostAuthor
  ): Promise<PostComment> {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Comment cannot be empty.');
    }
    if (trimmed.length > 300) {
      throw new Error('Comment cannot exceed 300 characters.');
    }

    const list = this.loadRawPosts();
    const idx = list.findIndex((p) => p.id === postId);

    if (idx === -1) {
      throw new Error(`Post with id "${postId}" not found`);
    }

    const newComment: PostComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      postId,
      author,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const post = { ...list[idx] };
    post.comments = [newComment, ...(post.comments || [])];
    post.commentsCount = post.comments.length;

    list[idx] = post;
    this.saveRawPosts(list);

    return newComment;
  }

  /**
   * Publish a new community meme post
   */
  public async publishPost(
    payload: PublishMemePayload,
    author: PostAuthor
  ): Promise<CommunityPost> {
    const title = payload.title.trim();
    if (!title || title.length < 3) {
      throw new Error('Title must be at least 3 characters.');
    }
    if (title.length > 120) {
      throw new Error('Title cannot exceed 120 characters.');
    }
    if (!payload.imageUrl) {
      throw new Error('An image is required to publish a meme.');
    }

    const list = this.loadRawPosts();

    const newPost: CommunityPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      caption: title,
      imageUrl: payload.imageUrl,
      category: payload.category || 'Trending',
      author,
      likesCount: 1, // Author automatically likes their own post
      likedBy: [author.id],
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      tags: payload.tags || ['meme', payload.category?.toLowerCase() || 'fun'],
      isLocalUserPost: true,
    };

    // Prepend newly published post so it appears first in the feed
    list.unshift(newPost);
    this.saveRawPosts(list);

    return newPost;
  }

  /**
   * Reset community storage back to seed posts
   */
  public resetToSeed(): void {
    const seed = createInitialSeedPosts();
    this.saveRawPosts(seed);
  }
}

export const communityService = new CommunityService();
