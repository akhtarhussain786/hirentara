import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Upload, FileText, Check, Phone, MessageSquare, MapPin } from 'lucide-react';

export default function ApplicationForm({
  selectedOpportunity,
  opportunities,
  onClose,
  onSubmitted
}) {
  const [formData, setFormData] = useState({
    opportunityId: '',
    serviceType: 'Overseas Jobs',
    country: 'UAE (Dubai)',
    opportunityTitle: '',
    fullName: '',
    mobile: '',
    whatsapp: '',
    district: '',
    state: '',
    qualification: '',
    experience: '',
    passportStatus: 'Yes',
    message: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successResult, setSuccessResult] = useState(null);

  // Pre-fill if opened from a specific opportunity
  useEffect(() => {
    if (selectedOpportunity) {
      setFormData(prev => ({
        ...prev,
        opportunityId: selectedOpportunity.id || '',
        opportunityTitle: selectedOpportunity.title || '',
        serviceType: selectedOpportunity.serviceType || 'Overseas Jobs',
        country: selectedOpportunity.country || ''
      }));
    }
  }, [selectedOpportunity]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Poora naam bharna zaroori hai.';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number bharna zaroori hai.';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.trim().replace(/\D/g, '').slice(-10))) {
      errs.mobile = 'Kripya 10-digit valid mobile number darj karein.';
    }
    if (!formData.district.trim()) errs.district = 'District (Zila) bharna zaroori hai.';
    if (!formData.state.trim()) errs.state = 'State (Rajya) bharna zaroori hai.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleOpportunityChange = (e) => {
    const oppId = e.target.value;
    const found = opportunities.find(o => o.id === oppId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        opportunityId: found.id,
        opportunityTitle: found.title,
        serviceType: found.serviceType,
        country: found.country
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        opportunityId: '',
        opportunityTitle: 'General Overseas Inquiry',
        serviceType: 'Overseas Jobs',
        country: 'General'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      if (resumeFile) {
        payload.append('resume', resumeFile);
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: payload
      });
      const data = await res.json();

      if (data.success) {
        setSuccessResult({
          applicationId: data.applicationId,
          message: data.message || 'Application receive ho gayi hai.'
        });
        if (onSubmitted) onSubmitted(data.applicationId);
      } else {
        setErrors({ general: data.message || 'Kuch gadbad hui, kripya dobara koshish karein.' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Server se connect nahi ho paya. Kripya thoda baad koshish karein.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Application & Enquiry Form
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Sabhi services aur overseas jobs ke liye ek common aasan form
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Success State */}
        <div className="p-6 overflow-y-auto">
          {successResult ? (
            /* Success confirmation screen as described in Page 2 of brief */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Submission Successful
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-3">
                  Aapki Application Receive Ho Gayi Hai!
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  {successResult.message}
                </p>
              </div>

              {/* Unique Application ID Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 max-w-md mx-auto shadow-sm">
                <p className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">
                  Aapki Unique Application ID:
                </p>
                <div className="text-2xl sm:text-3xl font-black text-blue-900 tracking-wider mt-1 select-all font-mono">
                  {successResult.applicationId}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Kripya is ID ko note kar lein. Hamari team aapse isi reference par contact karegi.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                >
                  Done (Home Page Par Jayein)
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              
              {errors.general && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Opportunity / Service Selection */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Service / Job Opportunity
                </label>
                <select
                  value={formData.opportunityId}
                  onChange={handleOpportunityChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- General Overseas Service / Any Opportunity --</option>
                  {opportunities.filter(opp => opp.status !== 'closed').map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.country} - {opp.serviceType})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Selected Service</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      <option value="Overseas Jobs">Overseas Jobs</option>
                      <option value="Visa Assistance">Visa Assistance</option>
                      <option value="Documents Assistance">Documents Assistance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. UAE (Dubai), Poland"
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information: Naam & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Poora Naam (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Apna poora naam darj karein"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.mobile ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Optional WhatsApp & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp No. <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Agar alag hai to likhein"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District (Zila) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Gorakhpur / Patna"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.district ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.district && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State (Rajya) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Uttar Pradesh / Bihar"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Qualification + Skill + Experience (Job applications me dikhenge) */}
              {formData.serviceType === 'Overseas Jobs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g. 10th / 12th / ITI / Graduate"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Skill & Work Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. Fresher ya 2 saal hotel/driver/electrician"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Passport Status (Simple Yes / No as requested in brief) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Kya aapke paas valid Passport hai? <span className="text-slate-400 font-normal">(Passport copy upload abhi zaroori nahi hai)</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                      formData.passportStatus === 'Yes'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="passportStatus"
                      value="Yes"
                      checked={formData.passportStatus === 'Yes'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Check className={`w-4 h-4 ${formData.passportStatus === 'Yes' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>Haan, Passport Hai (Yes)</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                      formData.passportStatus === 'No'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="passportStatus"
                      value="No"
                      checked={formData.passportStatus === 'No'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <X className={`w-4 h-4 ${formData.passportStatus === 'No' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>Nahi, Abhi Banana Hai (No)</span>
                  </label>
                </div>
              </div>

              {/* Optional Resume Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume / Biodata Upload <span className="text-slate-400 font-normal">(Optional - PDF, Word ya Photo)</span>
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-slate-300 border-dashed rounded-2xl hover:border-blue-400 transition-colors bg-slate-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-7 w-7 text-slate-400" />
                    <div className="flex text-xs text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent font-bold text-blue-600 hover:text-blue-500">
                        <span>{resumeFile ? resumeFile.name : 'File select karein ya drag karein'}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => setResumeFile(e.target.files[0] || null)}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400">PDF, DOC, DOCX, JPG tak (Max 10MB)</p>
                  </div>
                </div>
              </div>

              {/* Message / Requirement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aapka Sandesh ya Khas Jarurat <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="message"
                  rows="2"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Videsh jane ke regarding koi sawal ya specific country requirement..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Application Submit Karein</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

