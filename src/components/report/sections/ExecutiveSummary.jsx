import { calculatePlanes } from '../../../utils/numerology';
import { PLANE_TRANSLATIONS } from '../../../utils/constants';
import EditableText from '../editables/EditableText';

const gridPositions = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

const labels = {
  English: {
    title: 'Personality Analysis - Lo Shu',
    grid: 'Lo Shu Grid',
    yogas: '8 Special Yogas',
    core: 'Core Number Snapshot',
    combination: 'Combination',
    mind: 'Mind Number',
    body: 'Body Number',
    kua: 'Kua Number',
    present: 'Present',
    missing: 'Missing'
  },
  Hindi: {
    title: 'व्यक्तित्व विश्लेषण - लो शू',
    grid: 'लो शू ग्रिड',
    yogas: '8 विशेष योग',
    core: 'मुख्य अंकों का सार',
    combination: 'संयोजन',
    mind: 'मूलांक',
    body: 'भाग्यांक',
    kua: 'कुआ अंक',
    present: 'उपस्थित',
    missing: 'अनुपस्थित'
  },
  Gujarati: {
    title: 'વ્યક્તિત્વ વિશ્લેષણ - લો શૂ',
    grid: 'લો શૂ ગ્રીડ',
    yogas: '8 વિશેષ યોગ',
    core: 'મુખ્ય અંકોનો સાર',
    combination: 'સંયોજન',
    mind: 'મૂલાંક',
    body: 'ભાગ્યાંક',
    kua: 'કુઆ અંક',
    present: 'ઉપસ્થિત',
    missing: 'અનુપસ્થિત'
  }
};

export default function ExecutiveSummary({ gridCounts, moolank, bhagyank, kua, lang }) {
  const planesData = calculatePlanes(gridCounts);
  const copy = labels[lang] || labels.English;

  return (
    <div className="report-summary-page">
      <div className="report-highlight-title">{copy.title}</div>

      <div className="summary-grid-row">
        <div className="summary-panel">
          <h3>{copy.grid}</h3>
          <div className="summary-loshu-grid">
            {gridPositions.map((row, rIdx) => (
              <div key={rIdx} className="summary-loshu-row">
                {row.map((num) => {
                  const count = gridCounts[num] || 0;
                  return (
                    <div key={num} className="summary-loshu-cell">
                      <span>
                        <EditableText
                          editId={`summary.grid_${num}`}
                          defaultValue={count ? Array(count).fill(num).join(', ') : ''}
                          tag="span"
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="summary-panel">
          <h3>{copy.core}</h3>
          <table className="summary-core-table">
            <tbody>
              <tr>
                <td>{copy.combination}</td>
                <td>
                  <EditableText
                    editId="summary.combination"
                    defaultValue={`D-${moolank}/C-${bhagyank}`}
                    tag="span"
                  />
                </td>
              </tr>
              <tr>
                <td>{copy.mind}</td>
                <td>
                  <EditableText
                    editId="summary.moolank"
                    defaultValue={String(moolank)}
                    tag="span"
                  />
                </td>
              </tr>
              <tr>
                <td>{copy.body}</td>
                <td>
                  <EditableText
                    editId="summary.bhagyank"
                    defaultValue={String(bhagyank)}
                    tag="span"
                  />
                </td>
              </tr>
              <tr>
                <td>{copy.kua}</td>
                <td>
                  <EditableText
                    editId="summary.kua"
                    defaultValue={String(kua)}
                    tag="span"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary-panel full-width">
        <h3>{copy.yogas}</h3>
        <table className="summary-yogas-table">
          <tbody>
            {Object.entries(planesData.planes).map(([key, value]) => {
              const trans = PLANE_TRANSLATIONS[lang]?.[key] || { name: key };
              return (
                <tr key={key}>
                  <td>
                    <strong>{trans.name}</strong>
                    <span>
                      <EditableText
                        editId={`summary.yoga_nums_${key}`}
                        defaultValue={value.numbers.join(', ')}
                        tag="span"
                      />
                    </span>
                  </td>
                  <td className={value.percentage === 100 ? 'yoga-full' : value.percentage >= 66 ? 'yoga-mid' : 'yoga-low'}>
                    <EditableText
                      editId={`summary.yoga_percent_${key}`}
                      defaultValue={`${value.percentage}%`}
                      tag="span"
                    />
                  </td>
                  <td>
                    <EditableText
                      editId={`summary.yoga_status_${key}`}
                      defaultValue={value.percentage > 0 ? copy.present : copy.missing}
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
  );
}
