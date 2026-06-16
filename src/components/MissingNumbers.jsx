import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { MISSING_TEMPLATES, TRANSLATIONS } from '../utils/constants';

export default function MissingNumbers({ gridCounts, language = 'English' }) {
  const activeLang = TRANSLATIONS[language] ? language : 'English';
  const labels = TRANSLATIONS[activeLang];

  // Find numbers 1-9 that have 0 occurrences
  const missing = Object.keys(MISSING_TEMPLATES)
    .map(Number)
    .filter((num) => (gridCounts[num] || 0) === 0);

  const getMissingBadgeText = (num) => {
    return labels.missingBadge.replace('{num}', num);
  };

  return (
    <div className="card result-card border-orange-hover animation-fade-in-up delay-300">
      <div className="card-header">
        <AlertCircle className="icon-orange" size={20} />
        <h2>{labels.missingTitle}</h2>
      </div>

      <div className="card-body">
        {missing.length === 0 ? (
          <div className="empty-state-success">
            <CheckCircle2 size={32} className="text-green animate-bounce" />
            <p>
              {language === 'Hindi' 
                ? 'अद्भुत! आपके लो शू चार्ट में कोई लुप्त अंक नहीं है। यह तत्वों की ऊर्जा का एक दुर्लभ, पूर्ण संतुलन है!'
                : language === 'Gujarati'
                ? 'અદ્ભુત! તમારા લો શૂ ચાર્ટમાં કોઈ લુપ્ત અંક નથી. આ તત્વોની ઊર્જાનું એક દુર્લભ, પૂર્ણ સંતુલન દર્શાવે છે!'
                : 'Wow! You have no missing numbers in your Lo Shu chart. This represents a rare, complete balance of elemental energies!'}
            </p>
          </div>
        ) : (
          <div className="missing-list">
            <p className="section-description text-sm text-muted">
              {labels.missingDesc}
            </p>
            {missing.map((num) => (
              <div key={num} className="missing-item">
                <div className="missing-number-badge">{num}</div>
                <div className="missing-item-content">
                  <h4>{getMissingBadgeText(num)}</h4>
                  <p className="text-sm">{MISSING_TEMPLATES[num]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
