import React, { useEffect, useState } from 'react';
import { ArrowRight, PlaneTakeoff, ShieldCheck, CheckCircle2, Award, MapPin, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Hero({ settings, onExplore, onApply }) {
  const heroTitle = settings?.heroTitle || "Videsh Jane Ka Sapna,";
  const heroHighlight = settings?.heroHighlight || "Sahi, Surakshit & Legal";
  const heroSuffix = settings?.heroSuffix || "Tarike Se.";
  const heroDescription = settings?.heroDescription || "Dubai, Gulf aur European deshon me verified jobs, fast-track visa processing aur legal MEA document attestation. Hamari team aapke sath shuruat se visa milne tak khadi rehti hai.";
  const heroImageUrl = settings?.heroImageUrl || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80";
  const placedCount = settings?.placedCount || "5,400+";
  const visaSuccessRate = settings?.visaSuccessRate || "98.4%";
  const genuineContracts = settings?.genuineContracts || "100%";
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image: heroImageUrl,
      eyebrow: 'Featured Destination',
      title: 'Dubai: Apka Global Career Yahan Se Shuru Ho Sakta Hai',
      detail: 'Hotel, facility aur hospitality roles with verified employers.',
      motivation: '“Sahi guidance ke saath har sapna ek career ban sakta hai.”',
      accent: 'from-[#071126] via-[#111f45]/70 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=85',
      eyebrow: 'Europe Work Permit',
      title: 'Poland Mein Naye Mauke Aapka Intezaar Kar Rahe Hain',
      detail: 'Warehouse, logistics aur skilled work opportunities.',
      motivation: '“Aaj ka ek bold decision, kal ki behtar zindagi badal sakta hai.”',
      accent: 'from-[#071126] via-[#172754]/70 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85',
      eyebrow: 'Safe & Legal Process',
      title: 'Videsh Jaane Ka Safar, Bharose Ke Saath',
      detail: 'Visa counselling, document attestation aur complete support.',
      motivation: '“Aapka passport sirf document nahi, naye future ka ticket hai.”',
      accent: 'from-[#071126] via-[#086b68]/70 to-transparent'
    },
    {
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
      eyebrow: 'Verified Opportunities',
      title: 'Apni Mehnat Ko Global Pehchaan Dijiye',
      detail: 'Transparent information, genuine contracts aur dedicated counsellors.',
      motivation: '“Sapne wahi sach hote hain jinhe hum pehla kadam de dete hain.”',
      accent: 'from-[#071126] via-[#121f45]/70 to-transparent'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const showSlide = (direction) => {
    setActiveSlide((current) => (
      direction === 'next'
        ? (current + 1) % heroSlides.length
        : (current - 1 + heroSlides.length) % heroSlides.length
    ));
  };

  const destinationCountries = [
    { name: 'Dubai (UAE)', flag: '🇦🇪', openJobs: '18+ Openings' },
    { name: 'Poland (Europe)', flag: '🇵🇱', openJobs: '12+ Openings' },
    { name: 'Saudi Arabia', flag: '🇸🇦', openJobs: '15+ Openings' },
    { name: 'Qatar', flag: '🇶🇦', openJobs: '8+ Openings' },
    { name: 'Croatia / Europe', flag: '🇭🇷', openJobs: '10+ Openings' },
    { name: 'Kuwait', flag: '🇰🇼', openJobs: '6+ Openings' }
  ];

  return (
    <div id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Government Registered & 100% Verified Overseas Assistance</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              {heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                {heroHighlight}
              </span> {heroSuffix}
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base"
              >
                <PlaneTakeoff className="w-5 h-5" />
                <span>Explore Open Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onApply(null)}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base"
              >
                <span>Direct Apply Form</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80">
              <div>
                <div className="text-2xl font-black text-slate-900">{placedCount}</div>
                <div className="text-xs text-slate-500 font-medium">Placed Overseas</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">{visaSuccessRate}</div>
                <div className="text-xs text-slate-500 font-medium">Visa Approval Rate</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">{genuineContracts}</div>
                <div className="text-xs text-slate-500 font-medium">Genuine Contracts</div>
              </div>
            </div>

          </div>

          {/* Right Column: Real Eye-Catching Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Motivational destination carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[4/3] group bg-[#071126]">
                {heroSlides.map((slide, index) => (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                      index === activeSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                    }`}
                  />
                ))}
                <div className={`absolute inset-0 bg-gradient-to-t ${heroSlides[activeSlide].accent}`} />

                <button
                  type="button"
                  onClick={() => showSlide('previous')}
                  aria-label="Previous home banner"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => showSlide('next')}
                  aria-label="Next home banner"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute top-4 right-4 flex gap-1.5">
                  {heroSlides.map((slide, index) => (
                    <button
                      type="button"
                      key={slide.eyebrow}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Show banner ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-7 bg-teal-300' : 'w-2 bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-2">
                    {heroSlides[activeSlide].eyebrow}
                  </span>
                  <p className="text-lg sm:text-xl font-black text-white leading-tight">
                    {heroSlides[activeSlide].title}
                  </p>
                  <p className="text-xs text-slate-200 mt-1.5">
                    {heroSlides[activeSlide].detail}
                  </p>
                  <div className="flex items-start gap-1.5 mt-3 text-[11px] text-teal-100 font-semibold">
                    <Quote className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{heroSlides[activeSlide].motivation}</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Visa Approved Card */}
              <div className="absolute -top-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Visa Approved! 🎉</span>
                  <span className="text-[11px] text-slate-500">Dubai Luxury Hotel Staff</span>
                </div>
              </div>

              {/* Floating Badge 2: Verified Employer Card */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">MEA Registered ✈️</span>
                  <span className="text-[11px] text-slate-500">100% Legal Work Contracts</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Popular Destination Strip */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Pramukh Desh Jahan Hamari Hiring Chalti Hai
            </h4>
            <span className="text-xs font-bold text-blue-600">Updated Daily</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {destinationCountries.map((c, i) => (
              <div
                key={i}
                onClick={onExplore}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-center gap-2.5 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{c.flag}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">{c.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{c.openJobs}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Step Visitor Safar Indicator */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4 text-center">
            Aapka Simple Safar: 3 Aasan Kadam
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md shadow-blue-500/20">
                1
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">Notice & Vacancy Dekhein</h5>
                <p className="text-xs text-slate-600 mt-0.5">Apne profile ke anukool desh aur job opportunity ki detail check karein.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md shadow-indigo-500/20">
                2
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">Apply Form Bharein</h5>
                <p className="text-xs text-slate-600 mt-0.5">Simple basic details bharein aur screen par unique Application ID payein.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md shadow-emerald-500/20">
                3
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">Verified Team Follow-Up</h5>
                <p className="text-xs text-slate-600 mt-0.5">Hamari verified counseling team aapse direct Call/WhatsApp par baat karegi.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
