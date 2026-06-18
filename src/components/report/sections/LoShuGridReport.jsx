import React from 'react';
import EditableText from '../editables/EditableText';
import { useEdit } from '../EditContext';

export default function LoShuGridReport({ gridCounts, t, lang }) {
  const { isEditMode, getOverride } = useEdit();

  // Traditional Lo Shu Grid positions
  const gridPositions = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

  const labels = {
    English: {
      number: "Number",
      freq: "Frequency",
      status: "Status",
      times: "times",
      present: "✓ Present",
      missing: "✗ Missing"
    },
    Hindi: {
      number: "अंक",
      freq: "आवृत्ति",
      status: "स्थिति",
      times: "बार",
      present: "✓ उपस्थित",
      missing: "✗ अनुपस्थित"
    },
    Gujarati: {
      number: "અંક",
      freq: "આવૃત્તિ",
      status: "સ્થિતિ",
      times: "વાર",
      present: "✓ હાજર",
      missing: "✗ ગેરહાજર"
    }
  };
  const currentLabels = labels[lang] || labels.English;

  return (
    <div className="report-loshu-container">
      <div className="report-loshu-flex">
        <div className="report-loshu-left">
          <h3>{t.loShuGridTitle}</h3>
          <div className="report-grid-3x3">
            {gridPositions.map((row, rIdx) => (
              <div key={rIdx} className="report-grid-row">
                {row.map((num) => {
                  const count = gridCounts[num] || 0;
                  const isPresent = count > 0;
                  const hasBadgeOverride = getOverride(`loshu.badge_${num}`) !== null;
                  const showBadge = (isPresent && count > 1) || hasBadgeOverride;

                  return (
                    <div
                      key={num}
                      className={`report-grid-cell ${isPresent ? 'active' : 'empty'}`}
                    >
                      <span className="cell-main-number">
                        <EditableText
                          editId={`loshu.cell_${num}`}
                          defaultValue={isPresent ? String(num) : ''}
                          tag="span"
                        />
                      </span>
                      {showBadge ? (
                        <span className="cell-freq-badge">
                          <EditableText
                            editId={`loshu.badge_${num}`}
                            defaultValue={count > 1 ? `×${count}` : ''}
                            tag="span"
                          />
                        </span>
                      ) : isEditMode ? (
                        <span className="cell-freq-badge hide-on-print">
                          <EditableText
                            editId={`loshu.badge_${num}`}
                            defaultValue=""
                            tag="span"
                          />
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="report-loshu-right">
          <h3>{t.gridStatus}</h3>
          <table className="report-freq-table">
            <thead>
              <tr>
                <th>{currentLabels.number}</th>
                <th>{currentLabels.freq}</th>
                <th>{currentLabels.status}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const count = gridCounts[num] || 0;
                const timesText = lang === 'Hindi' ? `${count} ${currentLabels.times}` : `${count} ${currentLabels.times}`;
                const statusText = count > 0 ? currentLabels.present : currentLabels.missing;

                return (
                  <tr key={num} className={count > 0 ? 'row-active' : 'row-empty'}>
                    <td><strong>{num}</strong></td>
                    <td>
                      <EditableText
                        editId={`loshu.freq_${num}`}
                        defaultValue={timesText}
                        tag="span"
                      />
                    </td>
                    <td>
                      <EditableText
                        editId={`loshu.status_${num}`}
                        defaultValue={statusText}
                        tag="span"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
