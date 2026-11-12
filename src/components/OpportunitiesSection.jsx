import React, { useState } from 'react';
import { MapPin, Banknote, Calendar, Search, AlertCircle, ArrowRight, Eye, Sparkles } from 'lucide-react';

export default function OpportunitiesSection({
  opportunities,
  serviceTypes,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onApply
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...(serviceTypes || [])];

  const filtered = opportunities.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.serviceType === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.eligibility?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="opportunities" className="brand-section py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live Overseas Vacancies & Services
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Apni yogyata aur pasandeeda desh ke hisaab se service select karein aur transparent jankari paane ke liye details dekhein.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Dubai, Poland, Hotel, Technician..."
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Opportunity Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-700">Koi opportunity match nahi hui</h4>
            <p className="text-sm text-slate-500 mt-1">Kripya koi doosra search keyword use karein ya 'All' category select karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((item) => {
              const isClosed = item.status === 'closed';

              return (
                <div
                  key={item.id}
                  className={`premium-card bg-white rounded-3xl border ${
                    isClosed ? 'border-slate-200 opacity-75' : 'border-slate-200/90 hover:border-teal-400'
                  } shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
                >
                  <div>
                    {/* Real Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white">
                          <MapPin className="w-10 h-10 opacity-40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                      {/* Country Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-blue-800 shadow-md">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {item.country}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isClosed ? (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-600 text-white shadow-md">
                            Closed
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Open
                          </span>
                        )}
                      </div>

                      {/* Service Tag on Image */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                          {item.serviceType}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h4 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h4>

                      {/* Salary / Remuneration Box */}
                      {item.salary && item.salary !== 'N/A' && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 mb-4">
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 uppercase tracking-wider mb-0.5">
                            <Banknote className="w-3.5 h-3.5 text-amber-600" />
                            <span>Estimated Salary</span>
                          </div>
                          <p className="text-sm font-black text-slate-900">
                            {item.salary}
                          </p>
                        </div>
                      )}

                      {/* Facilities & Eligibility Snippet */}
                      <div className="space-y-2 mb-4 text-xs text-slate-600">
                        <div className="line-clamp-2">
                          <span className="font-bold text-slate-800">Facilities: </span>
                          {item.facilities || 'Company provided stay, food & insurance.'}
                        </div>
                        <div className="line-clamp-2">
                          <span className="font-bold text-slate-800">Eligibility: </span>
                          {item.eligibility || 'Click View Details for qualification and age limit.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Deadline: <strong className="text-slate-800">{item.deadline || 'Open'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => onApply(item)}
                        disabled={isClosed}
                        className={`w-full py-2.5 px-3 text-xs font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-md ${
                          isClosed
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                        }`}
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
