import React from 'react';
import { Star, CheckCircle, Quote, MapPin } from 'lucide-react';

export default function TestimonialsSection() {
  const stories = [
    {
      name: "Rameshwar Yadav",
      role: "Hotel Facilities & Steward",
      country: "Dubai, UAE",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      quote: "Overseas Services ke through mera Dubai hotel me selection hua. Visa 25 din me aa gaya aur company ne free room aur khana diya hai. Bahut honest team hai.",
      placedDate: "Placed Oct 2026",
      salary: "2,600 AED / Month"
    },
    {
      name: "Praveen Sharma",
      role: "Logistics Warehouse Assistant",
      country: "Warsaw, Poland (Europe)",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      quote: "Europe jane ka sapna tha. Sirf basic 12th thi, lekin inhone work permit aur VFS appointment me poora guide kiya. Aaj Poland me achhi earning kar raha hu.",
      placedDate: "Placed Sep 2026",
      salary: "4,600 PLN / Month"
    },
    {
      name: "Mohammad Irfan",
      role: "Certified Industrial Electrician",
      country: "Riyadh, Saudi Arabia",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      quote: "ITI ke baad job dhoondh raha tha. Inke pass aane ke baad trade test hua aur direct company ka offer letter mila. Iqama aur medical sab smoothly ho gaya.",
      placedDate: "Placed Aug 2026",
      salary: "3,000 SAR / Month"
    }
  ];

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
              className="bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
