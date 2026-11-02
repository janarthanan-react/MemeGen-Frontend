import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useProfileStore } from '../../stores/useProfileStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Check, AlertCircle, Shield } from 'lucide-react';
import type { UserProfile, ProfileUpdatePayload } from '../../types/profile';

// Curated modern avatar presets for instant selection
const AVATAR_PRESETS = [
  {
    id: 'preset-default',
    label: 'Default Profile Picture',
    url: '/Profille/no-dp_16.webp',
  },
  {
    id: 'preset-1',
    label: 'Creator 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-2',
    label: 'Creator 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-3',
    label: 'Creator 3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-4',
    label: 'Creator 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-5',
    label: 'Creator 5',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
];

interface EditProfileFormProps {
  profile: UserProfile;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onClose }) => {
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const isSaving = useProfileStore((state) => state.isSaving);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [formData, setFormData] = useState<ProfileUpdatePayload>({
    displayName: profile.displayName || '',
    username: profile.username || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || '',
    location: profile.location || '',
    website: profile.website || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const trimmedName = formData.displayName.trim();
    if (!trimmedName) {
      newErrors.displayName = 'Display name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters.';
    } else if (trimmedName.length > 50) {
      newErrors.displayName = 'Display name cannot exceed 50 characters.';
    }

    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      newErrors.username = 'Username is required.';
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores.';
    }

    if (formData.bio.length > 160) {
      newErrors.bio = 'Bio cannot exceed 160 characters.';
    }

    if (formData.avatarUrl && formData.avatarUrl.trim()) {
      const trimmedAvatar = formData.avatarUrl.trim();
      if (
        !trimmedAvatar.startsWith('/') &&
        !/^https?:\/\/.+/i.test(trimmedAvatar) &&
        !trimmedAvatar.startsWith('data:image/')
      ) {
        newErrors.avatarUrl = 'Avatar must be a valid web URL or local path.';
      }
    }

    if (formData.website && formData.website.trim()) {
      const trimmedWeb = formData.website.trim();
      if (!/^https?:\/\/.+/i.test(trimmedWeb) && !/^memegen\.io\/.+/i.test(trimmedWeb)) {
        newErrors.website = 'Enter a valid URL (e.g. https://yoursite.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProfile(formData);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      onClose();
    } catch {
      setErrors({ form: 'Failed to update profile. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Avatar Preset Selection */}
      <div className="space-y-2">
        <label htmlFor="avatar-url" className="block text-xs font-semibold text-slate-700">
          Choose Creator Avatar
        </label>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {AVATAR_PRESETS.map((preset) => {
            const isSelected = formData.avatarUrl === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, avatarUrl: preset.url }));
                  if (errors.avatarUrl) setErrors((prev) => ({ ...prev, avatarUrl: '' }));
                }}
                className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all duration-150 cursor-pointer shrink-0 relative hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/40 shadow-sm'
                    : 'border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100'
                }`}
                aria-label={`Select ${preset.label}`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Or custom URL */}
        <div className="pt-1">
          <Input
            id="avatar-url"
            type="text"
            value={formData.avatarUrl}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, avatarUrl: val }));
              if (errors.avatarUrl) setErrors((prev) => ({ ...prev, avatarUrl: '' }));
            }}
            placeholder="Or paste an image URL..."
            inputSize="sm"
            error={errors.avatarUrl}
          />
        </div>
      </div>

      {/* Display Name & Username (2 columns on tablet+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label
            htmlFor="profile-display-name"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Display Name *
          </label>
          <Input
            id="profile-display-name"
            type="text"
            value={formData.displayName}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, displayName: val }));
              if (errors.displayName) {
                setErrors((prev) => ({ ...prev, displayName: '' }));
              }
            }}
            placeholder="e.g. Alex Rivers"
            maxLength={50}
            error={errors.displayName}
          />
        </div>

        <div>
          <label
            htmlFor="profile-username"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Username *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
              @
            </span>
            <Input
              id="profile-username"
              type="text"
              value={formData.username}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({ ...prev, username: val }));
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: '' }));
                }
              }}
              className="pl-7"
              placeholder="username"
              maxLength={30}
              error={errors.username}
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="profile-bio"
            className="block text-xs font-semibold text-slate-700"
          >
            Bio
          </label>
          <span
            className={`text-[11px] ${
              formData.bio.length > 150 ? 'text-amber-600 font-bold' : 'text-slate-400'
            }`}
          >
            {formData.bio.length}/160
          </span>
        </div>
        <textarea
          id="profile-bio"
          rows={3}
          value={formData.bio}
          onChange={(e) => {
            const val = e.target.value;
            setFormData((prev) => ({ ...prev, bio: val }));
            if (errors.bio) {
              setErrors((prev) => ({ ...prev, bio: '' }));
            }
          }}
          placeholder="Tell fellow meme creators about yourself, your favorite templates, or your humor style..."
          className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          maxLength={160}
        />
        {errors.bio && <p className="text-xs text-rose-600 mt-1">{errors.bio}</p>}
      </div>

      {/* Location & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label
            htmlFor="profile-location"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Location
          </label>
          <Input
            id="profile-location"
            type="text"
            value={formData.location || ''}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, location: val }));
            }}
            placeholder="e.g. San Francisco, CA"
            maxLength={40}
          />
        </div>

        <div>
          <label
            htmlFor="profile-website"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Website / Social
          </label>
          <Input
            id="profile-website"
            type="text"
            value={formData.website || ''}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, website: val }));
              if (errors.website) {
                setErrors((prev) => ({ ...prev, website: '' }));
              }
            }}
            placeholder="https://..."
            error={errors.website}
          />
        </div>
      </div>

      {/* Notice on Local Persistence */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Profile changes are saved directly to your browser storage and will be synchronized when account backend integration is live.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export const EditProfileModal: React.FC = () => {
  const profile = useProfileStore((state) => state.profile);
  const isEditModalOpen = useProfileStore((state) => state.isEditModalOpen);
  const setIsEditModalOpen = useProfileStore((state) => state.setIsEditModalOpen);

  if (!isEditModalOpen || !profile) return null;

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Edit Creator Profile"
      description="Customize your public persona, display handle, and bio."
      maxWidth="lg"
    >
      <EditProfileForm
        key={profile.id}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Modal>
  );
};
