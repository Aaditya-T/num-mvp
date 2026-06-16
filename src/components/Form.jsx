import React, { useState } from 'react';
import { User, Calendar, Phone, Globe, Sparkles } from 'lucide-react';

export default function Form({ onSubmit }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [language, setLanguage] = useState('English');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Naam (Name) is required to unlock your cosmic blueprint.';
    }
    if (!dob) {
      newErrors.dob = 'Janam Tithi (Date of Birth) is required for calculations.';
    }
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required to save your Vedic readings.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorEl = document.querySelector('.form-error-msg');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    onSubmit({ name, dob, gender, mobile, language });
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <Sparkles className="icon-gold animate-pulse" />
        <h2>Enter Birth Details</h2>
        <p className="card-subtitle">Fill in your authentic details to generate your personalized Vedic & Lo Shu reading.</p>
      </div>

      <form onSubmit={handleSubmit} className="spiritual-form" noValidate>
        {/* Full Name */}
        <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="fullName">
            <User size={16} /> Full Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="fullName"
              placeholder="e.g. Aaditya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>

        {/* Date of Birth */}
        <div className={`form-group ${errors.dob ? 'has-error' : ''}`}>
          <label htmlFor="birthDate">
            <Calendar size={16} /> Date of Birth <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              id="birthDate"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              onClick={(e) => {
                try {
                  if (typeof e.target.showPicker === 'function') {
                    e.target.showPicker();
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              className="form-input"
            />
          </div>
          {errors.dob && <span className="form-error-msg">{errors.dob}</span>}
        </div>

        {/* Gender Selection */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label>Gender <span className="required">*</span></label>
            <div className="gender-selector">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className={`gender-option ${gender === g ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="sr-only"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Number & Language Preference */}
        <div className="form-row split-row">
          {/* Mobile Number */}
          <div className={`form-group flex-1 ${errors.mobile ? 'has-error' : ''}`}>
            <label htmlFor="mobileNumber">
              <Phone size={16} /> Mobile Number <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="tel"
                id="mobileNumber"
                placeholder="e.g. +91 99999 99999"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                className="form-input"
              />
            </div>
            {errors.mobile && <span className="form-error-msg">{errors.mobile}</span>}
          </div>

          {/* Language Preference */}
          <div className="form-group flex-1">
            <label htmlFor="languagePref">
              <Globe size={16} /> Preferred Language
            </label>
            <div className="input-wrapper">
              <select
                id="languagePref"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-input form-select"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-submit">
          <span>Reveal My Destiny Blueprint</span>
          <Sparkles size={18} />
        </button>
      </form>
    </div>
  );
}
