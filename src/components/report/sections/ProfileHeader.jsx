import { formatDOB } from '../../../utils/reportCalculations';
import EditableText from '../editables/EditableText';
import EditableImageSlot from '../editables/EditableImageSlot';
import { useEdit } from '../EditContext';

export default function ProfileHeader({ name, dob, gender, age, moolank, bhagyank, kua, lang, t }) {
  const { brand } = useEdit();
  const reportDateLabel = lang === 'Hindi' ? 'रिपोर्ट तिथि' : lang === 'Gujarati' ? 'અહેવાલ તારીખ' : 'Report Date';

  const brandInfo = {
    mentor: {
      logo: '/logo.png',
      title: 'Mentor Universe',
      subtitle: 'Vastu • Numerology • Energy Guidance'
    },
    numero: {
      logo: '/numero-divine.jpeg',
      title: 'Numero Divine',
      subtitle: 'Numerology Specialist • Energy Consultant'
    }
  };

  const currentBrand = brandInfo[brand] || brandInfo.mentor;
  const yearsLabel = lang === 'Hindi' ? 'वर्ष' : lang === 'Gujarati' ? 'વર્ષ' : 'Years';

  return (
    <div className="report-profile-cover">
      <div className="report-cover-logo-wrapper">
        <EditableImageSlot slotId="cover.logo" defaultSrc={currentBrand.logo} alt={currentBrand.title} className="report-cover-logo" />
      </div>
      <EditableText editId="cover.title" defaultValue={currentBrand.title} tag="h1" className="report-cover-title" />
      <EditableText editId="cover.subtitle" defaultValue={currentBrand.subtitle} tag="p" className="report-cover-subtitle" />
      
      <div className="report-cover-divider"></div>
      
      <div className="report-client-details">
        <h2 className="report-cover-header-text">{t.personalReport}</h2>
        <table className="report-profile-table">
          <tbody>
            <tr>
              <td><strong>{t.name}:</strong></td>
              <EditableText editId="cover.clientName" defaultValue={name} tag="td" />
            </tr>
            <tr>
              <td><strong>{t.dob}:</strong></td>
              <td>{formatDOB(dob)}</td>
            </tr>
            <tr>
              <td><strong>{t.gender}:</strong></td>
              <td>{gender}</td>
            </tr>
            <tr>
              <td><strong>{t.age}:</strong></td>
              <td>{age} {yearsLabel}</td>
            </tr>
            <tr>
              <td><strong>{reportDateLabel}:</strong></td>
              <td>{formatDOB(new Date().toISOString().slice(0, 10))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="report-cover-core-metrics">
        <h3>{t.coreNumbers}</h3>
        <div className="report-metrics-grid">
          <div className="metric-box">
            <span className="metric-label">{t.moolank}</span>
            <EditableText editId="cover.moolank" defaultValue={String(moolank)} tag="span" className="metric-value" />
          </div>
          <div className="metric-box">
            <span className="metric-label">{t.bhagyank}</span>
            <EditableText editId="cover.bhagyank" defaultValue={String(bhagyank)} tag="span" className="metric-value" />
          </div>
          <div className="metric-box">
            <span className="metric-label">{t.kua}</span>
            <EditableText editId="cover.kua" defaultValue={String(kua)} tag="span" className="metric-value" />
          </div>
        </div>
      </div>
    </div>
  );
}
