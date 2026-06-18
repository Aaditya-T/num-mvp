import React from 'react';
import { REPEATED_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

export default function RepeatedNumbersReport({ gridCounts, lang, t }) {
  const repeatedNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => gridCounts[n] && gridCounts[n] > 0);

  return (
    <div className="report-repeated-grid-list">
      {repeatedNums.map((num) => {
        const count = gridCounts[num];
        // Normalize count to max 4 for lookup
        const lookupCount = count > 4 ? 4 : count;
        const text = REPEATED_DEEP_TEMPLATES[lang]?.[num]?.[lookupCount] || '';
        return (
          <div key={num} className="report-repeated-card-item">
            <div className="repeated-badge-count">
              <span className="rep-num">{num}</span>
              <span className="rep-times">{count}x</span>
            </div>
            <div className="repeated-card-text">
              <EditableText
                editId={`repeated.title_${num}`}
                defaultValue={t.repeatedBadge ? t.repeatedBadge.replace('{num}', num).replace('{count}', count) : `Number ${num} (${count} times)`}
                tag="h4"
              />
              <EditableText
                editId={`repeated.text_${num}`}
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
