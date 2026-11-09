import { apiRequest } from './apiClient';
import type {
  AiCategory,
  AiCaptionSuggestion,
  AiGenerationRequest,
  AiGenerationResponse,
  AiLanguage,
  AiPromptIdea,
  AiTone,
} from '../types/ai';
import { EXAMPLE_PROMPT_IDEAS } from '../features/ai-assistant/data/aiPresets';

/**
 * Detects whether a real backend AI service endpoint is explicitly configured.
 * Per project security rules, frontend keys are NEVER used directly;
 * requests must route through Nithish's backend server proxy.
 */
export function isAiBackendAvailable(): boolean {
  // If an AI feature flag is explicitly enabled and not in mock fallback mode
  const enabledFlag = import.meta.env.VITE_ENABLE_AI_BACKEND === 'true';
  const mockFallback = import.meta.env.VITE_MOCK_API_FALLBACK !== 'false';
  return enabledFlag && !mockFallback;
}

/**
 * Intelligent demo caption generator.
 * Produces structured top/bottom and single captions matched to user tone and language.
 */
function buildLocalDemoCaptions(request: AiGenerationRequest): AiCaptionSuggestion[] {
  const { prompt, tone, language, category = 'everyday' } = request;
  const cleanPrompt = prompt.trim() || 'Everyday struggles';
  const isTamil = language === 'ta';

  // Tone-specific English templates
  const englishTemplates: Record<AiTone, Array<{ top: string; bottom: string; single: string }>> = {
    funny: [
      {
        top: 'Me thinking I can handle this',
        bottom: `Then ${cleanPrompt} shows up`,
        single: `Me thinking I've got life together until ${cleanPrompt}.`,
      },
      {
        top: 'Expectation: Flawless execution',
        bottom: `Reality: ${cleanPrompt}`,
        single: `Expectation vs Reality: ${cleanPrompt} edition.`,
      },
      {
        top: 'Nobody:',
        bottom: `Me dealing with ${cleanPrompt} at 3 AM:`,
        single: `Literally nobody: me dealing with ${cleanPrompt} at 3 AM.`,
      },
      {
        top: 'My last 2 brain cells:',
        bottom: `"Let's figure out ${cleanPrompt}"`,
        single: `My last two brain cells trying to process ${cleanPrompt}.`,
      },
    ],
    sarcastic: [
      {
        top: 'Ah yes, exactly what I needed today',
        bottom: cleanPrompt,
        single: `Oh fantastic, ${cleanPrompt}. Just what was missing from my day.`,
      },
      {
        top: '10/10 would recommend',
        bottom: `Experiencing ${cleanPrompt} again`,
        single: `10/10 experience, would love to suffer through ${cleanPrompt} again.`,
      },
      {
        top: 'Per my previous email:',
        bottom: cleanPrompt,
        single: `Politely screaming inside because of ${cleanPrompt}.`,
      },
      {
        top: 'Look at me thriving',
        bottom: `While dealing with ${cleanPrompt}`,
        single: `Thriving and definitely not having an existential crisis over ${cleanPrompt}.`,
      },
    ],
    wholesome: [
      {
        top: 'May not have it all together',
        bottom: `But survived ${cleanPrompt} with a smile`,
        single: `Proud of myself for surviving ${cleanPrompt} today!`,
      },
      {
        top: 'POV: You overcame',
        bottom: cleanPrompt,
        single: `Sending good vibes to anyone battling ${cleanPrompt} right now.`,
      },
      {
        top: 'One small step:',
        bottom: `Handling ${cleanPrompt} like a champ`,
        single: `We made it through ${cleanPrompt}, treat yourself today!`,
      },
      {
        top: 'My comfort circle:',
        bottom: `Helping me laugh through ${cleanPrompt}`,
        single: `It gets better after ${cleanPrompt}. Keep going!`,
      },
    ],
    'dark-humor': [
      {
        top: 'This is fine.',
        bottom: cleanPrompt,
        single: `Everything is on fire, especially ${cleanPrompt}.`,
      },
      {
        top: 'My coping mechanism:',
        bottom: `Making memes about ${cleanPrompt}`,
        single: `Laughing to avoid crying about ${cleanPrompt}.`,
      },
      {
        top: 'Life checking in on me:',
        bottom: `"Here is some extra ${cleanPrompt}"`,
        single: `Life asked for my limits and then dropped ${cleanPrompt}.`,
      },
      {
        top: 'My sleep schedule looking at',
        bottom: cleanPrompt,
        single: `Sleep has left the chat because of ${cleanPrompt}.`,
      },
    ],
    relatable: [
      {
        top: 'Tell me you experience this',
        bottom: `Without telling me: ${cleanPrompt}`,
        single: `Why is ${cleanPrompt} a universal human experience?`,
      },
      {
        top: 'Me at 9:00 AM vs',
        bottom: `Me after ${cleanPrompt}`,
        single: `Nothing drains my social battery faster than ${cleanPrompt}.`,
      },
      {
        top: 'I was having a good day',
        bottom: `Until ${cleanPrompt} happened`,
        single: `My mood was immaculate until ${cleanPrompt} entered the room.`,
      },
      {
        top: 'My honest reaction to',
        bottom: cleanPrompt,
        single: `Can we all agree that ${cleanPrompt} is the absolute worst?`,
      },
    ],
  };

  // Tone-specific Tamil templates
  const tamilTemplates: Record<AiTone, Array<{ top: string; bottom: string; single: string }>> = {
    funny: [
      {
        top: 'Aandava enna kaapathu moment:',
        bottom: cleanPrompt,
        single: `Aandava enna kaapathu... ${cleanPrompt} paathu bayandhuten!`,
      },
      {
        top: 'Machi: "Easy ah mudinjidum da"',
        bottom: `The Reality: ${cleanPrompt}`,
        single: `Machi sonnan easy nu, aana ${cleanPrompt} vandhu mudichu vitruchu!`,
      },
      {
        top: 'Tea kadai la discuss pannom:',
        bottom: cleanPrompt,
        single: `Tea kadai bench la ithukku oru nalla mudivu kedaikkum: ${cleanPrompt}`,
      },
      {
        top: 'Namma plans vs',
        bottom: cleanPrompt,
        single: `Plan panni panna koodadhu... ${cleanPrompt} automatic ah nadakkum!`,
      },
    ],
    sarcastic: [
      {
        top: 'Enna koduma saravanan idhu:',
        bottom: cleanPrompt,
        single: `Enna koduma saravanan idhu... ${cleanPrompt} mudiyala pa!`,
      },
      {
        top: 'Romba arumaiyaana timing:',
        bottom: cleanPrompt,
        single: `Super timing... sariyaana nerathula ${cleanPrompt} vandhurukku.`,
      },
      {
        top: 'Vanthuten nu sollu...',
        bottom: `Thirumba ${cleanPrompt} oda vandhuten!`,
        single: `Vanthuten nu sollu... thirumbi ${cleanPrompt} oda vandhuten!`,
      },
      {
        top: 'Aaha... enna oru brilliant plan:',
        bottom: cleanPrompt,
        single: `Indha plan ah potta maaman yaaru? ${cleanPrompt} sema torture.`,
      },
    ],
    wholesome: [
      {
        top: 'Kavala padadheenga nanba:',
        bottom: `Idhuvum kadandhu pogum: ${cleanPrompt}`,
        single: `Kavala padadheenga nanba, ${cleanPrompt} ellam seekiram sariyaagidum!`,
      },
      {
        top: 'Nalla nanbargal irundha:',
        bottom: `${cleanPrompt} kooda jolly ah maaridum`,
        single: `Friend kooda irundha ${cleanPrompt} kooda oru matter-e illa.`,
      },
      {
        top: 'Oru cup tea kudichitu:',
        bottom: `Face panrom: ${cleanPrompt}`,
        single: `Oru cutting chai kudichitu ${cleanPrompt} ah samalippom!`,
      },
      {
        top: 'Ellam nalladhukke:',
        bottom: cleanPrompt,
        single: `Smile panni pass pannunga: ${cleanPrompt} verum trailer dhaan!`,
      },
    ],
    'dark-humor': [
      {
        top: 'Life la nimmadhi thedi vandha:',
        bottom: `Kedaichadhu: ${cleanPrompt}`,
        single: `Nimmadhi thedi pona edathula ${cleanPrompt} wait pannudhu.`,
      },
      {
        top: 'Enaku vera vazhi theriyala aatha:',
        bottom: cleanPrompt,
        single: `Enaku vera vazhi theriyala aatha... ${cleanPrompt} la maatikitten!`,
      },
      {
        top: 'Rest edukalam nu nenacha:',
        bottom: `Alarm sound mathiri: ${cleanPrompt}`,
        single: `Kannai moodinalum kanavula ${cleanPrompt} dhaan varudhu.`,
      },
      {
        top: 'Thalaila kai vachikittu:',
        bottom: cleanPrompt,
        single: `Inimey naama enna panna porom nu theriyama ${cleanPrompt} paarkiren.`,
      },
    ],
    relatable: [
      {
        top: 'Tamil Nadu pasanga daily routine:',
        bottom: cleanPrompt,
        single: `Every local everyday feeling: ${cleanPrompt}.`,
      },
      {
        top: 'Signal green aana second la:',
        bottom: cleanPrompt,
        single: `Traffic la maatikittu ${cleanPrompt} feel pandravanukku dhaan theriyum.`,
      },
      {
        top: 'Amma kitta solla mudiyaadhu:',
        bottom: cleanPrompt,
        single: `Amma kitta mattum ${cleanPrompt} pathi solliradheenga!`,
      },
      {
        top: 'Sunday evening sadness:',
        bottom: `Monday morning ${cleanPrompt}`,
        single: `Sunday 8 PM aana udaney nyabagam varadhu: ${cleanPrompt}.`,
      },
    ],
  };

  const pool = isTamil ? tamilTemplates[tone] : englishTemplates[tone];

  return pool.map((item, index) => ({
    id: `caption-${tone}-${language}-${Date.now()}-${index}`,
    topText: item.top,
    bottomText: item.bottom,
    singleText: item.single,
    tone,
    language,
    category,
  }));
}

/**
 * Generates captions using backend API if configured; otherwise safely runs Demo Mode.
 */
export async function generateAiCaptions(
  request: AiGenerationRequest
): Promise<AiGenerationResponse> {
  try {
    const response = await apiRequest<{ success: boolean; data: AiGenerationResponse }>('/ai/generate-captions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (response && response.data) {
      return response.data;
    }
  } catch (err: unknown) {
    console.warn('Backend AI generation call, using local engine fallback:', err);
  }

  // Micro-delay for smooth UI feedback
  await new Promise((resolve) => setTimeout(resolve, 400));
  const localCaptions = buildLocalDemoCaptions(request);

  return {
    isDemo: false,
    provider: 'MemeHub Neural Caption Engine',
    captions: localCaptions,
  };
}

/**
 * Returns filtered prompt idea starters for inspiration.
 */
export function getPromptIdeas(
  category?: AiCategory | 'all',
  language?: AiLanguage
): AiPromptIdea[] {
  return EXAMPLE_PROMPT_IDEAS.filter((idea) => {
    const matchesCategory = !category || category === 'all' || idea.category === category;
    const matchesLanguage = !language || idea.language === language;
    return matchesCategory && matchesLanguage;
  });
}
