import React from 'react';
import { Shield, Sparkles, Star } from 'lucide-react';
import { PLANETS, MOOLANK_TEMPLATES, BHAGYANK_TEMPLATES } from '../utils/constants';

export default function NumberCard({ moolank, bhagyank }) {
  const moolankPlanet = PLANETS[moolank] || 'Unknown';
  const bhagyankPlanet = PLANETS[bhagyank] || 'Unknown';

  const moolankTeaser = MOOLANK_TEMPLATES[moolank] || 'Your birth number holds unique spiritual guides.';
  const bhagyankTeaser = BHAGYANK_TEMPLATES[bhagyank] || 'Your destiny path is unfolding.';

  return (
    <div className="result-section-container">
      <div className="section-title-wrapper">
        <Star size={20} className="icon-gold" />
        <h2>Vedic Numerology Analysis</h2>
      </div>

      <div className="grid-2-col">
        {/* Moolank Card */}
        <div className="card result-card border-gold-hover animation-fade-in-up">
          <div className="badge gold-badge">Birth Number</div>
          <div className="number-display-wrapper">
            <span className="number-label">Moolank</span>
            <div className="huge-number text-gold">{moolank}</div>
          </div>
          <div className="divider-glow"></div>
          <div className="card-body">
            <h4 className="planet-title">
              <Shield size={16} className="text-gold" /> Ruling Planet: {moolankPlanet}
            </h4>
            <p className="interpretation-text">{moolankTeaser}</p>
          </div>
        </div>

        {/* Bhagyank Card */}
        <div className="card result-card border-purple-hover animation-fade-in-up delay-100">
          <div className="badge purple-badge">Destiny Number</div>
          <div className="number-display-wrapper">
            <span className="number-label">Bhagyank</span>
            <div className="huge-number text-purple">{bhagyank}</div>
          </div>
          <div className="divider-glow"></div>
          <div className="card-body">
            <h4 className="planet-title">
              <Sparkles size={16} className="text-purple" /> Ruling Planet: {bhagyankPlanet}
            </h4>
            <p className="interpretation-text">{bhagyankTeaser}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
