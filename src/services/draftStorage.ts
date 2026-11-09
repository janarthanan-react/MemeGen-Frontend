import type { MemeDraft } from '../types/draft';
import type { ApiResponse } from '../types/api';
import { POPULAR_TEMPLATES } from '../constants/templates';
import { apiRequest } from './apiClient';

const DRAFTS_STORAGE_KEY = 'memegen_saved_drafts_v1';

// In-memory fallback if localStorage is disabled or throws quota/security exceptions
let memoryStorage: MemeDraft[] | null = null;

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
 * Creates initial demo drafts so the creator has sample drafts
 * when first accessing the Drafts page.
 */
function createInitialSeedDrafts(): MemeDraft[] {
  const shinchan = POPULAR_TEMPLATES[0] || {
    id: 'shinchan-not-that-special',
    name: 'Shinchan / Not That Special',
    imageUrl: '/shinchan-meme.jpg',
    width: 3554,
    height: 1999,
    boxCount: 2,
    category: 'trending',
    tags: ['shinchan'],
    description: '',
    usageCount: 1000,
  };

  const drake = POPULAR_TEMPLATES[1] || shinchan;

  const now = Date.now();
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'draft-demo-1',
      title: 'Senior Dev vs Junior Dev Code Review',
      template: shinchan,
      textLayers: [
        {
          id: 'layer-1',
          text: 'WHEN MY PULL REQUEST GETS APPROVED WITH NO COMMENTS',
          xPercent: 50,
          yPercent: 12,
          fontSize: 34,
          color: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 3,
          isBold: true,
          isItalic: false,
          isUppercase: true,
          alignment: 'center',
          fontFamily: 'Impact',
          rotation: 0,
          opacity: 1,
        },
        {
          id: 'layer-2',
          text: 'I AM NOT REALLY THAT SPECIAL',
          xPercent: 50,
          yPercent: 88,
          fontSize: 36,
          color: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 3,
          isBold: true,
          isItalic: false,
          isUppercase: true,
          alignment: 'center',
          fontFamily: 'Impact',
          rotation: 0,
          opacity: 1,
        },
      ],
      createdAt: threeDaysAgo,
      updatedAt: twoHoursAgo,
    },
    {
      id: 'draft-demo-2',
      title: 'Console Log vs Debugger',
      template: drake,
      textLayers: [
        {
          id: 'layer-d1',
          text: 'USING MODERN BREAKPOINT DEBUGGER',
          xPercent: 50,
          yPercent: 22,
          fontSize: 30,
          color: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 3,
          isBold: true,
          isItalic: false,
          isUppercase: true,
          alignment: 'center',
          fontFamily: 'Impact',
          rotation: 0,
          opacity: 1,
        },
        {
          id: 'layer-d2',
          text: 'CONSOLE.LOG("HERE 123")',
          xPercent: 50,
          yPercent: 74,
          fontSize: 32,
          color: '#FFFFFF',
          strokeColor: '#000000',
          strokeWidth: 3,
          isBold: true,
          isItalic: false,
          isUppercase: true,
          alignment: 'center',
          fontFamily: 'Impact',
          rotation: 0,
          opacity: 1,
        },
      ],
      createdAt: yesterday,
      updatedAt: yesterday,
    },
  ];
}

/**
 * Draft Storage Adapter with Cloud Database Synchronization
 * Synchronizes with backend /api/v1/drafts while caching locally for offline capability.
 */
