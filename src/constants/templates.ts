import type { MemeTemplate } from '../types/template';

export type MemeCategory =
  | 'All'
  | 'Trending'
  | 'Classic'
  | 'Animals'
  | 'Movies & TV'
  | 'Reactions'
  | 'Gaming'
  | 'Business';

export const TEMPLATE_CATEGORIES: MemeCategory[] = [
  'All',
  'Trending',
  'Classic',
  'Animals',
  'Movies & TV',
  'Reactions',
  'Gaming',
  'Business',
];

/**
 * The exact 12 meme templates displayed in the design screenshot:
 * Row 1: Drake Hotline Bling, Distracted Boyfriend, Two Buttons, Change My Mind, Expanding Brain, This Is Fine
 * Row 2: Success Kid, One Does Not Simply, Woman Yelling at Cat, Roll Safe, Spiderman Pointing, Baby Yoda
 */
export const POPULAR_TEMPLATES: MemeTemplate[] = [
  {
    id: 'shinchan-not-that-special',
    name: 'Shinchan / Not That Special',
    imageUrl: '/shinchan-meme.jpg',
    width: 3554,
    height: 1999,
    boxCount: 2,
    category: 'trending',
    tags: ['shinchan', 'anime', 'not that special', 'funny', 'blushing', 'reaction', 'reactions', 'trending', 'movies & tv'],
    description: 'Shinchan blushing with hands behind his head saying "I am not really that special".',
    usageCount: 2150000,
    defaultTextSlots: [
      { id: 't1', placeholder: 'When someone compliments my code', defaultYPercent: 12 },
      { id: 't2', placeholder: 'I am not really that special', defaultYPercent: 88 },
    ],
  },
  {
    id: 'drake-hotline-bling',
    name: 'Drake Hotline Bling',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    width: 1200,
    height: 1200,
    boxCount: 2,
    category: 'classic',
    tags: ['drake', 'approval', 'disapproval', 'preference', 'classic', 'trending', 'reactions'],
    description: 'Drake gesturing disapproval in the top panel and enthusiastic approval in the bottom panel.',
    usageCount: 1420500,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Thing you dislike', defaultYPercent: 22 },
      { id: 't2', placeholder: 'Thing you love', defaultYPercent: 72 },
    ],
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    width: 1200,
    height: 800,
    boxCount: 3,
    category: 'trending',
    tags: ['jealousy', 'distraction', 'temptation', 'funny', 'trending', 'reactions', 'business'],
    description: 'A man walking with his girlfriend turns his head to check out another woman walking by.',
    usageCount: 980200,
    defaultTextSlots: [
      { id: 't1', placeholder: 'The shiny new thing', defaultYPercent: 55 },
      { id: 't2', placeholder: 'Me', defaultYPercent: 30 },
      { id: 't3', placeholder: 'Current responsibility', defaultYPercent: 65 },
    ],
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    width: 600,
    height: 908,
    boxCount: 2,
    category: 'classic',
    tags: ['dilemma', 'choice', 'sweating', 'decision', 'classic', 'gaming', 'business'],
    description: 'A stressed character sweating profusely while trying to choose between two difficult buttons.',
    usageCount: 840100,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Hard Choice A', defaultYPercent: 12 },
      { id: 't2', placeholder: 'Hard Choice B', defaultYPercent: 22 },
    ],
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    imageUrl: 'https://i.imgflip.com/24y43o.jpg',
    width: 482,
    height: 361,
    boxCount: 1,
    category: 'classic',
    tags: ['debate', 'opinion', 'table', 'sign', 'classic', 'business'],
    description: 'Steven Crowder sitting behind a folding table with a banner on a college campus challenging people.',
    usageCount: 520400,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Bold opinion goes here. Change my mind.', defaultYPercent: 68 },
    ],
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
    width: 857,
    height: 1202,
    boxCount: 4,
    category: 'classic',
    tags: ['intelligence', 'enlightenment', 'levels', 'irony', 'classic', 'gaming'],
    description: 'A multi-tier progression from small brain to cosmic glowing mind showing levels of ironic sophistication.',
    usageCount: 654200,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Normal Idea', defaultYPercent: 10 },
      { id: 't2', placeholder: 'Galaxy Brain Move', defaultYPercent: 85 },
    ],
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    imageUrl: 'https://i.imgflip.com/wxica.jpg',
    width: 580,
    height: 282,
    boxCount: 2,
    category: 'reactions',
    tags: ['dog', 'fire', 'coffee', 'fine', 'crisis', 'reactions', 'work', 'business', 'animals'],
    description: 'KC Green anthropomorphic dog calmly sipping coffee while the entire room is engulfed in flames.',
    usageCount: 890400,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Everything is falling apart', defaultYPercent: 15 },
      { id: 't2', placeholder: 'This is fine.', defaultYPercent: 80 },
    ],
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    imageUrl: 'https://i.imgflip.com/1bhk.jpg',
    width: 500,
    height: 500,
    boxCount: 2,
    category: 'classic',
    tags: ['success', 'kid', 'beach', 'win', 'fist', 'classic', 'gaming', 'business'],
    description: 'A determined toddler on a beach clenching his fist in victory.',
    usageCount: 780000,
    defaultTextSlots: [
      { id: 't1', placeholder: 'IDEAS TODAY', defaultYPercent: 15 },
      { id: 't2', placeholder: 'VIRAL TOMORROW', defaultYPercent: 82 },
    ],
  },
  {
    id: 'one-does-not-simply',
    name: 'One Does Not Simply',
    imageUrl: 'https://i.imgflip.com/1bij.jpg',
    width: 568,
    height: 335,
    boxCount: 2,
    category: 'classic',
    tags: ['boromir', 'mordor', 'lord of the rings', 'movies & tv', 'classic', 'gaming'],
    description: 'Boromir from Lord of the Rings explaining that one does not simply walk into Mordor.',
    usageCount: 610300,
    defaultTextSlots: [
      { id: 't1', placeholder: 'One does not simply', defaultYPercent: 15 },
      { id: 't2', placeholder: 'Walk away without making a meme', defaultYPercent: 80 },
    ],
  },
  {
    id: 'woman-yelling-at-cat',
    name: 'Woman Yelling at Cat',
    imageUrl: 'https://i.imgflip.com/345v97.jpg',
    width: 680,
    height: 438,
    boxCount: 2,
    category: 'reactions',
    tags: ['cat', 'smudge', 'argument', 'screaming', 'confusion', 'reactions', 'animals'],
    description: 'A furious woman shouting and pointing finger contrasted with a confused white cat sitting at a dinner table.',
    usageCount: 1120000,
    defaultTextSlots: [
      { id: 't1', placeholder: 'You said you would be ready in 5 mins!', defaultYPercent: 20 },
      { id: 't2', placeholder: 'Me still on the couch', defaultYPercent: 75 },
    ],
  },
  {
    id: 'roll-safe',
    name: 'Roll Safe',
    imageUrl: 'https://i.imgflip.com/1h7in3.jpg',
    width: 702,
    height: 395,
    boxCount: 2,
    category: 'classic',
    tags: ['smart', 'logic', 'tapping head', 'humor', 'loophole', 'classic', 'business'],
    description: 'Kayode Ewumi tapping his temple with a sly smile, presenting humorous loophole logic.',
    usageCount: 430900,
    defaultTextSlots: [
      { id: 't1', placeholder: "Can't fail the test", defaultYPercent: 15 },
      { id: 't2', placeholder: "If you never open the results", defaultYPercent: 80 },
    ],
  },
  {
    id: 'spiderman-pointing',
    name: 'Spiderman Pointing',
    imageUrl: 'https://i.imgflip.com/1tkfl9.jpg',
    width: 800,
    height: 450,
    boxCount: 2,
    category: 'reactions',
    tags: ['spiderman', 'pointing', 'identical', 'clone', 'twins', 'reactions', 'movies & tv'],
    description: 'Two identical 1960s cartoon Spider-Men pointing accusingly at each other.',
    usageCount: 740100,
    defaultTextSlots: [
      { id: 't1', placeholder: 'Me', defaultYPercent: 20 },
      { id: 't2', placeholder: 'Also me making bad decisions', defaultYPercent: 75 },
    ],
  },
];

