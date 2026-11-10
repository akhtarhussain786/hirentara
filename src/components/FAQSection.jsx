import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';

export default function FAQSection({ faqs: propFaqs, settings }) {
  const [openIndex, setOpenIndex] = useState(0);

  const phone = settings?.phone || "+919876543210";
  const whatsapp = settings?.whatsapp || "919876543210";

  const defaultFaqs = [
    {
      q: "Videsh jane ke liye kya passport pehle se hona zaroori hai?",
      a: "Nahi, shuruat me agar aapke paas passport nahi bhi hai, tab bhi aap enquiry form bhar sakte hain. Hamari team aapko Tatkal ya Normal passport banwane ka poora process samjha degi. Lekin visa stamping ke samay valid passport zaroori hota hai."
    },
    {
      q: "Visa aur processing me lagbhag kitna samay lagta hai?",
      a: "Gulf deshon (Dubai, Saudi Arabia, Qatar) ke liye employment visa aamtaur par 20 se 35 din me process ho jata hai. European deshon (Poland, Croatia) ke liye official Work Permit aane me 60 se 90 din ka samay lagta hai."
    },
    {
      q: "Kya rehna (Accommodation) aur khana company ki taraf se milta hai?",
      a: "Haan, hamari zyadatar overseas job vacancies me company sharing accommodation, transportation aur food allowance ya subsidized mess provide karti hai. Har vacancy ke Details page par iski poori jankari di gayi hai."
    },
    {
      q: "Kya koi hidden charges ya fraud ka risk hai?",
      a: "Bilkul nahi. Hamari consultancy 100% genuine aur government registered standards follow karti hai. Document verification aur selection ke baad transparent fee breakdown diya jata hai aur proper receipt di jati hai."
    },
    {
      q: "Medical fitness test (GAMCA) kaise aur kahan hota hai?",
      a: "Gulf deshon ke liye GAMCA approved centers par medical test hota hai. Hamari team aapke shahar ke sabse kareebi approved medical center ka appointment book karwane me madad karti hai."
    }
  ];

  const faqs = (propFaqs && propFaqs.length > 0) ? propFaqs : defaultFaqs;

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Aksar Puche Jane Wale Sawal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Videsh jane, visa processing aur documentation se jude aam sawalon ke uttar.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 text-sm sm:text-base transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-10 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-black">Koi aur sawal hai? Hamse baat karein</h4>
            <p className="text-xs text-blue-100 mt-1">
              Hamare counselors aapke sawaalon ka turant jawab denge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Call Helpline</span>
            </a>
            <a
              href="https://wa.me/919876543210?text=Namaste,%20mujhe%20videsh%20services%20ke%20bare%20me%20sawal%20hai."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

