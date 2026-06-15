import React, { useState } from 'react';
import { Send, MessageSquare, Download, Check } from 'lucide-react';

export default function CTASection() {
  const [bookingMessage, setBookingMessage] = useState('');

  const handleBook = () => {
    setBookingMessage('✨ Thank you! Booking system integration is in progress. Please contact us on WhatsApp (+91 99999 99999) for immediate slot booking!');
    setTimeout(() => setBookingMessage(''), 8000);
  };

  const whatsappLink = `https://wa.me/919999999999?text=${encodeURIComponent(
    "Hi, I completed my free Numerology reading and would like to book a detailed consultation for my career, relationships, and name correction."
  )}`;

  return (
    <div className="card cta-card glow-gold-border animation-fade-in-up delay-500 hide-on-print">
      <div className="cta-gradient-overlay"></div>
      
      <div className="cta-content">
        <span className="cta-tagline">Premium Vedic Insight</span>
        <h2>Unlock Your Comprehensive Personal Numerology Report</h2>
        <p className="cta-desc">
          Go beyond the basics. Discover deep insights into your career trajectory, marriage & relationship compatibility, scientific name corrections, mobile phone numerology, personalized remedies, and month-by-month predictions.
        </p>

        {bookingMessage && (
          <div className="booking-alert-box animation-fade-in-up">
            <span>{bookingMessage}</span>
          </div>
        )}

        <div className="cta-actions">
          <button onClick={handleBook} className="btn btn-secondary btn-cta">
            <Send size={18} />
            <span>Book Appointment</span>
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-cta btn-whatsapp"
          >
            <MessageSquare size={18} />
            <span>Contact on WhatsApp</span>
          </a>

          <button className="btn btn-disabled btn-cta" disabled title="Coming Soon">
            <Download size={18} />
            <span>Download Sample PDF</span>
            <span className="btn-tag">Soon</span>
          </button>
        </div>

        <div className="cta-footer-info text-xs text-muted">
          <span>* Dedicated 1-on-1 consultation with certified numerologists.</span>
          <span>• Secured via direct WhatsApp channel (+91 99999 99999).</span>
        </div>
      </div>
    </div>
  );
}
