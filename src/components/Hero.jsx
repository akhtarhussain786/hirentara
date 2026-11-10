import React from 'react';
import { ArrowRight, PlaneTakeoff, ShieldCheck, FileCheck, CheckCircle2, Users } from 'lucide-react';

export default function Hero({ onExplore, onApply }) {
  return (
    <div id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Government Registered & 100% Verified Overseas Assistance</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Videsh Jane Ka Sapna, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Sahi Aur Surakshit Tarike Se.
            </span>
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Dubai, Europe, Gulf aur anya deshon ke liye genuine Jobs, Work & Tourist Visa Assistance, aur Document Attestation services. Ek hi form bharein aur hamari verified team aapse seedhe sampark karegi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base"
            >
              <PlaneTakeoff className="w-5 h-5" />
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onApply(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm hover:border-slate-400 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base"
            >
              <span>Direct Apply Form</span>
            </button>
          </div>

          {/* 3 Step Simple Safar Indicator */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
              Visitor Ka Simple Safar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              
              <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50/80">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Notice & Details</h5>
                  <p className="text-xs text-slate-500">Service ya Job opportunity ki poori jankari dekhein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50/80">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Apply Form Bharein</h5>
                  <p className="text-xs text-slate-500">Basic details bharein aur unique Application ID payein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Team Follow-Up</h5>
                  <p className="text-xs text-slate-500">Hamari expert team aapse call/WhatsApp par process karegi.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

