import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { MISSING_TEMPLATES } from '../utils/constants';

export default function MissingNumbers({ gridCounts }) {
  // Find numbers 1-9 that have 0 occurrences
  const missing = Object.keys(MISSING_TEMPLATES)
    .map(Number)
    .filter((num) => (gridCounts[num] || 0) === 0);

  return (
    <div className="card result-card border-orange-hover animation-fade-in-up delay-300">
      <div className="card-header">
        <AlertCircle className="icon-orange" size={20} />
        <h2>Missing Energies (Lupta Ank)</h2>
      </div>

      <div className="card-body">
        {missing.length === 0 ? (
          <div className="empty-state-success">
            <CheckCircle2 size={32} className="text-green animate-bounce" />
            <p>Wow! You have no missing numbers in your Lo Shu chart. This represents a rare, complete balance of elemental energies!</p>
          </div>
        ) : (
          <div className="missing-list">
            <p className="section-description text-sm text-muted">
              Missing numbers point to lessons or areas of life that require conscious focus, effort, and remedies to balance.
            </p>
            {missing.map((num) => (
              <div key={num} className="missing-item">
                <div className="missing-number-badge">{num}</div>
                <div className="missing-item-content">
                  <h4>Number {num} Energy is Missing</h4>
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
