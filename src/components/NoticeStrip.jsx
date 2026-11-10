import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight, Sparkles } from 'lucide-react';

export default function NoticeStrip({ notices, onSelectOpportunityById }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!notices || notices.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [notices]);

  if (!notices || notices.length === 0) return null;

  const currentNotice = notices[currentIndex];

  const handleClick = (notice) => {
    if (notice.linkedOpportunityId) {
      onSelectOpportunityById(notice.linkedOpportunityId);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-200"></span>
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-yellow-100 font-bold uppercase tracking-wider text-[11px]">
              <Bell className="w-3.5 h-3.5" />
              <span>Latest Notice</span>
            </div>
          </div>

          {/* Notice content - clickable */}
          <div 
            onClick={() => handleClick(currentNotice)}
            className="flex-1 truncate cursor-pointer hover:underline flex items-center justify-center gap-2 text-center font-medium"
            title="Click to view details and apply"
          >
            <span className="truncate">{currentNotice.text}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-yellow-200 font-bold flex-shrink-0 text-xs">
              Details dekhein <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Dots Indicator if multiple notices */}
          {notices.length > 1 && (
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {notices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to notice ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

