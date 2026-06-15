import React from 'react';
import { Grid, HelpCircle } from 'lucide-react';

export default function LoShuGrid({ gridCounts, includeExtra, onToggle }) {
  // Classic Lo Shu Grid cell positions
  const gridLayout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

  return (
    <div className="card result-card loshu-card animation-fade-in-up delay-200">
      <div className="card-header justify-between">
        <div className="header-title-wrapper">
          <Grid className="icon-gold" size={20} />
          <h2>Lo Shu Grid (3×3)</h2>
        </div>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={includeExtra}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label text-sm">
            Include Moolank & Bhagyank
          </span>
        </div>
      </div>

      <div className="grid-instructions">
        <p className="text-sm text-muted">
          The Lo Shu grid is a 3x3 magic square. Numbers from your birth date map into specific cells, showing your elemental chart.
        </p>
      </div>

      <div className="loshu-grid-container">
        <div className="loshu-grid-outer">
          {gridLayout.map((row, rIdx) => (
            <div key={rIdx} className="loshu-row">
              {row.map((num) => {
                const count = gridCounts[num] || 0;
                const isMissing = count === 0;

                // Create array of repeated numbers
                const repeats = Array(count).fill(num).join(', ');

                return (
                  <div
                    key={num}
                    className={`loshu-cell ${isMissing ? 'cell-missing' : 'cell-active'}`}
                  >
                    <span className="cell-static-num">{num}</span>
                    {isMissing ? (
                      <span className="cell-missing-text">Missing</span>
                    ) : (
                      <span className="cell-active-repeats">{repeats}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-legend text-xs text-muted">
        <div><span className="legend-dot active"></span> Present in birth chart</div>
        <div><span className="legend-dot missing"></span> Missing energy</div>
      </div>
    </div>
  );
}
