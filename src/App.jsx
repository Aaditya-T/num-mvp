import React, { useState } from 'react';
import { Sparkles, Printer, Copy, RotateCcw, Compass, AlertCircle, Phone, ArrowUp } from 'lucide-react';
import Form from './components/Form';
import NumberCard from './components/NumberCard';
import LoShuGrid from './components/LoShuGrid';
import MissingNumbers from './components/MissingNumbers';
import RepeatedNumbers from './components/RepeatedNumbers';
import PlanesCard from './components/PlanesCard';
import KuaCard from './components/KuaCard';
import CTASection from './components/CTASection';
import AboutSection from './components/AboutSection';
import ContactModal from './components/ContactModal';
import { calculateMoolank, calculateBhagyank, calculateLoShuGrid, calculateKua, calculatePlanes } from './utils/numerology';
import { PLANETS, KUA_TEMPLATES, PLANE_TEMPLATES } from './utils/constants';

export default function App() {
  const [formData, setFormData] = useState(null);
  const [includeExtra, setIncludeExtra] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleFormSubmit = (data) => {
    setFormData(data);
    
    // Calculate metrics dynamically to send to Google Sheets
    const moolankVal = calculateMoolank(data.dob);
    const bhagyankVal = calculateBhagyank(data.dob);
    const kuaValObj = calculateKua(data.dob, data.gender);
    const kuaNumber = kuaValObj ? kuaValObj.kua : "";

    // Compile the payload
    const payload = {
      name: data.name,
      dob: data.dob,
      gender: data.gender,
      mobile: data.mobile || "",
      language: data.language,
      moolank: moolankVal,
      bhagyank: bhagyankVal,
      kua: kuaNumber
    };

    // Send data asynchronously in background to Google Sheets Web App
    fetch("https://script.google.com/macros/s/AKfycbwbUK-gS5N-JgYTtR_8tDGFjPrmlxTclVpHv6gPNFmAWsVdERMbq-NbUzPy4fMYTRLayw/exec", {
      method: "POST",
      mode: "no-cors", // Crucial for CORS preflights on Apps Script
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      console.log("Lead captured in Google Sheets.");
    })
    .catch((err) => {
      console.error("Error capturing lead in Sheets:", err);
    });

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

    const summaryText = `🔮 *Mentor Universe: Numerology Insight Report* 🔮
-----------------------------------
👤 Client Name: ${formData.name}
📅 Date of Birth: ${formData.dob}
👤 Gender: ${formData.gender}
📞 Mobile: ${formData.mobile || ''}
✨ *Vedic Metrics:*
• Moolank (Birth Number): ${moolank} (Ruling Planet: ${moolankPlanet})
• Bhagyank (Destiny Number): ${bhagyank} (Ruling Planet: ${bhagyankPlanet})
${kuaResult && kuaResult.kua ? `• Kua Number: ${kuaResult.kua}\n` : ''}
🧭 *Lucky Elements:*
• Lucky Directions: ${luckyDir}
• Lucky Colors: ${luckyCol}

⚡ *Lo Shu Grid Energy:*
• Strongest Energy: ${strongestEnergy} (${planesData?.maxPercent || 0}%)

-----------------------------------
🔮 *Consultation Details* 🔮
🏢 Mentor Universe (Vastu | Numerology | Energy Guidance)
📍 Anand Center: Hardik J Vvaidhya (+91 95125 07831, +91 95378 36955)
📍 Vadodara Center: Payal Trivedi (+91 96870 62789)
✉️ Email: shivastro37@gmail.com
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

      {/* Brand Navigation Bar */}
      <nav className="brand-navbar hide-on-print">
        <div className="navbar-container">
          <div className="nav-logo-group" onClick={handleReset}>
            <img src="/logo.png" alt="Mentor Universe Logo" className="nav-logo-img" />
            <div className="nav-brand-meta">
              <span className="brand-title">Mentor Universe</span>
              <span className="brand-slogan">Vastu • Numerology • Energy</span>
            </div>
          </div>
          <div className="nav-links">
            <button 
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="nav-link-item"
            >
              Calculator
            </button>
            <button 
              onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="nav-link-item"
            >
              About Experts
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="nav-link-item btn-contact-nav"
            >
              <Phone size={14} />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Header / Hero Section */}
      <header className="hero-section hide-on-print">
        <div className="stars-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo-wrapper animation-fade-in-up">
            <img src="/logo.png" alt="Mentor Universe Golden Emblem" className="hero-logo-large" />
          </div>
          <div className="logo-badge animation-fade-in-up delay-100">
            <Sparkles className="icon-gold animate-spin-slow" size={14} />
            <span>Vastu | Numerology | Energy Guidance</span>
          </div>
          <h1 className="hero-title animation-fade-in-up delay-100">Discover Your Numerology Blueprint</h1>
          <p className="hero-subtitle animation-fade-in-up delay-200">
            Align your personal grid energies and architectural spaces under the guidance of certified Vedic professionals. Get your free snapshot report instantly.
          </p>
          <div className="hero-actions animation-fade-in-up delay-300">
            <button
              onClick={() => {
                document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary hero-cta"
            >
              <span>Get My Free Reading</span>
              <Sparkles size={16} />
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className="btn btn-secondary hero-cta-sec"
            >
              <span>Speak to Consultants</span>
            </button>
          </div>
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

        {/* About Mentor Universe Section (Always Visible on Screen) */}
        <div className="hide-on-print">
          <AboutSection onContactClick={() => setIsContactOpen(true)} />
        </div>

        {/* Result Dashboard Section */}
        {formData && (
          <section id="results-section" className="results-container">
            {/* Printable Report Header */}
            <div className="print-only-header">
              <div className="print-logo-row">
                <img src="/logo.png" alt="Mentor Universe Print Logo" className="print-logo-img" />
                <div className="print-logo-text">
                  <h2>Mentor Universe</h2>
                  <p>Vastu | Numerology | Energy Guidance</p>
                </div>
              </div>
              <div className="print-report-title">Personalized Numerology Report</div>
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
            <NumberCard moolank={moolank} bhagyank={bhagyank} language={formData.language} />

            {/* Grid & Element Section */}
            <div className="grid-2-col-equal print-no-gap">
              {/* B. Lo Shu Grid Card */}
              <LoShuGrid
                gridCounts={gridCounts}
                includeExtra={includeExtra}
                onToggle={setIncludeExtra}
                language={formData.language}
              />

              {/* F. Kua Number Card */}
              <KuaCard dob={formData.dob} gender={formData.gender} language={formData.language} />
            </div>

            {/* C & D. Missing & Repeated Numbers Section */}
            <div className="grid-2-col-equal print-no-gap">
              <MissingNumbers gridCounts={gridCounts} language={formData.language} />
              <RepeatedNumbers gridCounts={gridCounts} language={formData.language} />
            </div>

            {/* E. Lo Shu Planes / Yogas Card */}
            <PlanesCard gridCounts={gridCounts} language={formData.language} />

            {/* G. CTA / Lead Section */}
            <CTASection onContactClick={() => setIsContactOpen(true)} onDownloadClick={handlePrint} />
          </section>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="app-footer hide-on-print">
        <div className="footer-content">
          <div className="footer-logo-row">
            <img src="/logo.png" alt="Mentor Universe Logo Small" className="footer-logo-img" />
            <h3>Mentor Universe</h3>
          </div>
          <p className="footer-address-info text-xs">
            <strong>Anand Head Office:</strong> 06, Moon, First Floor, Aatmiya Empire, Bakrol-Vadtal Road, Bakrol, Anand. | Phone: +91 95125 07831 / +91 95378 36955<br />
            <strong>Vadodara Center:</strong> Payal Trivedi | Phone: +91 96870 62789 (By Appointment Only)
          </p>
          <div className="divider-glow"></div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Mentor Universe. All Rights Reserved. Built for Spiritual & Spatial Alignment.
          </div>
        </div>
      </footer>

      {/* Floating Contact Trigger (Screen only, visible when scrolled down) */}
      <button 
        onClick={() => setIsContactOpen(true)} 
        className="floating-contact-btn hide-on-print" 
        title="Contact Consultants"
      >
        <Phone size={20} />
      </button>

      {/* Interactive Contact Popup Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
