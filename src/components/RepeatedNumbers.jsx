import React from 'react';
import { CopyPlus, Info } from 'lucide-react';
import { REPEATED_TEMPLATES } from '../utils/constants';

export default function RepeatedNumbers({ gridCounts }) {
  // Find numbers 1-9 that have 2 or more occurrences
  const repeated = Object.keys(REPEATED_TEMPLATES)
    .map(Number)
    .filter((num) => (gridCounts[num] || 0) >= 2)
    .map((num) => ({
      num,
      count: gridCounts[num]
    }));

  return (
    <div className="card result-card border-blue-hover animation-fade-in-up delay-300">
      <div className="card-header">
        <CopyPlus className="icon-blue" size={20} />
        <h2>Intensified Energies (Repeated Numbers)</h2>
      </div>

      <div className="card-body">
        {repeated.length === 0 ? (
          <div className="empty-state-info">
            <Info size={32} className="text-blue" />
            <p>No numbers are repeated in your birth chart. Every active number carries a singular, steady stream of energy.</p>
          </div>
        ) : (
          <div className="repeated-list">
            <p className="section-description text-sm text-muted">
              Repeated numbers amplify specific personality traits. They represent concentrated power, but can sometimes require conscious balancing.
            </p>
            {repeated.map(({ num, count }) => (
              <div key={num} className="repeated-item">
                <div className="repeated-header-row">
                  <div className="repeated-badge">
                    Number {num} × {count}
                  </div>
                  <span className="repeated-count-tag text-xs text-muted">
                    Appears {count} times
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
