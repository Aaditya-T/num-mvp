import React from 'react';
import { MISSING_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

export default function MissingNumbersReport({ gridCounts, lang, t }) {
  const missingNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !gridCounts[n] || gridCounts[n] === 0);

  if (missingNums.length === 0) {
    return (
      <div className="report-missing-empty">
        <p>🎉 Excellent! Your grid contains all the numbers. No energies are missing.</p>
      </div>
    );
  }

  return (
    <div className="report-missing-grid-list">
      {missingNums.map((num) => {
        const text = MISSING_DEEP_TEMPLATES[lang]?.[num] || '';
        return (
          <div key={num} className="report-missing-card-item">
            <div className="missing-badge-number">{num}</div>
            <div className="missing-card-text">
              <EditableText
                editId={`missing.title_${num}`}
                defaultValue={t.missingBadge ? t.missingBadge.replace('{num}', num) : `Number ${num} is Missing`}
                tag="h4"
              />
              <EditableText
                editId={`missing.text_${num}`}
                defaultValue={text}
                tag="p"
                multiline
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
