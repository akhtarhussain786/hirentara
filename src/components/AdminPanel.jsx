import React, { useState, useEffect } from 'react';
import {
  Shield, LogOut, Search, Filter, Download, Plus, Edit2, Trash2, CheckCircle2,
  Phone, MessageSquare, FileText, ChevronRight, AlertCircle, Clock, Check, X,
  ExternalLink, User, RefreshCw, Eye
} from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active sub-tab: 'applications' | 'opportunities' | 'notices'
  const [currentTab, setCurrentTab] = useState('applications');

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
  const [opportunities, setOpportunities] = useState([]);
  const [editingOpp, setEditingOpp] = useState(null);
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);

  // Notices state
  const [notices, setNotices] = useState([]);
  const [newNoticeText, setNewNoticeText] = useState('');
  const [newNoticeLinkedOpp, setNewNoticeLinkedOpp] = useState('');

  // Stats
  const [stats, setStats] = useState(null);

  const statuses = ['New', 'Contacted', 'Documents Pending', 'Processing', 'Completed', 'Closed'];

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
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch opportunities
  const fetchOpportunities = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.success) setOpportunities(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch notices
  const fetchNotices = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/notices', {
        headers: { 'x-admin-token': authToken }
      });
      const data = await res.json();
      if (data.success) setNotices(data.data);
    } catch (err) {
      console.error(err);
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
      fetchApplications();
      fetchOpportunities();
      fetchNotices();
      fetchStats();
    }
  }, [authToken, filterStatus, filterService]);

  // Export to Excel
  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filterStatus !== 'All') params.append('status', filterStatus);
    if (filterService !== 'All') params.append('service', filterService);

    // Trigger download with auth token header via direct fetch or window
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

  // Update Status
  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken
        },
        body: JSON.stringify({ status: newStatus })
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

  // Add Internal Note
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
        fetchOpportunities();
        setIsOppModalOpen(false);
        setEditingOpp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Opportunity
  const handleDeleteOpp = async (id) => {
    if (!window.confirm('Kya aap is opportunity ko delete karna chahte hain?')) return;
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      if (res.ok) fetchOpportunities();
    } catch (e) {}
  };

  // Notice Add
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
        fetchNotices();
      }
    } catch (e) {}
  };

  // Toggle Notice Active
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
      fetchNotices();
    } catch (e) {}
  };

  // Delete Notice
  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete notice?')) return;
    try {
      await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken }
      });
      fetchNotices();
    } catch (e) {}
  };

  // Color badges for status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Documents Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closed':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // IF NOT LOGGED IN -> SHOW LOGIN SCREEN
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Admin Control Panel</h3>
            <p className="text-xs text-slate-500 mt-1">
              Authorized team login for managing notices & overseas leads
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (default: admin123)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Default demo password: <code className="text-blue-600 font-bold">admin123</code></p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Login to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 leading-tight">Overseas Admin Suite</h2>
            <p className="text-[11px] text-slate-500 font-medium">Logged in as Administrator</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrentTab('applications')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'applications' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Applications ({stats?.totalApplications || applications.length})
          </button>
          <button
            onClick={() => setCurrentTab('opportunities')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'opportunities' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Opportunities ({opportunities.length})
          </button>
          <button
            onClick={() => setCurrentTab('notices')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'notices' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notices ({notices.length})
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            View Live Site
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab switcher */}
      <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 py-2 px-3 text-xs font-bold">
        <button
          onClick={() => setCurrentTab('applications')}
          className={`py-1 px-2 rounded ${currentTab === 'applications' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
        >
          Applications
        </button>
        <button
          onClick={() => setCurrentTab('opportunities')}
          className={`py-1 px-2 rounded ${currentTab === 'opportunities' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
        >
          Opportunities
        </button>
        <button
          onClick={() => setCurrentTab('notices')}
          className={`py-1 px-2 rounded ${currentTab === 'notices' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
        >
          Notices
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: APPLICATIONS & WORKFLOW */}
        {currentTab === 'applications' && (
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* KPI Status Summary Cards */}
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
                {/* Filter dropdowns */}
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
                  <option value="Overseas Jobs">Overseas Jobs</option>
                  <option value="Visa Assistance">Visa Assistance</option>
                  <option value="Documents Assistance">Documents Assistance</option>
                </select>

                {/* Export Excel Button */}
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

            {/* Applications Table / Cards */}
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
                          <td className="py-3 px-4">
                            {app.district}, {app.state}
                          </td>
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

        {/* TAB 2: OPPORTUNITIES MANAGEMENT */}
        {currentTab === 'opportunities' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Opportunities & Services</h3>
                <p className="text-xs text-slate-500">Manage vacancies, salaries, countries, eligibility and open/close status</p>
              </div>

              <button
                onClick={() => {
                  setEditingOpp({
                    title: '',
                    serviceType: 'Overseas Jobs',
                    country: '',
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {opp.country}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      opp.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {opp.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{opp.title}</h4>
                  <p className="text-xs text-slate-500">{opp.serviceType} • {opp.salary || 'Salary as per work'}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NOTICES MANAGEMENT */}
        {currentTab === 'notices' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Notice Strip Management</h3>
              <p className="text-xs text-slate-500">Website ke top strip par ghumne wale notices add aur control karein</p>
            </div>

            {/* Add Notice Form */}
            <form onSubmit={handleAddNotice} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Naya Notice Add Karein</h4>
              
              <div>
                <input
                  type="text"
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  placeholder="Notice text: e.g. Dubai job applications open - Urgent vacancy hotel staff"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {opportunities.map(o => (
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

            {/* Existing Notices List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {notices.map(notice => (
                <div key={notice.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{notice.text}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Status: <strong className={notice.active ? 'text-emerald-600' : 'text-slate-400'}>{notice.active ? 'Active' : 'Inactive'}</strong></span>
                      {notice.linkedOpportunityId && (
                        <span>Linked to ID: {notice.linkedOpportunityId}</span>
                      )}
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

      </div>

      {/* APPLICANT DETAIL & ACTION DRAWER/MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
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

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
              
              {/* Quick Contact Buttons (Call / WhatsApp) as specified in brief */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedApp.mobile}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedApp.mobile}</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedApp.whatsapp || selectedApp.mobile}?text=Namaste%20${encodeURIComponent(selectedApp.fullName)},%20Overseas%20Services%20se%20aapki%20application%20(ID:%20${selectedApp.id})%20ke%20sambandh%20mein...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </a>
              </div>

              {/* Status Update Dropdown (Workflow as specified: New -> Contacted -> Documents Pending -> Processing -> Completed/Closed) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Application Workflow Status Update
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                    disabled={statusUpdating}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
                    Current: {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Candidate Info Grid */}
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
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Location (District, State)</span>
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

              {/* Uploaded Resume View / Download (Secure token protected) */}
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

              {/* Candidate Message */}
              {selectedApp.message && (
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 mb-1 block">Candidate Message</span>
                  <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    "{selectedApp.message}"
                  </p>
                </div>
              )}

              {/* Internal Notes History & Form */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-700 block">
                  Team Internal Notes (Follow-up log)
                </span>

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
                    placeholder="Add follow-up note (e.g. Call par baat hui, documents mangwaye)..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900"
                  >
                    Add Note
                  </button>
                </form>
              </div>

            </div>

            {/* Footer */}
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
                    <option value="Overseas Jobs">Overseas Jobs</option>
                    <option value="Visa Assistance">Visa Assistance</option>
                    <option value="Documents Assistance">Documents Assistance</option>
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
                    <option value="open">Open (Accepting Applications)</option>
                    <option value="closed">Closed (Band)</option>
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

    </div>
  );
}

