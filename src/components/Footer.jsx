import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Mail, Globe, ShieldCheck } from 'lucide-react';

export default function Footer({ settings, onOpenAdmin }) {
  const [logoError, setLogoError] = useState(false);
  const phoneNumber = settings?.phone || "+919876543210";
  const whatsappNumber = settings?.whatsapp || "919876543210";
  const officeAddress = settings?.officeAddress || "SCF 24, 2nd Floor, Hirentara Overseas Complex, Near Bus Stand, Gorakhpur, UP - 273001";
  const workingHours = settings?.workingHours || "Monday - Saturday: 9:30 AM to 6:30 PM (Sunday Closed)";
  const email = settings?.email || "contact@hirentara.com";
  const siteName = settings?.siteName || "Hirentara";
  const logoUrl = settings?.logoUrl || "/logo.jpg";

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
                {logoUrl && !logoError ? (
                  <img
                    src={logoUrl}
                    alt={`${siteName} Logo`}
                    onError={() => setLogoError(true)}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Globe className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {siteName}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Aapka bharosemand saathi videsh jane ke sapne ke liye. Hum provide karte hain legal overseas job assistance, visa counseling aur MEA apostille certification. 100% transparent aur verified process.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ministry of External Affairs (MEA) Registered Guidance</span>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Instant Contact (Sampark)
            </h4>

            <div className="space-y-2.5">
              {/* Call Button */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Helpline: {phoneNumber}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Namaste,%20mujhe%20${encodeURIComponent(siteName)}%20ke%20bare%20me%20jankari%20chahiye.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{workingHours}</span>
              </span>
            </div>
          </div>

          {/* Office Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Hamara Karyalay (Office)
            </h4>

            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteName}. Sabhi adhikar surakshit.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-blue-400 underline transition-colors"
            >
              Admin Lead Portal Login
            </button>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Contact Bar for Mobile (As noted in brief: "Mobile par contact buttons aasani se milenge") */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href={`tel:${phoneNumber}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          <Phone className="w-3.5 h-3.5" /> Call Karein
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}?text=Namaste,%20mujhe%20${encodeURIComponent(siteName)}%20ke%20bare%20me%20jankari%20chahiye.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </footer>
  );
}