export const SAMPLE_TEMPLATES = POPULAR_TEMPLATES;

export interface CommunityMeme {
  id: string;
  title: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  likes: string;
  comments: string;
}

/**
 * The 6 exact community memes from the screenshot:
 * 1. "Monday be like..." (Shiba Inu dog smiling)
 * 2. "When the WiFi is down" (Cat with coffee/tea cup)
 * 3. "Coffee first ☕" (Leonardo DiCaprio cheering)
 * 4. "Me in meetings" (Baby looking at camera)
 * 5. "Still waiting..." (Skeleton/AI at laptop)
 * 6. "Life with pets" (Cat with cool sunglasses)
 */
export const COMMUNITY_MEMES: CommunityMeme[] = [
  {
    id: 'comm-shinchan',
    title: "I'm not really that special...",
    imageUrl: '/shinchan-meme.jpg',
    author: {
      name: 'shinchan_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    likes: '48.9K',
    comments: '1.2K',
  },
  {
    id: 'comm-1',
    title: 'Monday morning buffering...',
    imageUrl: '/comm-monday.jpg',
    author: {
      name: 'funnyguy',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    likes: '12.4K',
    comments: '320',
  },
  {
    id: 'comm-2',
    title: 'WiFi down for 5 minutes',
    imageUrl: '/comm-wifi-down.jpg',
    author: {
      name: 'memeking',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    },
    likes: '28.2K',
    comments: '645',
  },
  {
    id: 'comm-3',
    title: 'Coffee first, questions later ☕',
    imageUrl: '/comm-coffee-first.jpg',
    author: {
      name: 'catlover',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    likes: '35.1K',
    comments: '712',
  },
  {
    id: 'comm-4',
    title: 'Agreeing in meetings with zero clue',
    imageUrl: '/comm-meetings.jpg',
    author: {
      name: 'officialhustler',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    likes: '49.8K',
    comments: '1.1K',
  },
  {
    id: 'comm-5',
    title: 'Estimated time: 1 minute remaining',
    imageUrl: '/comm-waiting.jpg',
    author: {
      name: 'memequenn',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    },
    likes: '34.1K',
    comments: '831',
  },
  {
    id: 'comm-6',
    title: 'Life with pets: I do what I want',
    imageUrl: '/comm-pets.jpg',
    author: {
      name: 'petmemes',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    likes: '41.6K',
    comments: '890',
  },
  {
    id: 'comm-prod-bug',
    title: 'First log is an error...',
    imageUrl: '/comm-prod-bug.jpg',
    author: {
      name: 'codewhisperer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    likes: '31.2K',
    comments: '840',
  },
  {
    id: 'comm-friday-deploy',
    title: 'Friday 4:59 PM Deploy',
    imageUrl: '/comm-friday-deploy.jpg',
    author: {
      name: 'devops_ninja',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    },
    likes: '54.7K',
    comments: '1.5K',
  },
  {
    id: 'comm-cat-debugger',
    title: 'Worked on my machine...',
    imageUrl: '/comm-cat-debugger.jpg',
    author: {
      name: 'fluffyhacker',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    likes: '42.1K',
    comments: '990',
  },
  {
    id: 'comm-coffee-loading',
    title: 'Coffee: 99% Loaded ☕',
    imageUrl: '/comm-coffee-loading.jpg',
    author: {
      name: 'panda_power',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    likes: '29.8K',
    comments: '615',
  },
  {
    id: 'comm-brain-3am',
    title: 'My brain at 3 AM',
    imageUrl: '/comm-brain-3am.jpg',
    author: {
      name: 'galaxy_vibes',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    likes: '38.4K',
    comments: '782',
  },
];
