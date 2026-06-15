import React from 'react';
import { Award, Zap } from 'lucide-react';
import { PLANE_TEMPLATES } from '../utils/constants';
import { calculatePlanes } from '../utils/numerology';

export default function PlanesCard({ gridCounts }) {
  const { planes, strongestPlanes, maxPercent } = calculatePlanes(gridCounts);

  const getPlaneDisplayName = (key) => {
    return PLANE_TEMPLATES[key]?.name || key;
  };

  return (
    <div className="card result-card planes-card animation-fade-in-up delay-400">
      <div className="card-header justify-between">
        <div className="header-title-wrapper">
          <Zap className="icon-gold" size={20} />
          <h2>Lo Shu Planes (Yogas)</h2>
        </div>
      </div>

      <div className="card-body">
        {/* Strongest Plane Highlight */}
        {strongestPlanes.length > 0 && maxPercent > 0 ? (
          <div className="strongest-plane-alert glow-gold-border">
            <Award className="icon-gold animate-bounce" size={24} />
            <div className="strongest-plane-content">
              <h3>Strongest Life Energy: {maxPercent}%</h3>
              <p>
                Your most active and influential grid path: {' '}
                <strong>
                  {strongestPlanes.map(key => getPlaneDisplayName(key).split(' (')[0]).join(' & ')}
                </strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="strongest-plane-alert muted-border">
            <Zap className="text-muted" size={24} />
            <div className="strongest-plane-content">
              <h3>Dormant Energies</h3>
              <p>Your plane energies are in a quiet phase. Focus on grounding and activating routine structure.</p>
            </div>
          </div>
        )}

        <div className="planes-grid">
          {Object.entries(planes).map(([key, data]) => {
            const template = PLANE_TEMPLATES[key];
            if (!template) return null;

            // Determine bar color based on percentage
            let progressColorClass = 'bar-low';
            if (data.percentage === 33) progressColorClass = 'bar-medium-low';
            if (data.percentage === 66) progressColorClass = 'bar-medium-high';
            if (data.percentage === 100) progressColorClass = 'bar-full';

            return (
              <div key={key} className="plane-item">
                <div className="plane-meta">
                  <span className="plane-name font-semibold">{template.name}</span>
                  <span className="plane-numbers text-xs text-gold font-mono">
                    [{template.numbers.join(', ')}]
                  </span>
                </div>

                <div className="progress-track-wrapper">
                  <div className="progress-track">
                    <div
                      className={`progress-bar-fill ${progressColorClass}`}
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                    {/* Ticks for 33%, 66% */}
                    <div className="progress-tick tick-33" title="33%"></div>
                    <div className="progress-tick tick-66" title="66%"></div>
                  </div>
                  <span className="progress-percent text-xs font-semibold">
                    {data.percentage}%
                  </span>
                </div>

                <p className="plane-desc text-xs text-muted">
                  {template.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
