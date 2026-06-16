import React from 'react';
import { Compass, ShieldAlert } from 'lucide-react';
import { calculateKua } from '../utils/numerology';
import { KUA_TEMPLATES, TRANSLATIONS } from '../utils/constants';

export default function KuaCard({ dob, gender, language = 'English' }) {
  const activeLang = TRANSLATIONS[language] ? language : 'English';
  const labels = TRANSLATIONS[activeLang];
  const kuaData = calculateKua(dob, gender);

  if (!kuaData) return null;

  const { kua, message } = kuaData;
  const isOther = gender === 'Other';

  const details = KUA_TEMPLATES[kua] || {
    direction: labels.genderNote,
    color: labels.genderNote,
    teaser: "Your Kua energy aligns with your birth year frequencies."
  };

  return (
    <div className="card result-card kua-card border-gold-hover animation-fade-in-up delay-400">
      <div className="card-header">
        <Compass className="icon-gold" size={20} />
        <h2>{labels.kuaCardTitle}</h2>
      </div>

      <div className="card-body">
        {isOther ? (
          <div className="kua-other-state">
            <ShieldAlert size={36} className="text-gold mb-2" />
            <h3>Special Note for Gender '{gender}'</h3>
            <p className="text-sm text-muted">
              {message} {labels.genderNote}
            </p>
          </div>
        ) : (
          <div className="kua-content">
            <div className="kua-header-row">
              <div className="kua-number-circle">
                <span className="kua-label">{labels.kuaLabel}</span>
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
                <span className="detail-label">{labels.luckyDirections}</span>
                <span className="detail-value text-sm">{details.direction}</span>
              </div>
              <div className="kua-detail-item">
                <span className="detail-label">{labels.luckyColors}</span>
                <span className="detail-value text-sm text-gold">{details.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
