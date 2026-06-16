import React from 'react';
import { X, Phone, MessageSquare, Mail, MapPin, User, Compass } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const createWhatsAppLink = (number, expertName) => {
    const text = `Hi ${expertName} ji, I completed the free Numerology reading on Mentor Universe and would like to book a detailed consultation.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container animation-scale-in">
        <div className="modal-header">
          <div className="modal-title-group">
            <Compass className="icon-gold animate-spin-slow" size={20} />
            <h2>Connect with Mentor Universe</h2>
          </div>
          <button onClick={onClose} className="btn-close" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro text-sm text-muted">
            Reach out to our certified experts for personalized home Vastu planning, name corrections, corporate alignments, and energetic remedies.
          </p>

          <div className="counselors-grid">
            {/* Anand Center - Hardik J Vvaidhya */}
            <div className="counselor-card border-gold-hover">
              <div className="counselor-header">
                <div className="counselor-avatar">H</div>
                <div className="counselor-meta">
                  <h3>Hardik J Vvaidhya</h3>
                  <span className="counselor-badge gold-badge-text">Anand Center</span>
                  <p className="counselor-roles text-xs text-muted">Vastu Expert • Numerologist • Energy Consultant</p>
                </div>
              </div>

              <div className="divider-glow"></div>

              <div className="counselor-details">
                <div className="detail-row">
                  <MapPin size={16} className="text-gold flex-shrink-0" />
                  <span className="text-xs text-secondary leading-relaxed">
                    06, Moon, First Floor, Aatmiya Empire, Bakrol-Vadtal Road, Bakrol, Anand, Gujarat. 388315
                  </span>
                </div>
                <div className="detail-row">
                  <Mail size={16} className="text-gold" />
                  <a href="mailto:shivastro37@gmail.com?subject=Consultation Enquiry" className="text-xs text-secondary link-hover font-mono">
                    shivastro37@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-actions-grid">
                <a href="tel:+919512507831" className="btn btn-secondary btn-contact-sm">
                  <Phone size={14} />
                  <span>Call 1</span>
                </a>
                <a href="tel:+919537836955" className="btn btn-secondary btn-contact-sm">
                  <Phone size={14} />
                  <span>Call 2</span>
                </a>
                <a 
                  href={createWhatsAppLink("919512507831", "Hardik")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-contact-sm btn-whatsapp-direct"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Vadodara Center - Payal Trivedi */}
            <div className="counselor-card border-purple-hover">
              <div className="counselor-header">
                <div className="counselor-avatar avatar-purple">P</div>
                <div className="counselor-meta">
                  <h3>Payal Trivedi</h3>
                  <span className="counselor-badge purple-badge-text">Vadodara Center</span>
                  <p className="counselor-roles text-xs text-muted">Numerology Specialist • Energy Consultant</p>
                </div>
              </div>

              <div className="divider-glow"></div>

              <div className="counselor-details">
                <div className="detail-row">
                  <MapPin size={16} className="text-purple flex-shrink-0" />
                  <span className="text-xs text-secondary leading-relaxed">
                    Vadodara Branch, Gujarat (Consultations by prior appointment only)
                  </span>
                </div>
                <div className="detail-row">
                  <Phone size={16} className="text-purple" />
                  <span className="text-xs text-secondary font-mono">+91 96870 62789</span>
                </div>
              </div>

              <div className="contact-actions-grid">
                <a href="tel:+919687062789" className="btn btn-secondary btn-contact-sm flex-2">
                  <Phone size={14} />
                  <span>Call Payal ji</span>
                </a>
                <a 
                  href={createWhatsAppLink("919687062789", "Payal")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-contact-sm btn-whatsapp-direct flex-1"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
