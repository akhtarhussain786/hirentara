import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NoticeStrip from './components/NoticeStrip';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import OpportunitiesSection from './components/OpportunitiesSection';
import OpportunityModal from './components/OpportunityModal';
import ApplicationForm from './components/ApplicationForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [notices, setNotices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state for services/opportunities
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals & Active Views
  const [detailsOpp, setDetailsOpp] = useState(null);
  const [applyOpp, setApplyOpp] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentView, setCurrentView] = useState('public');

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [noticesRes, oppsRes] = await Promise.all([
        fetch('/api/notices'),
        fetch('/api/opportunities')
      ]);
      const noticesData = await noticesRes.json();
      const oppsData = await oppsRes.json();

      if (noticesData.success) setNotices(noticesData.data);
      if (oppsData.success) setOpportunities(oppsData.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When clicking a notice in NoticeStrip
  const handleSelectOpportunityById = (oppId) => {
    const found = opportunities.find((o) => o.id === oppId);
    if (found) {
      setDetailsOpp(found);
    } else {
      // If no direct ID match, open general apply form
      setApplyOpp(null);
      setIsApplyModalOpen(true);
    }
  };

  // Open Apply modal for specific opportunity or general
  const handleOpenApply = (opportunity = null) => {
    setApplyOpp(opportunity);
    setIsApplyModalOpen(true);
  };

  // Scroll to opportunities and set category
  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    const el = document.getElementById('opportunities');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. Rotating Notice Strip */}
      <NoticeStrip
        notices={notices}
        onSelectOpportunityById={handleSelectOpportunityById}
      />

      {/* 2. Top Header / Navigation */}
      <Header
        onOpenApply={() => handleOpenApply(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 3. Hero Banner with 3-Step Visitor Safar */}
        <Hero
          onExplore={() => {
            const el = document.getElementById('opportunities');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onApply={() => handleOpenApply(null)}
        />

        {/* 4. Three Core Services Cards */}
        <ServicesSection
          onSelectCategory={handleSelectCategory}
          onApplyForService={(serviceType) => {
            handleOpenApply({
              id: '',
              title: `${serviceType} Application`,
              serviceType: serviceType,
              country: 'Any / Multiple'
            });
          }}
        />

        {/* 5. Opportunities & Services Grid */}
        <OpportunitiesSection
          opportunities={opportunities}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onViewDetails={(opp) => setDetailsOpp(opp)}
          onApply={(opp) => handleOpenApply(opp)}
        />

      </main>

      {/* 6. Footer with Address, Call, WhatsApp Buttons */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Reusable Details Page / Modal */}
      {detailsOpp && (
        <OpportunityModal
          opportunity={detailsOpp}
          onClose={() => setDetailsOpp(null)}
          onApply={(opp) => handleOpenApply(opp)}
        />
      )}

      {/* Reusable Common Application Form */}
      {isApplyModalOpen && (
        <ApplicationForm
          selectedOpportunity={applyOpp}
          opportunities={opportunities}
          onClose={() => {
            setIsApplyModalOpen(false);
            setApplyOpp(null);
          }}
          onSubmitted={(appId) => {
            // Refresh notices or data if needed
            fetchData();
          }}
        />
      )}

      {/* Admin Control Panel Overlay */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            fetchData(); // Refresh opportunities and notices after admin changes
          }}
        />
      )}

    </div>
  );
}

