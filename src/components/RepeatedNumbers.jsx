import React from 'react';
import { CopyPlus, Info } from 'lucide-react';
import { REPEATED_TEMPLATES, TRANSLATIONS } from '../utils/constants';

export default function RepeatedNumbers({ gridCounts, language = 'English' }) {
  const activeLang = TRANSLATIONS[language] ? language : 'English';
  const labels = TRANSLATIONS[activeLang];

  // Find numbers 1-9 that have 2 or more occurrences
  const repeated = Object.keys(REPEATED_TEMPLATES)
    .map(Number)
    .filter((num) => (gridCounts[num] || 0) >= 2)
    .map((num) => ({
      num,
      count: gridCounts[num]
    }));

  const getRepeatedBadgeText = (num, count) => {
    return labels.repeatedBadge.replace('{num}', num).replace('{count}', count);
  };

  const getRepeatedTimesText = (count) => {
    return labels.repeatedTimes.replace('{count}', count);
  };

  return (
    <div className="card result-card border-blue-hover animation-fade-in-up delay-300">
      <div className="card-header">
        <CopyPlus className="icon-blue" size={20} />
        <h2>{labels.repeatedTitle}</h2>
      </div>

      <div className="card-body">
        {repeated.length === 0 ? (
          <div className="empty-state-info">
            <Info size={32} className="text-blue" />
            <p>
              {language === 'Hindi'
                ? 'आपकी जन्म कुंडली में कोई भी अंक दोहराया नहीं गया है। प्रत्येक सक्रिय अंक ऊर्जा का एक अनूठा, स्थिर प्रवाह वहन करता है।'
                : language === 'Gujarati'
                ? 'તમારી જન્મકુંડળીમાં કોઈ પણ અંક પુનરાવર્તિત થયો નથી. દરેક સક્રિય અંક ઊર્જાનો એક અનન્ય, સ્થિર પ્રવાહ વહન કરે છે.'
                : 'No numbers are repeated in your birth chart. Every active number carries a singular, steady stream of energy.'}
            </p>
          </div>
        ) : (
          <div className="repeated-list">
            <p className="section-description text-sm text-muted">
              {labels.repeatedDesc}
            </p>
            {repeated.map(({ num, count }) => (
              <div key={num} className="repeated-item">
                <div className="repeated-header-row">
                  <div className="repeated-badge">
                    {getRepeatedBadgeText(num, count)}
                  </div>
                  <span className="repeated-count-tag text-xs text-muted">
                    {getRepeatedTimesText(count)}
                  </span>
                </div>
                <div className="repeated-item-content">
                  <p className="text-sm">{REPEATED_TEMPLATES[num]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
