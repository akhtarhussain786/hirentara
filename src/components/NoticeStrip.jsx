import React from 'react';
import { Bell, ArrowRight, Sparkles } from 'lucide-react';

export default function NoticeStrip({ notices, onSelectOpportunityById }) {
  if (!notices || notices.length === 0) return null;

  const handleClick = (notice) => {
    if (notice.linkedOpportunityId) {
      onSelectOpportunityById(notice.linkedOpportunityId);
    }
  };

  const tickerNotices = [...notices, ...notices];

  return (
    <div className="bg-gradient-to-r from-[#071126] via-[#111f45] to-[#071126] text-white shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-xs sm:text-sm">
          
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-300"></span>
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 backdrop-blur-sm text-teal-200 font-bold uppercase tracking-wider text-[11px]">
            <Bell className="w-3.5 h-3.5" />
            <span>Latest Updates</span>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden notice-ticker-mask">
          <div className="notice-ticker-track">
            {tickerNotices.map((notice, index) => (
              <button
                type="button"
                key={`${notice.id}-${index}`}
                onClick={() => handleClick(notice)}
                className="inline-flex items-center gap-2 px-7 whitespace-nowrap font-medium hover:text-teal-200 transition-colors"
                title="Click to view details and apply"
              >
                <span>{notice.text}</span>
                <span className="inline-flex items-center gap-1 text-teal-300 font-bold text-xs">
                  Details dekhein <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
