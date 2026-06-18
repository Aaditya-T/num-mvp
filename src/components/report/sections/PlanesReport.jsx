import React from 'react';
import { calculatePlanes } from '../../../utils/numerology';
import { PLANE_TRANSLATIONS } from '../../../utils/constants';
import EditableText from '../editables/EditableText';
import { useEdit } from '../EditContext';

export default function PlanesReport({ gridCounts, lang, t }) {
  const { getOverride } = useEdit();
  const planesData = calculatePlanes(gridCounts);
  if (!planesData) return null;

  const labels = {
    English: {
      numbers: "Numbers",
      status: "Status",
      active: "Active",
      partial: "Partial",
      dormant: "Dormant"
    },
    Hindi: {
      numbers: "अंक",
      status: "स्थिति",
      active: "सक्रिय",
      partial: "आंशिक",
      dormant: "निष्क्रिय"
    },
    Gujarati: {
      numbers: "અંકો",
      status: "સ્થિતિ",
      active: "સક્રિય",
      partial: "આંશિક",
      dormant: "નિષ્ક્રિય"
    }
  };
  const currentLabels = labels[lang] || labels.English;

  return (
    <div className="report-planes-card-wrapper">
      <table className="report-planes-table">
        <thead>
          <tr>
            <th>{t.planeName}</th>
            <th>{currentLabels.numbers}</th>
            <th>{t.planePercent}</th>
            <th>{currentLabels.status}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(planesData.planes).map(([key, value]) => {
            const trans = PLANE_TRANSLATIONS[lang]?.[key] || { name: key, desc: '' };
            const percentOverride = getOverride(`planes.percent_${key}`);
            const percentage = percentOverride !== null ? parseFloat(percentOverride) : value.percentage;
            
            let statusColor = 'status-low';
            if (percentage === 100) statusColor = 'status-full';
            else if (percentage >= 66) statusColor = 'status-medium';

            const defaultStatus = percentage === 100
              ? currentLabels.active
              : percentage > 0
              ? currentLabels.partial
              : currentLabels.dormant;

            return (
              <tr key={key}>
                <td>
                  <EditableText editId={`planes.name_${key}`} defaultValue={trans.name} tag="strong" />
                  <EditableText editId={`planes.desc_${key}`} defaultValue={trans.desc} tag="div" className="plane-desc-subtext" />
                </td>
                <td>
                  <span className="plane-num-tag">
                    <EditableText editId={`planes.numbers_${key}`} defaultValue={value.numbers.join(', ')} tag="span" />
                  </span>
                </td>
                <td>
                  <div className="report-progress-bar-container">
                    <div className="report-progress-bar-fill" style={{ width: `${isNaN(percentage) ? 0 : percentage}%` }}></div>
                    <EditableText
                      editId={`planes.percent_${key}`}
                      defaultValue={`${value.percentage}%`}
                      tag="span"
                      className="progress-bar-label"
                    />
                  </div>
                </td>
                <td>
                  <span className={`plane-status-pill ${statusColor}`}>
                    <EditableText
                      editId={`planes.status_${key}`}
                      defaultValue={defaultStatus}
                      tag="span"
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
