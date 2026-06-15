import React from 'react';
import { Compass, Eye, ShieldAlert } from 'lucide-react';
import { calculateKua } from '../utils/numerology';
import { KUA_TEMPLATES } from '../utils/constants';

export default function KuaCard({ dob, gender }) {
  const kuaData = calculateKua(dob, gender);

  if (!kuaData) return null;

  const { kua, message } = kuaData;
  const isOther = gender === 'Other';

  const details = KUA_TEMPLATES[kua] || {
    direction: "Choose Male or Female to unlock traditional direction analysis.",
    color: "Traditional color therapy requires binary calculation.",
    teaser: "Your Kua energy aligns with your birth year frequencies."
  };

  return (
    <div className="card result-card kua-card border-gold-hover animation-fade-in-up delay-400">
      <div className="card-header">
        <Compass className="icon-gold" size={20} />
        <h2>Kua Number & Lucky Elements</h2>
      </div>

      <div className="card-body">
        {isOther ? (
          <div className="kua-other-state">
            <ShieldAlert size={36} className="text-gold mb-2" />
            <h3>Special Note for Gender '{gender}'</h3>
            <p className="text-sm text-muted">
              {message} Traditional Feng Shui numerology relies on a binary Yin/Yang calculation.
            </p>
          </div>
        ) : (
          <div className="kua-content">
            <div className="kua-header-row">
              <div className="kua-number-circle">
                <span className="kua-label">Kua</span>
                <span className="kua-digit">{kua}</span>
              </div>
              <div className="kua-teaser-wrapper">
                <p className="kua-teaser-text italic text-sm">
                  "{details.teaser}"
                </p>
              </div>
            </div>

            <div className="divider-glow"></div>

            <div className="kua-details-grid">
              <div className="kua-detail-item">
                <span className="detail-label">Lucky Directions</span>
                <span className="detail-value text-sm">{details.direction}</span>
              </div>
              <div className="kua-detail-item">
                <span className="detail-label">Lucky Color Therapy</span>
                <span className="detail-value text-sm text-gold">{details.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
