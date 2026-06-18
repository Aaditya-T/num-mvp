import React from 'react';
import { BHAGYANK_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import { PLANETS_TRANSLATIONS } from '../../../utils/constants';
import EditableText from '../editables/EditableText';

export default function BodyNumber({ bhagyank, lang, t }) {
  const deepText = BHAGYANK_DEEP_TEMPLATES[lang]?.[bhagyank] || '';
  const planet = PLANETS_TRANSLATIONS[lang]?.[bhagyank] || '';

  return (
    <div className="report-deep-dive-card">
      <div className="report-dive-header">
        <div className="report-dive-badge body-badge">{bhagyank}</div>
        <div className="report-dive-meta">
          <h3>{t.bhagyank}: {bhagyank}</h3>
          <p><strong>{t.rulingPlanet}:</strong> {planet}</p>
        </div>
      </div>
      <div className="report-dive-content-text">
        <EditableText editId="bodyNumber.deepText" defaultValue={deepText} tag="p" multiline />
      </div>
    </div>
  );
}
