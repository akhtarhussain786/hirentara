import React from 'react';
import { Star, CheckCircle, Quote, MapPin } from 'lucide-react';

export default function TestimonialsSection({ testimonials: propTestimonials }) {
  const stories = propTestimonials || [];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest mb-3 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Hamare Placed Candidates Ka Anubhav
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Dekhein kaise hazaron yuvaon ne sahi margdarshan ke sath videsh me apna career banaya.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((s, idx) => (
            <div
              key={idx}
              className="premium-card bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{s.quote}"
                </p>
              </div>

              {/* Candidate Info with Real Avatar */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5">
                <img
                  src={s.photo}
                  alt={s.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                />
                <div className="truncate">
                  <h4 className="text-sm font-black text-slate-900 truncate">{s.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-blue-700 font-bold truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{s.role} ({s.country})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {s.placedDate} • <span className="text-emerald-600 font-bold">{s.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
