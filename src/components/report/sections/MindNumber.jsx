import React from 'react';
import { MOOLANK_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import { PLANETS_TRANSLATIONS } from '../../../utils/constants';
import EditableText from '../editables/EditableText';

export default function MindNumber({ moolank, lang, t }) {
  const deepText = MOOLANK_DEEP_TEMPLATES[lang]?.[moolank] || '';
  const planet = PLANETS_TRANSLATIONS[lang]?.[moolank] || '';

  return (
    <div className="report-deep-dive-card">
      <div className="report-dive-header">
        <div className="report-dive-badge">{moolank}</div>
        <div className="report-dive-meta">
          <h3>{t.moolank}: {moolank}</h3>
          <p><strong>{t.rulingPlanet}:</strong> {planet}</p>
        </div>
      </div>
      <div className="report-dive-content-text">
        <EditableText editId="mindNumber.deepText" defaultValue={deepText} tag="p" multiline />
      </div>
    </div>
  );
}
