import EditableSection from './editables/EditableSection';
import { useEdit } from './EditContext';

export default function ReportSection({ title, children, showHeader = true, className = '', sectionId = '' }) {
  const { brand } = useEdit();

  const brandInfo = {
    mentor: {
      name: 'Mentor Universe',
      phone: '+91 95125 07831 | shivastro37@gmail.com',
      footer: 'Hardik J Vvaidhya | Anand Center | Phone: +91 95125 07831, +91 95378 36955'
    },
    numero: {
      name: 'Numero Divine',
      phone: '+91 96870 62789',
      footer: 'Payal Trivedi | Vadodara Center | Phone: +91 96870 62789'
    }
  };

  const currentBrand = brandInfo[brand] || brandInfo.mentor;

  return (
    <EditableSection sectionId={sectionId}>
      <div className={`report-section-container ${className}`.trim()} data-section-id={sectionId}>
        {showHeader && (
          <div className="report-section-header-print">
            <div className="print-header-brand">
              <span className="brand-name">{currentBrand.name}</span>
              <span className="print-header-spacer"></span>
              <span className="brand-phone">{currentBrand.phone}</span>
            </div>
            <div className="print-header-divider"></div>
          </div>
        )}
        {title && <h2 className="report-section-title">{title}</h2>}
        <div className="report-section-content">
          {children}
        </div>
        <div className="report-section-footer-print">
          <div className="print-footer-text">{currentBrand.footer}</div>
        </div>
      </div>
    </EditableSection>
  );
}
