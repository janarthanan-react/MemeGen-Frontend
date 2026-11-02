import React, { useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { ProfileHeader } from '../features/profile/ProfileHeader';
import { ProfileStats } from '../features/profile/ProfileStats';
import { ProfileTabs } from '../features/profile/ProfileTabs';
import { EditProfileModal } from '../features/profile/EditProfileModal';
import { useProfileStore } from '../stores/useProfileStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useDraftStore } from '../stores/useDraftStore';
import { useTemplateStore } from '../stores/useTemplateStore';
import { ErrorState } from '../components/ui/ErrorState';

export interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const error = useProfileStore((state) => state.error);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const setIsEditModalOpen = useProfileStore((state) => state.setIsEditModalOpen);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const drafts = useDraftStore((state) => state.drafts);
  const fetchDrafts = useDraftStore((state) => state.fetchDrafts);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      onNavigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
      fetchDrafts();
    }
  }, [isAuthenticated, isAuthLoading, fetchProfile, fetchDrafts, onNavigate]);

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
    setNotification({
      type: 'info',
      message: 'You have been logged out.',
    });
  };

  if ((isLoading || isAuthLoading) && !profile) {
    return (
      <div className="min-h-screen bg-slate-50/70 pt-32 pb-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading creator profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-slate-50/70 pt-32 pb-20">
        <Container>
          <ErrorState
            title="Failed to Load Profile"
            message={error}
            onRetry={fetchProfile}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-20">
      <Container className="space-y-8">
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1463E9] transition-all duration-200 active:scale-95 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-[#EFF6FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/drafts')}
            className="text-xs font-semibold text-[#1463E9] hover:underline cursor-pointer active:scale-95 transition-all duration-200 py-1 px-2.5 rounded-xl hover:bg-[#EFF6FF]"
          >
            Go to My Drafts ({drafts.length}) &rarr;
          </button>
        </div>

        {/* Profile Header Card */}
        {profile && (
          <header>
            <ProfileHeader
              profile={profile}
              draftsCount={drafts.length}
              onEditClick={() => setIsEditModalOpen(true)}
              onLogout={handleLogout}
            />
          </header>
        )}

        {/* Profile Stats Section */}
        <section aria-label="Creator Statistics">
          <ProfileStats draftsCount={drafts.length} />
        </section>

        {/* Interactive Tabs (Overview, My Drafts, Published) */}
        <main aria-label="Profile Tabs Content">
          <ProfileTabs onNavigate={onNavigate} />
        </main>

        {/* Edit Profile Modal Dialog */}
        <EditProfileModal />
      </Container>
    </div>
  );
};

export default ProfilePage;
