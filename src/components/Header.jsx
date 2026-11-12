import React, { useState } from 'react';
import { Globe, Menu, X, Shield, PhoneCall, Send, Briefcase } from 'lucide-react';

export default function Header({ settings, onOpenApply, onOpenAdmin, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const siteName = settings?.siteName || '';
  const siteSubtitle = settings?.siteSubtitle || '';
  const logoUrl = settings?.logoUrl || '';

  const scrollTo = (id) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Globe className="w-7 h-7 text-blue-700" />
              )}
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                {siteName}
              </span>
              <p className="text-xs text-slate-500 font-medium">{siteSubtitle}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollTo('home')}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollTo('services')}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollTo('opportunities')}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Opportunities
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all"
              title="Admin Panel Login"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => onOpenApply(null)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenApply(null)}
              className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Apply
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <button
            onClick={() => scrollTo('home')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo('opportunities')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Opportunities
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Contact & Office
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenApply(null); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl text-center shadow-md"
            >
              <Send className="w-4 h-4" /> Apply Now (Common Form)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-center text-sm"
            >
              <Shield className="w-4 h-4 text-slate-500" /> Admin Panel Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

