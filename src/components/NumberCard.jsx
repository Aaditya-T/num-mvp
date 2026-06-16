import React from 'react';
import { Shield, Sparkles, Star } from 'lucide-react';
import { PLANETS_TRANSLATIONS, TRANSLATIONS, MOOLANK_TEMPLATES, BHAGYANK_TEMPLATES } from '../utils/constants';

export default function NumberCard({ moolank, bhagyank, language = 'English' }) {
  const activeLang = TRANSLATIONS[language] ? language : 'English';
  const labels = TRANSLATIONS[activeLang];
  const planetsDict = PLANETS_TRANSLATIONS[activeLang];

  const moolankPlanet = planetsDict[moolank] || PLANETS_TRANSLATIONS.English[moolank] || 'Unknown';
  const bhagyankPlanet = planetsDict[bhagyank] || PLANETS_TRANSLATIONS.English[bhagyank] || 'Unknown';

  const moolankTeaser = MOOLANK_TEMPLATES[moolank] || 'Your birth number holds unique spiritual guides.';
  const bhagyankTeaser = BHAGYANK_TEMPLATES[bhagyank] || 'Your destiny path is unfolding.';

  return (
    <div className="result-section-container">
      <div className="section-title-wrapper">
        <Star size={20} className="icon-gold" />
        <h2>{labels.vedicAnalysis}</h2>
      </div>

      <div className="grid-2-col">
        {/* Moolank Card */}
        <div className="card result-card border-gold-hover animation-fade-in-up">
          <div className="badge gold-badge">{labels.birthNumber}</div>
          <div className="number-display-wrapper">
            <span className="number-label">{labels.moolank}</span>
            <div className="huge-number text-gold">{moolank}</div>
          </div>
          <div className="divider-glow"></div>
          <div className="card-body">
            <h4 className="planet-title">
              <Shield size={16} className="text-gold" /> {labels.rulingPlanet}: {moolankPlanet}
            </h4>
            <p className="interpretation-text">{moolankTeaser}</p>
          </div>
        </div>

        {/* Bhagyank Card */}
        <div className="card result-card border-purple-hover animation-fade-in-up delay-100">
          <div className="badge purple-badge">{labels.destinyNumber}</div>
          <div className="number-display-wrapper">
            <span className="number-label">{labels.bhagyank}</span>
            <div className="huge-number text-purple">{bhagyank}</div>
          </div>
          <div className="divider-glow"></div>
          <div className="card-body">
            <h4 className="planet-title">
              <Sparkles size={16} className="text-purple" /> {labels.rulingPlanet}: {bhagyankPlanet}
            </h4>
            <p className="interpretation-text">{bhagyankTeaser}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
