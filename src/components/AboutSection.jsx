import React, { useState } from 'react';
import { Compass, BookOpen, UserCheck, ShieldCheck, MapPin, Maximize2, X } from 'lucide-react';

export default function AboutSection({ onContactClick }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section id="about-section" className="section-container about-section-wrapper">
      {/* Lightbox for Business Card */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content animation-scale-in" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
              <X size={24} />
            </button>
            <img 
              src="/business-card.png" 
              alt="Mentor Universe Hardik Vvaidhya Business Card Fullscreen" 
              className="lightbox-image"
            />
            <p className="lightbox-caption">Hardik J Vvaidhya • Anand Center Contact Card</p>
          </div>
        </div>
      )}

      <div className="card about-main-card">
        <div className="about-grid">
          {/* Left Side: Brand Story */}
          <div className="about-text-content">
            <div className="section-title-wrapper border-gold">
              <Compass className="icon-gold animate-spin-slow" size={24} />
              <h2>About Mentor Universe</h2>
            </div>
            
            <p className="about-lead-text">
              Mentor Universe is a premier consultation hub specializing in <strong>Vastu Shastra</strong>, <strong>Indian & Lo Shu Grid Numerology</strong>, and <strong>Holistic Energy Guidance</strong>.
            </p>
            
            <p className="about-body-text">
              We bridge the sacred mathematical codes of the universe with structural environmental engineering to create absolute balance in your home, workplace, and personal destiny. By analyzing cosmic charts and earthly environments, our consultants offer simple, non-destructive, and highly practical remedies to dissolve obstacles in career, marriage, health, and finance.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <ShieldCheck size={18} className="text-gold" />
                <div>
                  <h4>Scientific Vastu Planning</h4>
                  <p className="text-xs text-muted">Aesthetic environmental corrections without structural damage.</p>
                </div>
              </div>
              <div className="feature-item">
                <UserCheck size={18} className="text-gold" />
                <div>
                  <h4>Lo Shu Grid Integrations</h4>
                  <p className="text-xs text-muted">Combining DOB analysis, missing element grids, and name vibrations.</p>
                </div>
              </div>
            </div>

            <div className="about-cta-row">
              <button onClick={onContactClick} className="btn btn-primary btn-cta">
                <span>Book Direct Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Side: Card Showcase & Centers */}
          <div className="about-showcase">
            <div className="business-card-container">
              <div className="card-badge">Anand Center Details</div>
              <img 
                src="/business-card.png" 
                alt="Hardik J Vvaidhya Vastu Numerology Consultant Card" 
                className="business-card-img" 
              />
              <button 
                onClick={() => setLightboxOpen(true)} 
                className="btn-maximize"
                title="Expand Business Card"
              >
                <Maximize2 size={16} />
                <span>Zoom Card</span>
              </button>
            </div>

            <div className="centers-display-row">
              {/* Anand */}
              <div className="center-card">
                <MapPin size={16} className="text-gold" />
                <div>
                  <h5>Anand Branch (HQ)</h5>
                  <p className="text-xs text-muted">Hardik J Vvaidhya</p>
                  <p className="text-xs text-muted">Bakrol-Vadtal Road, Anand</p>
                </div>
              </div>

              {/* Vadodara */}
              <div className="center-card">
                <MapPin size={16} className="text-purple" />
                <div>
                  <h5>Vadodara Branch</h5>
                  <p className="text-xs text-muted">Payal Trivedi</p>
                  <p className="text-xs text-muted">Consultation by Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
