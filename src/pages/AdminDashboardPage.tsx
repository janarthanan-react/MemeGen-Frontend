import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  BarChart3,
  Eye,
  ShieldCheck,
  Search,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Layers,
  Trash2,
  Globe,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { apiRequest } from '../services/apiClient';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface AdminDashboardPageProps {
  onNavigate?: (route: string) => void;
}

type AdminTab = 'overview' | 'users' | 'purchases' | 'traffic' | 'memes';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overview data
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Users data
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isUpdatingUser, setIsUpdatingUser] = useState<string | null>(null);

  // Purchases data
  const [purchases, setPurchases] = useState<any[]>([]);
  const [purchaseSummary, setPurchaseSummary] = useState<any>(null);
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchasePlanFilter, setPurchasePlanFilter] = useState('all');

  // Traffic data
  const [trafficSummary, setTrafficSummary] = useState<any>(null);

  // Memes data
  const [memes, setMemes] = useState<any[]>([]);
  const [memeSearch, setMemeSearch] = useState('');
  const [isDeletingMeme, setIsDeletingMeme] = useState<string | null>(null);

  // Fetch all initial data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Overview metrics
      const dashRes = await apiRequest<{ success: boolean; data: any }>('/admin/dashboard?admin=true');
      if (dashRes && dashRes.data) {
        setDashboardStats(dashRes.data);
      }

      // 2. Users
      const usersRes = await apiRequest<{ success: boolean; data: any }>('/admin/users?admin=true&limit=100');
      if (usersRes && usersRes.data && usersRes.data.items) {
        setUsers(usersRes.data.items);
      }

      // 3. Purchases
      const purRes = await apiRequest<{ success: boolean; data: any }>('/admin/purchases?admin=true&limit=100');
      if (purRes && purRes.data) {
        setPurchases(purRes.data.items || []);
        setPurchaseSummary(purRes.data.summary || null);
      }

      // 4. Traffic
      const trfRes = await apiRequest<{ success: boolean; data: any }>('/admin/traffic?admin=true&days=7');
      if (trfRes && trfRes.data) {
        setTrafficSummary(trfRes.data.summary || null);
      }

      // 5. Memes
      const memeRes = await apiRequest<{ success: boolean; data: any }>('/admin/memes?admin=true&limit=50');
      if (memeRes && memeRes.data && memeRes.data.items) {
        setMemes(memeRes.data.items);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to admin endpoints.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle User Role Change
  const handleUpdateRole = async (userId: string, newRole: string) => {
    setIsUpdatingUser(userId);
    try {
      await apiRequest(`/admin/users/${userId}/role?admin=true`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert('Failed to update user role.');
    } finally {
      setIsUpdatingUser(null);
    }
  };

  // Handle Meme Deletion
  const handleDeleteMeme = async (memeId: string) => {
    if (!window.confirm('Are you sure you want to delete this meme? This cannot be undone.')) {
      return;
    }
    setIsDeletingMeme(memeId);
    try {
      await apiRequest(`/admin/memes/${memeId}?admin=true`, {
        method: 'DELETE',
      });
      setMemes((prev) => prev.filter((m) => m.id !== memeId));
    } catch {
      alert('Failed to delete meme.');
    } finally {
      setIsDeletingMeme(null);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userSearch ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Purchases
  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      !purchaseSearch ||
      p.userEmail.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.userName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.orderId.toLowerCase().includes(purchaseSearch.toLowerCase());
    const matchesPlan = purchasePlanFilter === 'all' || p.planId === purchasePlanFilter;
    return matchesSearch && matchesPlan;
  });

  // Filtered Memes
  const filteredMemes = memes.filter((m) => {
    return (
      !memeSearch ||
      m.title.toLowerCase().includes(memeSearch.toLowerCase()) ||
      m.authorName.toLowerCase().includes(memeSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-24 sm:pt-28 pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#0F172A] text-white shadow-xl border border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-wider uppercase border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Analytics &amp; Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Real-time monitoring of user registrations, monetization subscriptions, traffic engagement, and database sync.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="text-white border-white/20 hover:bg-white/10"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            {onNavigate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/')}
                className="bg-[#1463E9] hover:bg-blue-600 font-semibold"
              >
                Back to MemeHub
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1463E9] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#1463E9] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users Tracking</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === 'purchases'
                ? 'bg-[#1463E9] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Purchases &amp; Subscriptions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {purchases.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('traffic')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === 'traffic'
                ? 'bg-[#1463E9] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Traffic &amp; Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === 'memes'
                ? 'bg-[#1463E9] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Meme Moderation</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {memes.length}
            </span>
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && !dashboardStats && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-semibold text-slate-500">Loading admin analytics from server...</p>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Connection Note</p>
              <p className="text-xs text-amber-800">{error}</p>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW DASHBOARD                                        */}
        {/* ================================================================ */}
        {activeTab === 'overview' && dashboardStats && (
          <div className="space-y-6">
            {/* 5 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Card 1: Total Revenue */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  ${dashboardStats.kpis.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>MRR: ${dashboardStats.kpis.monthlyRecurringRevenue}</span>
                </div>
              </div>

              {/* Card 2: Total Registered Users */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Users
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {dashboardStats.kpis.totalUsers}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <span>Pro Subscribers: {dashboardStats.kpis.activeProSubscribers}</span>
                </div>
              </div>

              {/* Card 3: Total Purchases */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Purchases
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {purchases.length}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600">
                  <span>Conv. Rate: {dashboardStats.kpis.conversionRate}%</span>
                </div>
              </div>

              {/* Card 4: Platform Traffic */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Traffic
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {dashboardStats.kpis.totalPageViews?.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
                  <span>Unique: {dashboardStats.kpis.uniqueVisitors?.toLocaleString()}</span>
                </div>
              </div>

              {/* Card 5: Memes & Drafts */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Memes Created
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {dashboardStats.kpis.totalMemes}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <span>Synced Drafts: {dashboardStats.kpis.totalDrafts}</span>
                </div>
              </div>
            </div>

            {/* Visual Charts & Trend Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Trend Visual Chart */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Weekly Traffic Trend</h3>
                    <p className="text-xs text-slate-500">Daily page views and unique visitors</p>
                  </div>
                  <Badge variant="primary" size="sm">Past 7 Days</Badge>
                </div>

                <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
                  {dashboardStats.trafficChart?.map((day: any, idx: number) => {
                    const max = Math.max(...dashboardStats.trafficChart.map((d: any) => d.views || 1), 10);
                    const heightPercent = Math.min(100, Math.max(15, Math.round((day.views / max) * 100)));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.views}
                        </div>
                        <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-36">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-cyan-300"
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {day.date.split('-').slice(1).join('/')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#1463E9]" />
                    <span>Page Views</span>
                  </div>
                  <span>Real-time DB synced</span>
                </div>
              </div>

              {/* System Status & Device Breakdown */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">System Health &amp; DB</h3>
                  <p className="text-xs text-slate-500">Database and API server latency</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">Database Engine</span>
                    <span className="text-xs font-bold text-slate-900">{dashboardStats.systemHealth?.database}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">API Latency</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {dashboardStats.systemHealth?.apiLatencyMs}ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">Server Uptime</span>
                    <span className="text-xs font-bold text-slate-900">{dashboardStats.systemHealth?.uptime}</span>
                  </div>
                </div>

                {/* Device Breakdown Progress */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Traffic by Device
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Laptop className="w-3.5 h-3.5 text-blue-600" /> Desktop
                      </span>
                      <span className="font-bold text-slate-900">{dashboardStats.deviceBreakdown?.desktop}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${dashboardStats.deviceBreakdown?.desktop}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Smartphone className="w-3.5 h-3.5 text-cyan-600" /> Mobile
                      </span>
                      <span className="font-bold text-slate-900">{dashboardStats.deviceBreakdown?.mobile}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${dashboardStats.deviceBreakdown?.mobile}%` }}
                        className="h-full bg-cyan-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Live Platform Activity</h3>
                  <p className="text-xs text-slate-500">Real-time events streamed from backend DB</p>
                </div>
                <Badge variant="default" size="sm">Live Stream</Badge>
              </div>

              <div className="divide-y divide-slate-100">
                {dashboardStats.recentActivity?.map((act: any) => (
                  <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {act.type === 'purchase' ? (
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        ) : act.type === 'signup' ? (
                          <Users className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Layers className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{act.title}</div>
                        <div className="text-xs text-slate-500">{act.description}</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: USERS TRACKING                                            */}
        {/* ================================================================ */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/70"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="creator">Creator</option>
                  <option value="pro">Pro Tier</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-center">Memes Created</th>
                      <th className="py-3 px-4 text-center">Purchases</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400">
                          No users found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 shrink-0">
                              <img src={u.avatarUrl || '/Profille/no-dp_16.webp'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-[140px]">{u.fullName}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : u.role === 'pro'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : u.role === 'enterprise'
                                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-700">{u.memesCount || 0}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{u.purchasesCount || 0}</td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs">
                            {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={u.role}
                              disabled={isUpdatingUser === u.id}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white cursor-pointer focus:outline-none"
                            >
                              <option value="creator">Creator</option>
                              <option value="pro">Pro</option>
                              <option value="enterprise">Enterprise</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: PURCHASES & SUBSCRIPTIONS TRACKING                        */}
        {/* ================================================================ */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            {/* Purchase Summary Pills */}
            {purchaseSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Gross Platform Revenue</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    ${purchaseSummary.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Monthly Recurring (MRR)</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                    ${purchaseSummary.monthlyRecurringRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Active Subscriptions</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">
                    {purchaseSummary.activeSubscriptions}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Total Transactions</div>
                  <div className="text-2xl font-extrabold text-purple-600 mt-1">
                    {purchaseSummary.totalPurchases}
                  </div>
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer, email, or order ID..."
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/70"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Plan:</span>
                <select
                  value={purchasePlanFilter}
                  onChange={(e) => setPurchasePlanFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Plans</option>
                  <option value="pro">Pro Tier ($9.99)</option>
                  <option value="enterprise">Enterprise ($29.99)</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Plan &amp; Cycle</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredPurchases.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400">
                          No transactions recorded.
                        </td>
                      </tr>
                    ) : (
                      filteredPurchases.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-700 text-xs">{p.orderId}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div>{p.userName}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{p.userEmail}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize font-bold text-slate-800">{p.planId}</span>
                            <span className="text-slate-400 text-xs ml-1">({p.billingCycle})</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 text-xs">{p.paymentMethod || 'Credit Card'}</td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                            ${Number(p.amount).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs text-right">
                            {new Date(p.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: TRAFFIC & ANALYTICS                                       */}
        {/* ================================================================ */}
        {activeTab === 'traffic' && trafficSummary && (
          <div className="space-y-6">
            {/* Top Traffic Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Total Page Views</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {trafficSummary.totalViews?.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Unique Visitors</div>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">
                  {trafficSummary.uniqueVisitors?.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Bounce Rate</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {trafficSummary.bounceRate}%
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Avg. Session Time</div>
                <div className="text-2xl font-extrabold text-purple-600 mt-1">
                  3m 42s
                </div>
              </div>
            </div>

            {/* Top Visited Pages & Referral Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Top Visited Pages</h3>
                <div className="divide-y divide-slate-100">
                  {trafficSummary.topPages?.map((pg: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-mono font-semibold text-blue-600">{pg.path}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">{pg.views} views</span>
                        <span className="text-xs text-slate-400">({pg.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Sources */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Referral Traffic Sources</h3>
                <div className="divide-y divide-slate-100">
                  {trafficSummary.topReferrers?.map((ref: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{ref.source}</span>
                      </div>
                      <span className="font-bold text-slate-900">{ref.visitors} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: MEME MODERATION                                           */}
        {/* ================================================================ */}
        {activeTab === 'memes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search memes by title or author..."
                  value={memeSearch}
                  onChange={(e) => setMemeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/70"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total Memes in Library: {memes.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMemes.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400">
                  No memes found matching query.
                </div>
              ) : (
                filteredMemes.map((meme) => (
                  <div
                    key={meme.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                      <img
                        src={meme.imageUrl}
                        alt={meme.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/shinchan-meme.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 truncate" title={meme.title}>
                        {meme.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span>By {meme.authorName}</span>
                        <span>{meme.likes} likes</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {meme.isPublic ? 'Public' : 'Private'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMeme(meme.id)}
                        disabled={isDeletingMeme === meme.id}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Meme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

