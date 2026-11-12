import React, { useState, useEffect } from 'react';
import {
  Shield, LogOut, Search, Filter, Download, Plus, Edit2, Trash2, CheckCircle2,
  Phone, MessageSquare, FileText, ChevronRight, AlertCircle, Clock, Check, X,
  ExternalLink, User, RefreshCw, Eye, Settings, Briefcase, Bell, MessageCircle,
  HelpCircle, Key, Save, Image, Globe, MapPin, Building
} from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active sub-tab: 'applications' | 'settings' | 'opportunities' | 'notices' | 'services' | 'testimonials' | 'faqs' | 'security'
  const [currentTab, setCurrentTab] = useState('applications');

  // Complete Site Data State
  const [siteData, setSiteData] = useState({
    settings: {},
    adminConfig: {
      statuses: [],
      serviceTypes: [],
      opportunityStatuses: [],
      imagePresets: []
    },
    services: [],
    notices: [],
    opportunities: [],
    testimonials: [],
    faqs: []
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({});
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Opportunities state
  const [editingOpp, setEditingOpp] = useState(null);
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);

  // Notices state
  const [newNoticeText, setNewNoticeText] = useState('');
  const [newNoticeLinkedOpp, setNewNoticeLinkedOpp] = useState('');

  // Services modal state
  const [editingService, setEditingService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Testimonials modal state
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialPhotoFile, setTestimonialPhotoFile] = useState(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // FAQ modal state
  const [editingFaq, setEditingFaq] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Security state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  // Stats
  const [stats, setStats] = useState(null);

  const statuses = siteData.adminConfig?.statuses || [];
  const serviceTypes = siteData.adminConfig?.serviceTypes || [];
  const opportunityStatuses = siteData.adminConfig?.opportunityStatuses || [];
  const imagePresets = siteData.adminConfig?.imagePresets || [];

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setAuthToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('Server se connect nahi ho paya.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'x-admin-token': authToken }
      });
    } catch (e) {}
    localStorage.removeItem('adminToken');
    setAuthToken('');
  };

  // Fetch complete site data
  const fetchCompleteSiteData = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/site-data', {
        headers: { 'x-admin-token': authToken }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSiteData(data.data);
        setSettingsForm(data.data.settings || {});
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    if (!authToken) return;
    setLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterService !== 'All') params.append('service', filterService);

      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        headers: { 'x-admin-token': authToken }
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-token': authToken }
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchCompleteSiteData();
      fetchApplications();
      fetchStats();
    }
  }, [authToken, filterStatus, filterService]);

  // Export to Excel
  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filterStatus !== 'All') params.append('status', filterStatus);
    if (filterService !== 'All') params.append('service', filterService);

    fetch(`/api/admin/export?${params.toString()}`, {
      headers: { 'x-admin-token': authToken }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Overseas_Applications_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Excel export failed.'));
  };

  // Save General Website Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSavedMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedMessage('Website Settings & Branding updated successfully!');
        fetchCompleteSiteData();
        setTimeout(() => setSettingsSavedMessage(''), 4000);
      }
    } catch (err) {
      alert('Settings save failed');
    }
  };

  // Update Application Status
  const handleStatusChange = async (appId, newStatus) => {
    let reasonNote = '';
    if (newStatus === 'Closed') {
      const inputReason = window.prompt('Kripya application close karne ka reason darj karein (e.g. Candidate not interested / Eligibility mismatch):');
      if (inputReason === null) return; // Cancel if user dismissed prompt
      reasonNote = inputReason.trim() ? `Closed Reason: ${inputReason.trim()}` : 'Closed by Admin';
    }

    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ status: newStatus, note: reasonNote })
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(a => a.id === appId ? data.data : a));
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(data.data);
        }
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Add Internal Note to Application
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedApp) return;

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ note: newNote })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApp(data.data);
        setApplications(prev => prev.map(a => a.id === selectedApp.id ? data.data : a));
        setNewNote('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Opportunity Save (Add/Edit)
  const handleSaveOpp = async (e) => {
    e.preventDefault();
    const isEdit = !!editingOpp.id;
    const url = isEdit ? `/api/admin/opportunities/${editingOpp.id}` : '/api/admin/opportunities';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify(editingOpp)
      });
      const data = await res.json();
      if (data.success) {
        fetchCompleteSiteData();
        setIsOppModalOpen(false);
        setEditingOpp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOpp = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  // Notice Add/Toggle/Delete
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNoticeText.trim()) return;
    try {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({
          text: newNoticeText,
          linkedOpportunityId: newNoticeLinkedOpp,
          active: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewNoticeText('');
        setNewNoticeLinkedOpp('');
        fetchCompleteSiteData();
      }
    } catch (e) {}
  };

  const handleToggleNotice = async (notice) => {
    try {
      await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ active: !notice.active })
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete notice?')) return;
    try {
      await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  // Service Save / Delete
  const handleSaveService = async (e) => {
    e.preventDefault();
    const isEdit = !!editingService.id;
    const url = isEdit ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
    const method = isEdit ? 'PUT' : 'POST';

    const featuresArray = Array.isArray(editingService.features) 
      ? editingService.features 
      : (editingService.features || '').split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ ...editingService, features: featuresArray })
      });
      const data = await res.json();
      if (data.success) {
        fetchCompleteSiteData();
        setIsServiceModalOpen(false);
        setEditingService(null);
      }
    } catch (e) {}
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service card?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  // Testimonial Save / Delete
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    const isEdit = !!editingTestimonial.id;
    const url = isEdit ? `/api/admin/testimonials/${editingTestimonial.id}` : '/api/admin/testimonials';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = new FormData();
      Object.entries(editingTestimonial).forEach(([key, value]) => {
        if (key !== 'id') payload.append(key, value || '');
      });
      if (testimonialPhotoFile) payload.append('photoFile', testimonialPhotoFile);

      const res = await fetch(url, {
        method,
        headers: {
          'x-admin-token': authToken
        },
        body: payload
      });
      const data = await res.json();
      if (data.success) {
        fetchCompleteSiteData();
        setIsTestimonialModalOpen(false);
        setEditingTestimonial(null);
        setTestimonialPhotoFile(null);
      }
    } catch (e) {}
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete testimonial?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  // FAQ Save / Delete
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const isEdit = !!editingFaq.id;
    const url = isEdit ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify(editingFaq)
      });
      const data = await res.json();
      if (data.success) {
        fetchCompleteSiteData();
        setIsFaqModalOpen(false);
        setEditingFaq(null);
      }
    } catch (e) {}
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete FAQ?')) return;
    try {
      await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchCompleteSiteData();
    } catch (e) {}
  };

  // Update Security
  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    setSecurityMessage('');
    try {
      const res = await fetch('/api/admin/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ newUsername, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSecurityMessage(data.message);
        setNewPassword('');
      } else {
        setSecurityMessage(data.message || 'Update failed');
      }
    } catch (e) {
      setSecurityMessage('Connection error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Documents Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closed': return 'bg-slate-200 text-slate-700 border-slate-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // LOGIN SCREEN
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071126]/90 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 grid md:grid-cols-[1.05fr_1fr]">
          <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-[#071126] via-[#111f45] to-[#08a39e] p-10 text-white flex-col justify-between">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border-[32px] border-white/10" />
            <div className="absolute -left-24 -bottom-28 w-72 h-72 rounded-full border-[40px] border-white/10" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl mb-8">
                <img src="/logo.jpg" alt="Hirentara logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-200 mb-3">Hirentara Portal</p>
              <h3 className="text-3xl font-black leading-tight">Manage your overseas<br />success story.</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-xs">
                Leads, opportunities and website content — all in one secure workspace.
              </p>
            </div>
            <div className="relative flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_12px_#7bd9d5]" />
              Secure team workspace
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-3 mb-8 md:hidden">
              <img src="/logo.jpg" alt="Hirentara logo" className="w-11 h-11 object-contain rounded-xl border border-slate-200" />
              <div>
                <p className="font-black text-slate-900">Hirentara</p>
                <p className="text-[11px] text-slate-500">Admin workspace</p>
              </div>
            </div>
            <div className="mb-7">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 mb-2">Welcome back</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Admin sign in</h3>
              <p className="text-sm text-slate-500 mt-1">Access your website and lead management tools.</p>
            </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Default demo password: <code className="text-teal-700 font-bold">admin123</code></p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-[#111f45] hover:bg-[#08a39e] text-white font-bold rounded-xl text-xs shadow-lg shadow-slate-900/15 transition-all"
              >
                Login to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-[#f4f7fb] flex flex-col overflow-hidden">
      
      {/* Top Navbar */}
      <header className="bg-[#071126] text-white px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between flex-shrink-0 shadow-xl shadow-[#071126]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
            <img src="/logo.jpg" alt="Hirentara logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-white leading-tight">
              Hirentara <span className="text-teal-300">Control Centre</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Website & lead management workspace</p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setCurrentTab('applications')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'applications' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            📋 Applications ({stats?.totalApplications || applications.length})
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'settings' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            ⚙️ Site & Branding
          </button>

          <button
            onClick={() => setCurrentTab('opportunities')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'opportunities' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            💼 Opportunities ({siteData.opportunities?.length || 0})
          </button>

          <button
            onClick={() => setCurrentTab('notices')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'notices' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            📢 Notices ({siteData.notices?.length || 0})
          </button>

          <button
            onClick={() => setCurrentTab('services')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'services' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🛠️ 3 Services
          </button>

          <button
            onClick={() => setCurrentTab('testimonials')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'testimonials' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🌟 Reviews
          </button>

          <button
            onClick={() => setCurrentTab('faqs')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'faqs' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            ❓ FAQs
          </button>

          <button
            onClick={() => setCurrentTab('security')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentTab === 'security' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🔐 Password
          </button>
        </div>

        {/* Live Site & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white rounded-lg"
          >
            Live Site
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-200 bg-red-500/15 hover:bg-red-500/25 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Scroll Menu */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto bg-[#111f45] border-b border-white/10 p-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'applications', label: 'Applications' },
          { id: 'settings', label: 'Settings' },
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'notices', label: 'Notices' },
          { id: 'services', label: 'Services' },
          { id: 'testimonials', label: 'Reviews' },
          { id: 'faqs', label: 'FAQs' },
          { id: 'security', label: 'Security' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === t.id ? 'bg-teal-500 text-white' : 'text-slate-300 bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* MODULE 1: APPLICATIONS & WORKFLOW */}
        {currentTab === 'applications' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.keys(stats.statusCounts).map((key) => (
                  <div
                    key={key}
                    onClick={() => setFilterStatus(filterStatus === key ? 'All' : key)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      filterStatus === key
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                      {key}
                    </span>
                    <span className="text-2xl font-black mt-1 block">
                      {stats.statusCounts[key]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
                    placeholder="Search by ID, Name, Mobile, or Job role..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={fetchApplications}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                >
                  Search
                </button>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                </select>

                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  <option value="All">All Services</option>
                  {serviceTypes.map(serviceType => (
                    <option key={serviceType} value={serviceType}>{serviceType}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  title="Export filtered records to Excel .xlsx"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Application ID</th>
                      <th className="py-3.5 px-4">Applicant</th>
                      <th className="py-3.5 px-4">Opportunity & Country</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Passport</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-12 text-slate-400">
                          Koi application nahi mili.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-700 select-all">
                            {app.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[11px] text-slate-500">{app.mobile}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800 line-clamp-1">{app.opportunityTitle}</div>
                            <div className="text-[11px] text-slate-500">{app.country} • {app.serviceType}</div>
                          </td>
                          <td className="py-3 px-4">{app.district}, {app.state}</td>
                          <td className="py-3 px-4">
                            {app.passportStatus === 'Yes' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-slate-400">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-xs"
                            >
                              Manage
                            </button>
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

        {/* MODULE 2: WEBSITE BRANDING & CONTACT SETTINGS */}
        {currentTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Website Branding, Contact & Hero Settings</h3>
              <p className="text-xs text-slate-500">Yahan badla gaya koi bhi data seedhe live website par turant dikhega</p>
            </div>

            {settingsSavedMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{settingsSavedMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Branding */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b pb-2">
                  <Globe className="w-4 h-4" /> 1. Brand Identity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={settingsForm.siteName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      placeholder="e.g. Overseas Services"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.siteSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })}
                      placeholder="e.g. Videsh Jobs, Visa & Attestation Portal"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b pb-2">
                  <Phone className="w-4 h-4" /> 2. Contact & Office Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Helpline Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="+919876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number (e.g. 919876543210)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      placeholder="919876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="contact@overseas-services.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Office Full Address</label>
                    <textarea
                      rows="2"
                      value={settingsForm.officeAddress || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Office Timings / Working Hours</label>
                    <textarea
                      rows="2"
                      value={settingsForm.workingHours || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Banner Controls */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b pb-2">
                  <Image className="w-4 h-4" /> 3. Hero Banner & Trust Metrics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={settingsForm.heroTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Highlight (Blue Text)</label>
                    <input
                      type="text"
                      value={settingsForm.heroHighlight || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroHighlight: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Suffix Text</label>
                    <input
                      type="text"
                      value={settingsForm.heroSuffix || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSuffix: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Description Paragraph</label>
                  <textarea
                    rows="2"
                    value={settingsForm.heroDescription || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Skyline Image URL</label>
                  <input
                    type="url"
                    value={settingsForm.heroImageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Placed Count</label>
                    <input
                      type="text"
                      value={settingsForm.placedCount || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, placedCount: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visa Success %</label>
                    <input
                      type="text"
                      value={settingsForm.visaSuccessRate || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, visaSuccessRate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Genuine Contracts %</label>
                    <input
                      type="text"
                      value={settingsForm.genuineContracts || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, genuineContracts: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Website Settings Save Karein</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODULE 3: OPPORTUNITIES & VACANCIES */}
        {currentTab === 'opportunities' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Opportunities & Vacancies</h3>
                <p className="text-xs text-slate-500">Add or edit jobs, European work permits, and service packages</p>
              </div>

              <button
                onClick={() => {
                  setEditingOpp({
                    title: '',
                    serviceType: serviceTypes[0] || '',
                    country: '',
                    imageUrl: imagePresets[0]?.url || '',
                    salary: '',
                    facilities: '',
                    eligibility: '',
                    charges: '',
                    documentsRequired: '',
                    deadline: 'Open',
                    status: 'open',
                    featured: false
                  });
                  setIsOppModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nayi Opportunity Add Karein</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteData.opportunities?.map((opp) => (
                <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 w-full bg-slate-100">
                      {opp.imageUrl && (
                        <img src={opp.imageUrl} alt={opp.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-blue-700 shadow-sm">
                          {opp.country}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          opp.status === 'open' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {opp.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-base leading-snug mb-1">{opp.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-2">{opp.serviceType}</p>
                      <p className="text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-2">
                        {opp.salary || 'Salary as per work'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Deadline: {opp.deadline}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingOpp(opp);
                          setIsOppModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOpp(opp.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: NOTICES */}
        {currentTab === 'notices' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Notice Strip Management</h3>
              <p className="text-xs text-slate-500">Website ke top rotating strip par notices add aur manage karein</p>
            </div>

            <form onSubmit={handleAddNotice} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Naya Notice Add Karein</h4>
              <div>
                <input
                  type="text"
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  placeholder="e.g. Dubai job applications open - Urgent vacancy hotel staff"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={newNoticeLinkedOpp}
                  onChange={(e) => setNewNoticeLinkedOpp(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="">-- Kisi specific opportunity se link karein (Optional) --</option>
                  {siteData.opportunities?.map(o => (
                    <option key={o.id} value={o.id}>{o.title} ({o.country})</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                >
                  Add Notice
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {siteData.notices?.map(notice => (
                <div key={notice.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{notice.text}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Status: <strong className={notice.active ? 'text-emerald-600' : 'text-slate-400'}>{notice.active ? 'Active' : 'Inactive'}</strong></span>
                      {notice.linkedOpportunityId && <span>Linked to ID: {notice.linkedOpportunityId}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleNotice(notice)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        notice.active ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {notice.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: SERVICES (3 CARDS) */}
        {currentTab === 'services' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pramukh Services (Cards)</h3>
                <p className="text-xs text-slate-500">Website ke 3 main service sections ko customize karein</p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    title: '',
                    serviceType: 'Overseas Jobs',
                    badge: 'Popular',
                    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
                    description: '',
                    features: []
                  });
                  setIsServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nayi Service Add Karein</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteData.services?.map(srv => (
                <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 w-full">
                      <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        {srv.badge}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-base">{srv.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                      <div className="mt-3 space-y-1">
                        {(srv.features || []).map((f, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600" /> <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingService({
                          ...srv,
                          features: (srv.features || []).join('\n')
                        });
                        setIsServiceModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: SUCCESS STORIES / REVIEWS */}
        {currentTab === 'testimonials' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Success Stories & Reviews</h3>
                <p className="text-xs text-slate-500">Placed candidates ki photos, quotes aur details add ya edit karein</p>
              </div>

              <button
                onClick={() => {
                  setEditingTestimonial({
                    name: '',
                    role: '',
                    country: 'Dubai, UAE',
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                    quote: '',
                    placedDate: 'Placed Recently',
                    salary: ''
                  });
                  setTestimonialPhotoFile(null);
                  setIsTestimonialModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Naya Candidate Review Add Karein</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteData.testimonials?.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-600 italic leading-relaxed mb-4">"{item.quote}"</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-blue-600 font-semibold">{item.role} ({item.country})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTestimonial(item);
                          setTestimonialPhotoFile(null);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 7: FAQS */}
        {currentTab === 'faqs' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">FAQ Management</h3>
                <p className="text-xs text-slate-500">Website par aam taur par puche jane wale sawal-jawab</p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({ q: '', a: '' });
                  setIsFaqModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Naya FAQ Add Karein</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
              {siteData.faqs?.map(faq => (
                <div key={faq.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsFaqModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: SECURITY & PASSWORD */}
        {currentTab === 'security' && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Admin Security Settings</h3>
              <p className="text-xs text-slate-500">Apna Admin username aur password update karein</p>
            </div>

            {securityMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold">
                {securityMessage}
              </div>
            )}

            <form onSubmit={handleUpdateSecurity} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Username (Optional)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 shadow-md"
                >
                  Password Update Karein
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* APPLICANT DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-400 select-all">
                  Application #{selectedApp.id}
                </span>
                <h3 className="text-lg sm:text-xl font-black">{selectedApp.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedApp.mobile}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <Phone className="w-4 h-4" /> <span>Call {selectedApp.mobile}</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedApp.whatsapp || selectedApp.mobile}?text=Namaste%20${encodeURIComponent(selectedApp.fullName)},%20Overseas%20Services%20se%20aapki%20application%20(ID:%20${selectedApp.id})%20ke%20sambandh%20mein...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <MessageSquare className="w-4 h-4" /> <span>WhatsApp Message</span>
                </a>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Workflow Status Update</label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                    disabled={statusUpdating}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                  >
                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Opportunity Applied</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedApp.opportunityTitle}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Service & Country</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.serviceType} ({selectedApp.country})</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Location</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.district}, {selectedApp.state}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Passport Ready</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedApp.passportStatus === 'Yes' ? '✅ Haan (Yes)' : '❌ Nahi (No)'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Qualification</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.qualification || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Experience / Skill</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.experience || 'N/A'}</p>
                </div>
              </div>

              {/* Uploaded Resume View / Download */}
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 mb-1 block">Uploaded Resume</span>
                {selectedApp.resumeUrl ? (
                  <a
                    href={`${selectedApp.resumeUrl}?token=${encodeURIComponent(authToken)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs border border-blue-200 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download / View Resume ({selectedApp.resumeOriginalName || 'Resume'})</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 italic">Koi resume upload nahi kiya gaya.</p>
                )}
              </div>

              {selectedApp.message && (
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 mb-1 block">Candidate Message</span>
                  <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    "{selectedApp.message}"
                  </p>
                </div>
              )}

              {/* Internal Notes */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-700 block">Team Internal Notes</span>
                {selectedApp.internalNotes && selectedApp.internalNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.internalNotes.map((n, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <p className="text-slate-800">{n.note}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>By: {n.author || 'Admin'}</span>
                          <span>{new Date(n.date).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Abhi tak koi internal note nahi likha gaya.</p>
                )}

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add follow-up note..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <button type="submit" className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl">
                    Add Note
                  </button>
                </form>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPPORTUNITY ADD / EDIT MODAL */}
      {isOppModalOpen && editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto text-xs sm:text-sm">
            <h3 className="text-lg font-bold text-slate-900">
              {editingOpp.id ? 'Opportunity Edit Karein' : 'Nayi Opportunity / Service Add Karein'}
            </h3>

            <form onSubmit={handleSaveOpp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={editingOpp.title}
                  onChange={(e) => setEditingOpp({ ...editingOpp, title: e.target.value })}
                  placeholder="e.g. Dubai Hotel Front Office Staff"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Type *</label>
                  <select
                    value={editingOpp.serviceType}
                    onChange={(e) => setEditingOpp({ ...editingOpp, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {serviceTypes.map(serviceType => (
                      <option key={serviceType} value={serviceType}>{serviceType}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    value={editingOpp.country}
                    onChange={(e) => setEditingOpp({ ...editingOpp, country: e.target.value })}
                    placeholder="e.g. UAE (Dubai)"
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editingOpp.imageUrl || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                  placeholder="https://..."
                />
                <div className="flex items-center gap-2 overflow-x-auto pt-2">
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">Presets:</span>
                  {imagePresets.map((p, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setEditingOpp({ ...editingOpp, imageUrl: p.url })}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border whitespace-nowrap"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary / Remuneration</label>
                  <input
                    type="text"
                    value={editingOpp.salary}
                    onChange={(e) => setEditingOpp({ ...editingOpp, salary: e.target.value })}
                    placeholder="e.g. 2400 - 3200 AED / Month"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="text"
                    value={editingOpp.deadline}
                    onChange={(e) => setEditingOpp({ ...editingOpp, deadline: e.target.value })}
                    placeholder="e.g. 2026-12-31 ya Open"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Facilities / Benefits</label>
                <textarea
                  rows="2"
                  value={editingOpp.facilities}
                  onChange={(e) => setEditingOpp({ ...editingOpp, facilities: e.target.value })}
                  placeholder="Accommodation, Food, Medical, Contract details..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <textarea
                  rows="2"
                  value={editingOpp.eligibility}
                  onChange={(e) => setEditingOpp({ ...editingOpp, eligibility: e.target.value })}
                  placeholder="Age, Qualification, Experience, Skills..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Charges & Fees Policy</label>
                  <input
                    type="text"
                    value={editingOpp.charges}
                    onChange={(e) => setEditingOpp({ ...editingOpp, charges: e.target.value })}
                    placeholder="Visa fee, medical, attestation policy..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingOpp.status}
                    onChange={(e) => setEditingOpp({ ...editingOpp, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {opportunityStatuses.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Documents</label>
                <input
                  type="text"
                  value={editingOpp.documentsRequired}
                  onChange={(e) => setEditingOpp({ ...editingOpp, documentsRequired: e.target.value })}
                  placeholder="Passport, Photos, Marksheets..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOppModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE ADD / EDIT MODAL */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto text-xs sm:text-sm">
            <h3 className="text-lg font-bold text-slate-900">
              {editingService.id ? 'Service Card Edit Karein' : 'Nayi Service Add Karein'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Overseas Jobs (Videsh Rozgar)"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Category Name</label>
                  <input
                    type="text"
                    value={editingService.serviceType}
                    onChange={(e) => setEditingService({ ...editingService, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingService.badge}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                    placeholder="e.g. Urgent Hiring"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingService.imageUrl}
                  onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows="2"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Features (Ek line me ek point)</label>
                <textarea
                  rows="3"
                  value={typeof editingService.features === 'string' ? editingService.features : (editingService.features || []).join('\n')}
                  onChange={(e) => setEditingService({ ...editingService, features: e.target.value })}
                  placeholder="Direct Employer Contracts&#10;Company Stay & Food&#10;Transparent Process"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL ADD / EDIT MODAL */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto text-xs sm:text-sm">
            <h3 className="text-lg font-bold text-slate-900">
              {editingTestimonial.id ? 'Review Edit Karein' : 'Naya Candidate Review Add Karein'}
            </h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Name *</label>
                <input
                  type="text"
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  placeholder="e.g. Rameshwar Yadav"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="e.g. Hotel Facilities"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placed Country</label>
                  <input
                    type="text"
                    value={editingTestimonial.country}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, country: e.target.value })}
                    placeholder="e.g. Dubai, UAE"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Photo Upload</label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-teal-300 bg-teal-50/60">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                    {(testimonialPhotoFile || editingTestimonial.photo) && (
                      <img
                        src={testimonialPhotoFile ? URL.createObjectURL(testimonialPhotoFile) : editingTestimonial.photo}
                        alt="Candidate preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setTestimonialPhotoFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#111f45] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#08a39e]"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">JPG, PNG ya WEBP, maximum 5 MB</p>
                  </div>
                </div>
                <label className="block text-[11px] font-bold text-slate-500 mt-3 mb-1">Photo URL (optional fallback)</label>
                <input
                  type="url"
                  value={editingTestimonial.photo}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Review / Quote *</label>
                <textarea
                  rows="3"
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  placeholder="Overseas Services ke through mera selection hua..."
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placed Date Text</label>
                  <input
                    type="text"
                    value={editingTestimonial.placedDate}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, placedDate: e.target.value })}
                    placeholder="e.g. Placed Oct 2026"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Highlight</label>
                  <input
                    type="text"
                    value={editingTestimonial.salary}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, salary: e.target.value })}
                    placeholder="e.g. 2,600 AED / Month"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ ADD / EDIT MODAL */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs sm:text-sm">
            <h3 className="text-lg font-bold text-slate-900">
              {editingFaq.id ? 'FAQ Edit Karein' : 'Naya FAQ Add Karein'}
            </h3>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question (Sawal) *</label>
                <input
                  type="text"
                  value={editingFaq.q}
                  onChange={(e) => setEditingFaq({ ...editingFaq, q: e.target.value })}
                  placeholder="e.g. Videsh jane ke liye kya passport pehle se hona zaroori hai?"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Answer (Jawab) *</label>
                <textarea
                  rows="3"
                  value={editingFaq.a}
                  onChange={(e) => setEditingFaq({ ...editingFaq, a: e.target.value })}
                  placeholder="Nahi, shuruat me agar aapke paas passport nahi bhi hai..."
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
