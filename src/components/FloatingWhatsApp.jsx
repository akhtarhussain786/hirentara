import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export default function FloatingWhatsApp({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = settings?.whatsapp || "919876543210";

  const quickMessages = [
    { title: "Dubai Job Openings", text: "Namaste, mujhe Dubai hotel/technician job vacancy ke bare me jankari chahiye." },
    { title: "Europe / Poland Work Permit", text: "Namaste, Poland warehouse aur European work permit process ke bare me janna hai." },
    { title: "Visa & Document Attestation", text: "Namaste, mujhe Visa assistance aur MEA Apostille attestation ki jankari chahiye." }
  ];

  const sendWhatsApp = (msg) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Expanded Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm">Overseas Support Desk</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online • Instant Help</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-700">
              <p className="font-semibold">Namaste! 👋</p>
              <p className="text-slate-500 mt-1">
                Videsh jane, visa processing ya job apply karne ke liye hamare verified counselor se direct WhatsApp par chat karein.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                Quick Topics select karein:
              </span>
              {quickMessages.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendWhatsApp(item.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 transition-all font-semibold flex items-center justify-between group shadow-2xs"
                >
                  <span>{item.title}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Direct CTA */}
          <div className="p-3 bg-white border-t border-slate-100">
            <button
              onClick={() => sendWhatsApp("Namaste, mujhe Overseas Services ke bare me counseling chahiye.")}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Chat Shuru Karein</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 sm:p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        aria-label="WhatsApp Helpline"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-emerald-500" />
      </button>

    </div>
  );
}
