import React from 'react';
import { KUA_DEEP_TEMPLATES } from '../../../utils/reportConstants';
import { KUA_TEMPLATES } from '../../../utils/constants';
import EditableText from '../editables/EditableText';

export default function KuaReport({ kua, gender, lang, t }) {
  if (!kua) return null;
  const deepKua = KUA_DEEP_TEMPLATES[lang]?.[kua] || {};
  const baseKua = KUA_TEMPLATES[kua] || {};

  // Formulate the directions list based on standard map or string split
  const directionsRaw = baseKua.direction || '';
  const dirParts = directionsRaw.split(', ');

  const headings = {
    English: ["Purpose", "Auspicious Direction"],
    Hindi: ["कार्य का प्रकार", "शुभ दिशा"],
    Gujarati: ["કાર્ય", "શુભ દિશા"]
  };

  const purposes = {
    English: ["Money & Success", "Better Health", "Love & Marriage", "Spiritual Growth"],
    Hindi: ["धन और सफलता (Wealth & Success)", "बेहतर स्वास्थ्य (Better Health)", "प्रेम और विवाह (Love & Marriage)", "आध्यात्मिक विकास (Spiritual Growth)"],
    Gujarati: ["ધન અને પ્રગતિ", "આરોગ્ય અને સ્વાસ્થ્ય", "પ્રેમ અને લગ્નજીવન", "આધ્યાત્મિક ઉન્નતિ"]
  };

  const currentHeadings = headings[lang] || headings.English;
  const currentPurposes = purposes[lang] || purposes.English;

  const labels = {
    English: { positive: "Positive Traits:", negative: "Negative Traits:" },
    Hindi: { positive: "सकारात्मक लक्षण:", negative: "नकारात्मक लक्षण:" },
    Gujarati: { positive: "હકારાત્મક લક્ષણો:", negative: "નકારાત્મક લક્ષણો:" }
  };
  const currentLabels = labels[lang] || labels.English;

  return (
    <div className="report-kua-card">
      <div className="report-kua-header">
        <div className="kua-large-badge">{kua}</div>
        <div className="kua-header-meta">
          <h3>{t.kuaCardTitle || 'Kua Details'}: {kua}</h3>
          <p>
            <strong>{t.kuaKunQian}:</strong>{' '}
            <EditableText editId="kua.type" defaultValue={deepKua.type || ''} tag="span" /> |{' '}
            <strong>{t.gender}:</strong> {gender}
          </p>
        </div>
      </div>

      <div className="report-kua-body">
        <div className="kua-traits-grid">
          <div>
            <strong>{currentLabels.positive}</strong>
            <EditableText
              editId="kua.traits"
              defaultValue={deepKua.traits || ''}
              tag="p"
              className="kua-trait-text"
              multiline
            />
          </div>
          <div>
            <strong>{currentLabels.negative}</strong>
            <EditableText
              editId="kua.negTraits"
              defaultValue={deepKua.negTraits || ''}
              tag="p"
              className="kua-trait-text text-neg"
              multiline
            />
          </div>
        </div>

        <div className="kua-colors-row">
          <strong>{t.luckyColors}:</strong>{' '}
          <EditableText editId="kua.colors" defaultValue={deepKua.colors || ''} tag="span" className="kua-color-tags" />
        </div>

        <div className="kua-directions-table-wrapper">
          <h4>{t.kuaDirections}</h4>
          <table className="kua-directions-table">
            <thead>
              <tr>
                <th>{currentHeadings[0]}</th>
                <th>{currentHeadings[1]}</th>
              </tr>
            </thead>
            <tbody>
              {currentPurposes.map((purpose, idx) => {
                const dir = dirParts[idx] || 'Refer to guide';
                return (
                  <tr key={idx}>
                    <td>{purpose}</td>
                    <td>
                      <EditableText
                        editId={`kua.direction_${idx}`}
                        defaultValue={dir}
                        tag="strong"
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