export const draftStorage = {
  /**
   * Retrieves all saved drafts from persistent backend database and local cache.
   */
  async getAll(): Promise<MemeDraft[]> {
    // 1. Try fetching from backend database
    try {
      const response = await apiRequest<ApiResponse<any[]>>('/drafts');
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const syncedDrafts: MemeDraft[] = response.data.map((d) => {
          const tmpl =
            d.template ||
            POPULAR_TEMPLATES.find((t) => t.id === (d.templateId || d.template_id)) ||
            createInitialSeedDrafts()[0].template;

          return {
            id: d.id,
            title: d.title || d.memeTitle || d.meme_title || 'Untitled Meme',
            template: tmpl,
            textLayers: d.textLayers || d.text_layers || [],
            canvasSettings: d.canvasSettings || d.canvas_settings || {},
            previewUrl: d.previewUrl || d.previewImageUrl || d.preview_image_url,
            createdAt: d.createdAt || d.created_at || new Date().toISOString(),
            updatedAt: d.updatedAt || d.updated_at || new Date().toISOString(),
          };
        });

        this.persist(syncedDrafts);
        return syncedDrafts;
      }
    } catch {
      // Offline or network error - gracefully fall back to local storage
    }

    // 2. Fall back to local storage cache
    if (!isLocalStorageAvailable()) {
      if (!memoryStorage) {
        memoryStorage = [];
      }
      return [...memoryStorage];
    }

    try {
      const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (raw === null) {
        const initial = createInitialSeedDrafts();
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item): item is MemeDraft =>
          Boolean(
            item &&
              typeof item.id === 'string' &&
              typeof item.title === 'string' &&
              item.template &&
              Array.isArray(item.textLayers)
          )
      );
    } catch {
      return [];
    }
  },

  /**
   * Retrieves a single draft by ID.
   */
  async getById(id: string): Promise<MemeDraft | null> {
    try {
      const response = await apiRequest<ApiResponse<any>>(`/drafts/${id}`);
      if (response && response.data) {
        const d = response.data;
        const tmpl =
          d.template ||
          POPULAR_TEMPLATES.find((t) => t.id === (d.templateId || d.template_id)) ||
          createInitialSeedDrafts()[0].template;

        return {
          id: d.id,
          title: d.title || d.memeTitle || d.meme_title || 'Untitled Meme',
          template: tmpl,
          textLayers: d.textLayers || d.text_layers || [],
          canvasSettings: d.canvasSettings || d.canvas_settings || {},
          previewUrl: d.previewUrl || d.previewImageUrl || d.preview_image_url,
          createdAt: d.createdAt || d.created_at || new Date().toISOString(),
          updatedAt: d.updatedAt || d.updated_at || new Date().toISOString(),
        };
      }
    } catch {
      // Fall through to local cache
    }

    const drafts = await this.getAll();
    return drafts.find((d) => d.id === id) || null;
  },

  /**
   * Saves or updates a draft in both local cache and backend database.
   */
  async save(
    payload: Omit<MemeDraft, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
    }
  ): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const nowIso = new Date().toISOString();

    const existingIndex = payload.id ? drafts.findIndex((d) => d.id === payload.id) : -1;

    let savedDraft: MemeDraft;

    if (existingIndex >= 0) {
      // Update existing draft
      savedDraft = {
        ...drafts[existingIndex],
        ...payload,
        id: drafts[existingIndex].id,
        createdAt: drafts[existingIndex].createdAt || nowIso,
        updatedAt: nowIso,
      };
      drafts[existingIndex] = savedDraft;
    } else {
      // Create new draft with unique ID
      const newId = payload.id || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      savedDraft = {
        ...payload,
        id: newId,
        createdAt: payload.createdAt || nowIso,
        updatedAt: nowIso,
      };
      drafts.unshift(savedDraft);
    }

    this.persist(drafts);

    // Sync to backend database
    try {
      const response = await apiRequest<ApiResponse<any>>('/drafts', {
        method: 'POST',
        body: JSON.stringify({
          id: savedDraft.id,
          templateId: savedDraft.template.id,
          template: savedDraft.template,
          memeTitle: savedDraft.title,
          title: savedDraft.title,
          textLayers: savedDraft.textLayers,
          canvasSettings: savedDraft.canvasSettings,
          previewImageUrl: savedDraft.previewUrl,
          previewUrl: savedDraft.previewUrl,
        }),
      });

      if (response && response.data) {
        savedDraft = {
          ...savedDraft,
          id: response.data.id || savedDraft.id,
          updatedAt: response.data.updatedAt || savedDraft.updatedAt,
        };
        const updatedIdx = drafts.findIndex((d) => d.id === savedDraft.id);
        if (updatedIdx >= 0) {
          drafts[updatedIdx] = savedDraft;
          this.persist(drafts);
        }
      }
    } catch (err) {
      console.warn('Draft persisted locally; cloud database sync deferred:', err);
    }

    return savedDraft;
  },

  /**
   * Renames an existing draft and syncs to database.
   */
  async rename(id: string, newTitle: string): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const index = drafts.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Draft with ID "${id}" was not found.`);
    }

    const updated: MemeDraft = {
      ...drafts[index],
      title: newTitle.trim(),
      updatedAt: new Date().toISOString(),
    };

    drafts[index] = updated;
    this.persist(drafts);

    try {
      await apiRequest<ApiResponse<any>>('/drafts', {
        method: 'POST',
        body: JSON.stringify({
          id: updated.id,
          templateId: updated.template.id,
          memeTitle: updated.title,
          title: updated.title,
          textLayers: updated.textLayers,
          canvasSettings: updated.canvasSettings,
        }),
      });
    } catch {
      // Local copy updated
    }

    return updated;
  },

  /**
   * Duplicates an existing draft and syncs to database.
   */
  async duplicate(id: string): Promise<MemeDraft> {
    const drafts = await this.getAll();
    const original = drafts.find((d) => d.id === id);
    if (!original) {
      throw new Error(`Draft with ID "${id}" not found.`);
    }

    const nowIso = new Date().toISOString();
    const newId = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duplicated: MemeDraft = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    drafts.unshift(duplicated);
    this.persist(drafts);

    try {
      await apiRequest<ApiResponse<any>>('/drafts', {
        method: 'POST',
        body: JSON.stringify({
          id: duplicated.id,
          templateId: duplicated.template.id,
          template: duplicated.template,
          memeTitle: duplicated.title,
          title: duplicated.title,
          textLayers: duplicated.textLayers,
          canvasSettings: duplicated.canvasSettings,
        }),
      });
    } catch {
      // Local copy created
    }

    return duplicated;
  },

  /**
   * Deletes a draft by ID from local cache and cloud database.
   */
  async delete(id: string): Promise<boolean> {
    const drafts = await this.getAll();
    const filtered = drafts.filter((d) => d.id !== id);
    this.persist(filtered);

    try {
      await apiRequest(`/drafts/${id}`, { method: 'DELETE' });
    } catch {
      // Non-fatal
    }

    return true;
  },

  /**
   * Synchronously writes to persistent local storage.
   */
  persist(drafts: MemeDraft[]) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      } catch (err) {
        console.warn('Unable to persist drafts to localStorage:', err);
      }
    }
    memoryStorage = [...drafts];
  },
};
