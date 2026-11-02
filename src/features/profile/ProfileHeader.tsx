import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Globe,
  Edit3,
  CheckCircle2,
  LogOut,
  Mail,
  Lock,
} from 'lucide-react';
import type { UserProfile } from '../../types/profile';
import { useAuthStore } from '../../stores/useAuthStore';

export interface ProfileHeaderProps {
  profile: UserProfile;
  draftsCount?: number;
  onEditClick: () => void;
  onLogout?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  draftsCount = 0,
  onEditClick,
  onLogout,
}) => {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);

  const isAvatarError = Boolean(failedAvatarUrl && failedAvatarUrl === profile.avatarUrl);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 lg:p-10 relative overflow-hidden">
      {/* Instagram-style Layout Container */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10">
        {/* Left: Avatar with Instagram Story-Style Gradient Ring */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-lg">
            <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
              <img
                src={!isAvatarError && profile.avatarUrl ? profile.avatarUrl : '/Profille/no-dp_16.webp'}
                alt={profile.displayName ? `${profile.displayName}'s avatar` : 'Creator avatar'}
                onError={() => setFailedAvatarUrl(profile.avatarUrl)}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Verified Creator Badge */}
          <span
            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-xs"
            title="Verified Creator"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>

        {/* Right: Instagram Profile Info & Action Buttons */}
        <div className="flex-1 min-w-0 space-y-4 text-center md:text-left">
          {/* Row 1: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              @{profile.username}
            </h1>

            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                <span>Demo Creator Account</span>
              </span>
            )}

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={onEditClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#1463E9]/30 hover:border-[#1463E9] hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[36px] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1463E9]" />
                <span>Edit Profile</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[36px] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Instagram-style Stats Counters (Real Available Data) */}
          <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 text-xs sm:text-sm text-slate-600 border-y border-slate-100 py-3">
            <div>
              <span className="font-extrabold text-slate-900">{draftsCount}</span>{' '}
              <span className="text-slate-500">drafts</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900">{draftsCount}</span>{' '}
              <span className="text-slate-500">creations</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900">0</span>{' '}
              <span className="text-slate-500">published</span>
            </div>
          </div>

          {/* Row 3: Display Name & Bio */}
          <div className="space-y-1.5 min-w-0">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {profile.displayName}
            </h2>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line max-w-xl break-words">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Row 4: Account Details & Metadata (Protected: No secrets displayed) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-slate-500 pt-1">
            {profile.email && (
              <span className="flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.email}</span>
                <span title="Private account detail" className="inline-flex items-center">
                  <Lock className="w-3 h-3 text-slate-400 ml-0.5" />
                </span>
              </span>
            )}

            {profile.joinedDate && (
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Joined {profile.joinedDate}</span>
              </span>
            )}

            {profile.location && (
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.location}</span>
              </span>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-medium text-blue-600 hover:underline truncate max-w-[200px]"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
