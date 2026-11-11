import React from 'react';
import { Briefcase, Compass, FileCheck2, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function ServicesSection({ services: propServices, onSelectCategory, onApplyForService }) {
  const defaultServices = [
    {
      id: 'srv-1',
      serviceType: 'Overseas Jobs',
      title: 'Overseas Jobs (Videsh Rozgar)',
      badge: 'Urgent Hiring',
      icon: Briefcase,
      imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
      description: 'Dubai, Gulf, Poland aur European countries me verified employers ke saath hotel, warehouse, technician, driver aur logistics jobs.',
      features: [
        'Direct Employer Contracts & Offer Letters',
        'Company Stay, Food & Health Insurance',
        'Transparent Process & Fair Salary',
        'Pre-departure orientation & airport pickup'
      ]
    },
    {
      id: 'srv-2',
      serviceType: 'Visa Assistance',
      title: 'Visa Assistance Services',
      badge: '98% Approval',
      icon: Compass,
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      description: 'Employment Visa, Tourist Visa, Business Visa aur Student Visa ke liye complete file preparation, appointment booking aur counseling.',
      features: [
        'VFS & Embassy Appointment Booking',
        'Cover Letter, SOP & Financial Checklist',
        'Embassy Mock Interview Guidance',
        'Fast-track Visa filing & live status track'
      ]
    },
    {
      id: 'srv-3',
      serviceType: 'Documents Assistance',
      title: 'MEA Apostille & Attestation',
      badge: 'Govt Certified',
      icon: FileCheck2,
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      description: 'MEA Apostille, State HRD, Notary, SDM aur foreign embassies (UAE, Saudi, Kuwait, Qatar) se legal degree aur certificate attestation.',
      features: [
        'MEA (Ministry of External Affairs) Apostille',
        'Degree, Marksheet & Diploma Stamping',
        'Birth, Marriage & Commercial Certificate',
        'Safe doorstep pickup & speed courier service'
      ]
    }
  ];

  const services = (propServices && propServices.length > 0) ? propServices : defaultServices;

  return (
    <section id="services" className="brand-section py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hamari 3 Pramukh Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Videsh Jane Ki Har Jarurat Ke Liye Complete Guidance
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Chahe aapko videsh me high-paying job chahiye, travel/work visa lagwana ho ya MEA apostille karwana ho — sab ek hi chhat ke neeche.
          </p>
        </div>

        {/* 3 Main Service Cards with Real Photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = srv.icon || Briefcase;
            const cardImg = srv.imageUrl || srv.image || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80';
            const srvType = srv.serviceType || srv.id;
            return (
              <div
                key={srv.id}
                className="premium-card group relative bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Real Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={cardImg}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                    
                    {/* Top Tag & Floating Icon */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-blue-700 flex items-center justify-center shadow-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black px-3 py-1 bg-blue-600 text-white rounded-full shadow-md uppercase tracking-wide">
                        {srv.badge}
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-black text-white leading-snug">
                        {srv.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {srv.description}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 pb-6 pt-2 flex items-center gap-3 border-t border-slate-100">
                  <button
                    onClick={() => onSelectCategory(srvType)}
                    className="flex-1 py-3 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
                  >
                    View Vacancies
                  </button>
                  <button
                    onClick={() => onApplyForService(srvType)}
                    className="py-3 px-5 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors text-center shadow-md flex items-center gap-1.5"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
