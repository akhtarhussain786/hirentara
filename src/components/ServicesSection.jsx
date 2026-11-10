import React from 'react';
import { Briefcase, Compass, FileCheck2, ArrowRight, Check } from 'lucide-react';

export default function ServicesSection({ onSelectCategory, onApplyForService }) {
  const services = [
    {
      id: 'Overseas Jobs',
      title: 'Overseas Jobs (Videsh Rozgar)',
      badge: 'High Demand',
      icon: Briefcase,
      color: 'blue',
      description: 'Dubai, Gulf, Poland aur European countries me verified employers ke saath hotel, warehouse, technician, driver aur logistics jobs.',
      features: [
        'Verified Foreign Employers & Direct Contracts',
        'Accommodation, Food & Medical assistance',
        'Fair salary package & transparent documentation',
        'Complete pre-departure guidance'
      ]
    },
    {
      id: 'Visa Assistance',
      title: 'Visa Assistance Services',
      badge: 'Quick Filing',
      icon: Compass,
      color: 'emerald',
      description: 'Employment Visa, Tourist Visa, Business Visa aur Student Visa ke liye complete file preparation, appointment booking aur counseling.',
      features: [
        'VFS Appointment & Slot Booking guidance',
        'Embassy visa documentation preparation',
        'Cover letter & financial SOP review',
        'High visa success tracking support'
      ]
    },
    {
      id: 'Documents Assistance',
      title: 'Documents & MEA Attestation',
      badge: 'Govt Verified',
      icon: FileCheck2,
      color: 'indigo',
      description: 'MEA Apostille, State HRD, Notary, SDM aur foreign embassies (UAE, Saudi, Kuwait, Qatar) se legal degree aur certificate attestation.',
      features: [
        'MEA (Ministry of External Affairs) Apostille',
        'Educational & Personal certificate attestation',
        'Certified legal foreign translation services',
        'Safe doorstep collection & speed-post delivery'
      ]
    }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 mb-2">
            Hamari Pramukh Services
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Videsh Jane Ki Har Jarurat Ke Liye Ek Vishwasniya Sath
          </h3>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Chahe aapko videsh me job chahiye, visa lagwana ho ya documents attest karwane hon - hum provide karte hain end-to-end assistance.
          </p>
        </div>

        {/* 3 Main Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                      {srv.badge}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {srv.title}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => onSelectCategory(srv.id)}
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
                  >
                    View Vacancies
                  </button>
                  <button
                    onClick={() => onApplyForService(srv.id)}
                    className="py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors text-center"
                  >
                    Apply Now
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

