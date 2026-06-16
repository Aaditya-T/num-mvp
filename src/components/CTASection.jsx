import React from 'react';
import { Compass, MessageSquare, Download, Calendar } from 'lucide-react';

export default function CTASection({ onContactClick, onDownloadClick }) {
  return (
    <div className="card cta-card glow-gold-border animation-fade-in-up delay-500 hide-on-print">
      <div className="cta-gradient-overlay"></div>
      
      <div className="cta-content">
        <div className="logo-badge mb-2">
          <Compass className="icon-gold animate-spin-slow" size={14} />
          <span>Detailed Consultation</span>
        </div>
        <h2>Unlock Your Comprehensive Vastu & Numerology Audit</h2>
        <p className="cta-desc">
          Vedic blueprints only tell part of the story. Receive tailored guidance on commercial layout zoning, residential Vastu corrections (without structural demolition), business name signature alignment, mobile number vibrations, and yearly remedial charts.
        </p>

        <div className="cta-actions">
          <button onClick={onContactClick} className="btn btn-primary btn-cta">
            <Calendar size={18} />
            <span>Connect With Experts</span>
          </button>

          <button onClick={onContactClick} className="btn btn-secondary btn-cta btn-whatsapp-dummy">
            <MessageSquare size={18} />
            <span>Chat on WhatsApp</span>
          </button>

          <button onClick={onDownloadClick} className="btn btn-secondary btn-cta">
            <Download size={18} />
            <span>Download PDF Report</span>
          </button>
        </div>

        <div className="cta-footer-info text-xs text-muted">
          <span>* Dedicated virtual and in-person consultations.</span>
          <span>• Direct routing to Anand (Hardik J Vvaidhya) or Vadodara (Payal Trivedi) centers.</span>
        </div>
      </div>
    </div>
  );
}
