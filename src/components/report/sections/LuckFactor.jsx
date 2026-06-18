import React from 'react';
import { calculateLuckFactor } from '../../../utils/reportCalculations';
import EditableText from '../editables/EditableText';
import { useEdit } from '../EditContext';

export default function LuckFactor({ dob, lang, t }) {
  const { getOverride } = useEdit();
  const currentYear = new Date().getFullYear();
  const luckData = calculateLuckFactor(dob, currentYear, 10);

  const labels = {
    English: { serial: "Serial Number", year: "Year" },
    Hindi: { serial: "क्रम संख्या", year: "वर्ष" },
    Gujarati: { serial: "ક્રમ નંબર", year: "વર્ષ" }
  };
  const currentLabels = labels[lang] || labels.English;

  return (
    <div className="report-luck-table-wrapper">
      <table className="report-luck-table">
        <thead>
          <tr>
            <th>{currentLabels.serial}</th>
            <th>{currentLabels.year}</th>
            <th>{t.luckDobCol}</th>
            <th>{t.luckJanCol}</th>
          </tr>
        </thead>
        <tbody>
          {luckData.map((row) => {
            const dobOverride = getOverride(`luck.dob_${row.serial}`);
            const janOverride = getOverride(`luck.jan_${row.serial}`);
            
            const dobVal = dobOverride !== null ? parseFloat(dobOverride) : row.luckDob;
            const janVal = janOverride !== null ? parseFloat(janOverride) : row.luckJan;

            return (
              <tr key={row.serial}>
                <td>{row.serial}</td>
                <td>
                  <EditableText
                    editId={`luck.year_${row.serial}`}
                    defaultValue={String(row.year)}
                    tag="strong"
                  />
                </td>
                <td>
                  <div className="luck-factor-progress">
                    <div className="luck-bar-fill" style={{ width: `${isNaN(dobVal) ? 0 : dobVal}%` }}></div>
                    <EditableText
                      editId={`luck.dob_${row.serial}`}
                      defaultValue={`${row.luckDob}%`}
                      tag="span"
                      className="luck-value-text"
                    />
                  </div>
                </td>
                <td>
                  <div className="luck-factor-progress">
                    <div className="luck-bar-fill jan-bar" style={{ width: `${isNaN(janVal) ? 0 : janVal}%` }}></div>
                    <EditableText
                      editId={`luck.jan_${row.serial}`}
                      defaultValue={`${row.luckJan}%`}
                      tag="span"
                      className="luck-value-text"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
