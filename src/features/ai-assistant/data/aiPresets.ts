import type { AiCategory, AiPromptIdea, AiTone } from '../../../types/ai';

export const AI_TONE_LABELS: Record<AiTone, { label: string; description: string; emoji: string }> = {
  funny: {
    label: 'Funny',
    description: 'Playful, goofy punchlines that bring instant laughs',
    emoji: '',
  },
  sarcastic: {
    label: 'Sarcastic',
    description: 'Dry wit, sharp irony, and passive-aggressive truths',
    emoji: '',
  },
  wholesome: {
    label: 'Wholesome',
    description: 'Heartwarming, supportive, and delightfully uplifting',
    emoji: '',
  },
  'dark-humor': {
    label: 'Dark Humor',
    description: 'Morbid coping mechanisms and existential laughter',
    emoji: '',
  },
  relatable: {
    label: 'Relatable',
    description: 'Hyper-accurate everyday struggles everyone secretly feels',
    emoji: '',
  },
};

export const AI_CATEGORY_LABELS: Record<
  AiCategory,
  { label: string; iconName: string; description: string }
> = {
  everyday: {
    label: 'Everyday Life',
    iconName: 'Coffee',
    description: 'Daily chores, waking up early, and chaotic routines',
  },
  student: {
    label: 'Student Life',
    iconName: 'GraduationCap',
    description: 'Semester exams, 8:30 AM lectures, and caffeine fuel',
  },
  work: {
    label: 'Work & Office',
    iconName: 'Briefcase',
    description: 'Pointless Zoom calls, Slack pings, and Monday dread',
  },
  relationships: {
    label: 'Friendships & Dating',
    iconName: 'HeartHandshake',
    description: 'Group chat betrayals, "I am 5 mins away", and mixed signals',
  },
  'tamil-humor': {
    label: 'Tamil & Local Humor',
    iconName: 'Smile',
    description: 'Iconic Kollywood dialogues, vadivelu vibes, and local tea shop banter',
  },
};

export const EXAMPLE_PROMPT_IDEAS: AiPromptIdea[] = [
  // Everyday Life
  {
    id: 'idea-everyday-1',
    category: 'everyday',
    title: 'Waking up before alarm',
    prompt: 'Waking up 3 minutes before the alarm rings feeling like a psychic',
    tone: 'relatable',
    language: 'en',
    previewTemplateHint: 'expanding-brain',
  },
  {
    id: 'idea-everyday-2',
    category: 'everyday',
    title: 'Online shopping at 2 AM',
    prompt: 'Adding $400 worth of items to cart at 2 AM with $12 in checking account',
    tone: 'funny',
    language: 'en',
    previewTemplateHint: 'two-buttons',
  },
  {
    id: 'idea-everyday-3',
    category: 'everyday',
    title: 'Saying "I\'m fine"',
    prompt: 'Smiling while everything in life is quietly on fire around me',
    tone: 'sarcastic',
    language: 'en',
    previewTemplateHint: 'this-is-fine',
  },

  // Student Life
  {
    id: 'idea-student-1',
    category: 'student',
    title: 'Starting study at whole hour',
    prompt: 'It is 8:02 PM so now I have to wait until 9:00 PM to start studying',
    tone: 'relatable',
    language: 'en',
    previewTemplateHint: 'drake-hotline-bling',
  },
  {
    id: 'idea-student-2',
    category: 'student',
    title: 'The "Easy" semester exam',
    prompt: 'Professor said the exam would be basic concepts from Chapter 1',
    tone: 'dark-humor',
    language: 'en',
    previewTemplateHint: 'expanding-brain',
  },
  {
    id: 'idea-student-3',
    category: 'student',
    title: 'Group project contribution',
    prompt: 'Doing 99% of the project work while group members provide "moral support"',
    tone: 'sarcastic',
    language: 'en',
    previewTemplateHint: 'distracted-boyfriend',
  },

  // Work & Office
  {
    id: 'idea-work-1',
    category: 'work',
    title: 'Could have been an email',
    prompt: 'Surviving a 45-minute meeting that could have been a 6-word message',
    tone: 'sarcastic',
    language: 'en',
    previewTemplateHint: 'this-is-fine',
  },
  {
    id: 'idea-work-2',
    category: 'work',
    title: 'Friday 4:59 PM deployment',
    prompt: 'Pushing changes to production on Friday afternoon right before logging off',
    tone: 'dark-humor',
    language: 'en',
    previewTemplateHint: 'change-my-mind',
  },
  {
    id: 'idea-work-3',
    category: 'work',
    title: 'First paycheck feeling',
    prompt: 'Looking at my gross salary vs the net salary after deductions',
    tone: 'funny',
    language: 'en',
    previewTemplateHint: 'two-buttons',
  },

  // Relationships & Friends
  {
    id: 'idea-rel-1',
    category: 'relationships',
    title: '5 minutes away myth',
    prompt: 'My best friend saying "Bro I am literally turning into your street" while still in pajamas',
    tone: 'funny',
    language: 'en',
    previewTemplateHint: 'distracted-boyfriend',
  },
  {
    id: 'idea-rel-2',
    category: 'relationships',
    title: 'Cancelling plans relief',
    prompt: 'The instant pure serenity when someone else cancels the dinner plans first',
    tone: 'wholesome',
    language: 'en',
    previewTemplateHint: 'drake-hotline-bling',
  },
  {
    id: 'idea-rel-3',
    category: 'relationships',
    title: 'Deciding dinner food',
    prompt: '"I don\'t care what we eat, you decide" but rejects all 8 suggestions',
    tone: 'relatable',
    language: 'en',
    previewTemplateHint: 'two-buttons',
  },

  // Tamil & Local Humor
  {
    id: 'idea-tamil-1',
    category: 'tamil-humor',
    title: 'Tea shop political analysis',
    prompt: 'Tea kadai bench la naalu per pesra politics > United Nations peace conference',
    tone: 'funny',
    language: 'ta',
    previewTemplateHint: 'change-my-mind',
  },
  {
    id: 'idea-tamil-2',
    category: 'tamil-humor',
    title: 'Traffic signal green to red',
    prompt: 'Signal green aana second la rear horn adikkira auto anna urgency',
    tone: 'relatable',
    language: 'ta',
    previewTemplateHint: 'this-is-fine',
  },
  {
    id: 'idea-tamil-3',
    category: 'tamil-humor',
    title: 'Semester exam question paper',
    prompt: 'Question paper paathutu invigilator ah paarka... invigilator sirichite povaar',
    tone: 'dark-humor',
    language: 'ta',
    previewTemplateHint: 'two-buttons',
  },
  {
    id: 'idea-tamil-4',
    category: 'tamil-humor',
    title: 'Enna koduma saravanan idhu',
    prompt: 'Code compiles with 0 errors on local, breaks in production with 120 errors',
    tone: 'sarcastic',
    language: 'ta',
    previewTemplateHint: 'this-is-fine',
  },
  {
    id: 'idea-tamil-5',
    category: 'tamil-humor',
    title: 'Friend\'s wedding food queue',
    prompt: 'Kalyana veetla briyani queue la ninnutu "Diet start panrom" nu solradhu',
    tone: 'funny',
    language: 'ta',
    previewTemplateHint: 'drake-hotline-bling',
  },
];
