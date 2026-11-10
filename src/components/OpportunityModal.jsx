import React from 'react';
import { X, MapPin, Banknote, Calendar, CheckCircle2, FileText, AlertCircle, Send, ShieldCheck, Building } from 'lucide-react';

export default function OpportunityModal({ opportunity, onClose, onApply }) {
  if (!opportunity) return null;

  const isClosed = opportunity.status === 'closed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header with Real Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900 flex-shrink-0">
          {opportunity.imageUrl ? (
            <img
              src={opportunity.imageUrl}
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Content on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.country}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white uppercase font-bold tracking-wider">
                {opportunity.serviceType}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {opportunity.title}
            </h3>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* Status banner */}
          {isClosed ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong className="block font-bold">Applications Closed</strong>
                <span className="text-xs">Is opportunity ke liye applications abhi band hain. Anya vacancies ke liye website dekhein.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span className="font-bold text-xs sm:text-sm">Active Hiring - Accepting Applications</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Deadline: {opportunity.deadline || 'Open'}
              </span>
            </div>
          )}

          {/* Salary / Remuneration Card */}
          {opportunity.salary && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Offered Salary / Compensation
                </span>
                <p className="text-lg font-black text-slate-900">
                  {opportunity.salary}
                </p>
              </div>
            </div>
          )}

          {/* Facilities & Benefits */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-700">
              <Building className="w-4 h-4" />
              Facilities & Included Benefits
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed text-slate-700 text-xs sm:text-sm">
              {opportunity.facilities || 'Detailed information provided during consultation.'}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Eligibility Requirements (Patrata)
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed text-slate-700 text-xs sm:text-sm">
              {opportunity.eligibility || 'Check specific qualification and age requirements with our counselors.'}
            </div>
          </div>

          {/* Charges & Required Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/60">
              <h5 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Charges & Fees Policy
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                {opportunity.charges || 'Transparent breakdown of government visa and processing fees after initial screening.'}
              </p>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200/60">
              <h5 className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4 text-indigo-600" />
                Required Documents
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed">
                {opportunity.documentsRequired || 'Passport copy, recent photos, education and experience documents.'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-xs sm:text-sm"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onApply(opportunity);
            }}
            disabled={isClosed}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
              isClosed
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isClosed ? 'Applications Closed' : 'Apply Now for this Opportunity'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
