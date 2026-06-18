import React from 'react';
import { COMBINATION_TEMPLATES } from '../../../utils/reportConstants';
import EditableText from '../editables/EditableText';

export default function CombinationAnalysis({ moolank, bhagyank, lang, t }) {
  const comboKey = `${moolank}-${bhagyank}`;
  const comboText = COMBINATION_TEMPLATES[lang]?.[comboKey] || COMBINATION_TEMPLATES[lang]?.["1-1"];

  // Determine dynamic stars/grades if matches specific ones (like 3-6 or 6-3 which has friction)
  const isConflict = (moolank === 3 && bhagyank === 6) || (moolank === 6 && bhagyank === 3);

  return (
    <div className={`report-combo-card ${isConflict ? 'combo-conflict' : ''}`}>
      <div className="report-combo-title-row">
        <h3>{t.combinationHeader.replace('{m}', moolank).replace('{b}', bhagyank)}</h3>
        <span className={`combo-badge-status ${isConflict ? 'status-conflict' : 'status-harmony'}`}>
          {isConflict ? '★★★ Struggle / Conflict' : '★★ Normal / Friendly'}
        </span>
      </div>
      <div className="report-combo-content">
        <EditableText editId="combination.text" defaultValue={comboText} tag="p" className="combo-desc-text" multiline />
      </div>
    </div>
  );
}
