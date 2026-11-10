import React, { useState } from 'react';
import { MapPin, Banknote, Calendar, ChevronRight, CheckCircle2, Search, Filter, AlertCircle } from 'lucide-react';

export default function OpportunitiesSection({
  opportunities,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onApply
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Overseas Jobs', 'Visa Assistance', 'Documents Assistance'];

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
    <section id="opportunities" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 mb-2">
              Latest Openings & Assistance
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Opportunities & Service Listings
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Apni pasand ka desh ya service select karein aur details dekh kar form bharein.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country, job role..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Opportunity Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-700">Koi opportunity nahi mili</h4>
            <p className="text-sm text-slate-500 mt-1">Kripya doosra search term try karein ya filter change karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const isClosed = item.status === 'closed';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border ${
                    isClosed ? 'border-slate-200 opacity-75' : 'border-slate-200/80 hover:border-blue-400'
                  } p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {item.country}
                      </span>
                      {isClosed ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                          Applications Closed
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          Applications Open
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Service Type Tag */}
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      {item.serviceType}
                    </p>

                    {/* Salary / Scope Highlight */}
                    {item.salary && item.salary !== 'N/A' && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                          <Banknote className="w-4 h-4 text-amber-600" />
                          <span>Estimated Salary / Package</span>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {item.salary}
                        </p>
                      </div>
                    )}

                    {/* Facilities / Short Info */}
                    <div className="space-y-2 mb-6">
                      <div className="text-xs text-slate-600 line-clamp-2">
                        <span className="font-semibold text-slate-800">Facilities: </span>
                        {item.facilities || 'Standard company accommodation and benefits.'}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">
                        <span className="font-semibold text-slate-800">Eligibility: </span>
                        {item.eligibility || 'Check details for eligibility criteria.'}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Deadline */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Deadline: <strong className="text-slate-700">{item.deadline || 'Open'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => onApply(item)}
                        disabled={isClosed}
                        className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl transition-all text-center ${
                          isClosed
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                        }`}
                      >
                        Apply Now
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
