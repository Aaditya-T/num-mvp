import React, { useState, useEffect } from 'react';
import { Sparkles, Printer, Copy, RotateCcw, Compass, Calendar, Moon, Sun, AlertCircle } from 'lucide-react';
import Form from './components/Form';
import NumberCard from './components/NumberCard';
import LoShuGrid from './components/LoShuGrid';
import MissingNumbers from './components/MissingNumbers';
import RepeatedNumbers from './components/RepeatedNumbers';
import PlanesCard from './components/PlanesCard';
import KuaCard from './components/KuaCard';
import CTASection from './components/CTASection';
import { calculateMoolank, calculateBhagyank, calculateLoShuGrid, calculateKua, calculatePlanes } from './utils/numerology';
import { PLANETS, KUA_TEMPLATES, PLANE_TEMPLATES } from './utils/constants';

export default function App() {
  const [formData, setFormData] = useState(null);
  const [includeExtra, setIncludeExtra] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const handleFormSubmit = (data) => {
    setFormData(data);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleReset = () => {
    setFormData(null);
    setIncludeExtra(true);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform calculations based on state
  const moolank = formData ? calculateMoolank(formData.dob) : 0;
  const bhagyank = formData ? calculateBhagyank(formData.dob) : 0;
  const gridCounts = formData ? calculateLoShuGrid(formData.dob, includeExtra, moolank, bhagyank) : {};
  const kuaResult = formData ? calculateKua(formData.dob, formData.gender) : null;
  const planesData = formData ? calculatePlanes(gridCounts) : null;

  const handleCopySummary = () => {
    if (!formData) return;

    const moolankPlanet = PLANETS[moolank]?.split(' (')[0] || '';
    const bhagyankPlanet = PLANETS[bhagyank]?.split(' (')[0] || '';

    // Determine lucky elements for summary
    let luckyDir = 'Choose Male/Female';
    let luckyCol = 'Choose Male/Female';
    if (kuaResult && kuaResult.kua) {
      const kuaNum = kuaResult.kua;
      luckyDir = KUA_TEMPLATES[kuaNum]?.direction || '';
      luckyCol = KUA_TEMPLATES[kuaNum]?.color || '';
    }

    // Determine strongest planes
    let strongestEnergy = 'None';
    if (planesData && planesData.strongestPlanes.length > 0 && planesData.maxPercent > 0) {
      strongestEnergy = planesData.strongestPlanes
        .map(key => PLANE_TEMPLATES[key]?.name.split(' (')[0])
        .join(' & ');
    }

    const summaryText = `🔮 *Numerology Insight Report* 🔮
-----------------------------------
👤 Name: ${formData.name}
📅 Date of Birth: ${formData.dob}
👤 Gender: ${formData.gender}
${formData.mobile ? `📞 Mobile: ${formData.mobile}\n` : ''}
✨ *Vedic Metrics:*
• Moolank (Birth Number): ${moolank} (Ruling Planet: ${moolankPlanet})
• Bhagyank (Destiny Number): ${bhagyank} (Ruling Planet: ${bhagyankPlanet})
${kuaResult && kuaResult.kua ? `• Kua Number: ${kuaResult.kua}\n` : ''}
🧭 *Lucky Elements:*
• Lucky Directions: ${luckyDir}
• Lucky Colors: ${luckyCol}

⚡ *Lo Shu Grid Energy:*
• Strongest Energy: ${strongestEnergy} (${planesData?.maxPercent || 0}%)

Generated on Numerology Insight Calculator. Get your full reading today!
-----------------------------------`;

    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setToastMessage('🔮 Summary copied to clipboard!');
        setTimeout(() => setToastMessage(''), 3000);
      })
      .catch(() => {
        setToastMessage('⚠️ Failed to copy summary.');
        setTimeout(() => setToastMessage(''), 3000);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animation-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header / Hero Section */}
      <header className="hero-section hide-on-print">
        <div className="stars-overlay"></div>
        <div className="hero-content">
          <div className="logo-badge">
            <Sparkles className="icon-gold animate-spin-slow" size={16} />
            <span>Vedic & Lo Shu Grid MVP</span>
          </div>
          <h1 className="hero-title">Discover Your Numerology Blueprint</h1>
          <p className="hero-subtitle">
            Get a free snapshot of your birth number, destiny number, Lo Shu grid, missing numbers, and life energies.
          </p>
          <button
            onClick={() => {
              document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-primary hero-cta"
          >
            <span>Get My Free Reading</span>
            <Sparkles size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Form Section */}
        <section id="form-section" className="section-container form-section-wrapper hide-on-print">
          {!formData ? (
            <Form onSubmit={handleFormSubmit} />
          ) : (
            <div className="card reset-prompt-card">
              <h3>Reading Active for <span className="text-gold">{formData.name}</span></h3>
              <p className="text-sm text-muted">Scroll down to view reports, or restart with a different birth chart.</p>
              <div className="reset-prompt-actions">
                <button onClick={handleReset} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} />
                  <span>Reset / New DOB</span>
                </button>
                <button onClick={handleCopySummary} className="btn btn-primary btn-sm btn-gold-outline">
                  <Copy size={14} />
                  <span>Copy Summary</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Result Dashboard Section */}
        {formData && (
          <section id="results-section" className="results-container">
            {/* Printable Report Header */}
            <div className="print-only-header">
              <div className="print-logo">
                <h2>🔮 Numerology Insight Report</h2>
                <div className="print-date">Generated on: {new Date().toLocaleDateString()}</div>
              </div>
              <div className="print-meta-grid">
                <div><strong>Client Name:</strong> {formData.name}</div>
                <div><strong>Date of Birth:</strong> {formData.dob}</div>
                <div><strong>Gender:</strong> {formData.gender}</div>
                {formData.mobile && <div><strong>Mobile:</strong> {formData.mobile}</div>}
              </div>
            </div>

            {/* Results Action Panel */}
            <div className="results-action-panel hide-on-print">
              <div className="actions-title">
                <h3>Your Personalized Analysis Dashboard</h3>
                <p className="text-xs text-muted">Copy a text report to share, or print/save a PDF file.</p>
              </div>
              <div className="action-buttons">
                <button onClick={handleCopySummary} className="btn btn-secondary btn-action-icon" title="Copy Text Summary">
                  <Copy size={16} />
                  <span>Copy Summary</span>
                </button>
                <button onClick={handlePrint} className="btn btn-secondary btn-action-icon" title="Print / Save PDF">
                  <Printer size={16} />
                  <span>Print Report</span>
                </button>
                <button onClick={handleReset} className="btn btn-danger btn-action-icon" title="Reset and enter new date">
                  <RotateCcw size={16} />
                  <span>Reset Chart</span>
                </button>
              </div>
            </div>

            {/* A. Basic Numerology Card */}
            <NumberCard moolank={moolank} bhagyank={bhagyank} />

            {/* Grid & Element Section */}
            <div className="grid-2-col-equal print-no-gap">
              {/* B. Lo Shu Grid Card */}
              <LoShuGrid
                gridCounts={gridCounts}
                includeExtra={includeExtra}
                onToggle={setIncludeExtra}
              />

              {/* F. Kua Number Card */}
              <KuaCard dob={formData.dob} gender={formData.gender} />
            </div>

            {/* C & D. Missing & Repeated Numbers Section */}
            <div className="grid-2-col-equal print-no-gap">
              <MissingNumbers gridCounts={gridCounts} />
              <RepeatedNumbers gridCounts={gridCounts} />
            </div>

            {/* E. Lo Shu Planes / Yogas Card */}
            <PlanesCard gridCounts={gridCounts} />

            {/* G. CTA / Lead Section */}
            <CTASection />
          </section>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="disclaimer-title">
            <AlertCircle size={14} className="icon-gold inline" /> Content Disclaimer
          </p>
          <p className="disclaimer-text">
            This numerology reading is for spiritual, self-reflection, and entertainment purposes only. It should not be treated as medical, financial, legal, or professional advice. Predictions are based on static calculations and interpretations.
          </p>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Numerology Insight Calculator MVP. Built for Spiritual Alignment.
          </div>
        </div>
      </footer>
    </div>
  );
}
