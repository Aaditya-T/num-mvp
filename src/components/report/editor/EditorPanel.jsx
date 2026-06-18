import { useState, useRef } from 'react';
import { useEdit } from '../EditContext';
import { Eye, EyeOff, Plus, StickyNote, ChevronDown, ChevronUp, RotateCcw, Navigation } from 'lucide-react';

/** Section IDs in report order, with display labels */
const SECTION_LIST = [
  { id: 'cover', label: 'Cover / Profile' },
  { id: 'summary', label: 'Executive Summary' },
  { id: 'loshu', label: 'Lo Shu Grid' },
  { id: 'mindNumber', label: 'Mind Number (Moolank)' },
  { id: 'bodyNumber', label: 'Body Number (Bhagyank)' },
  { id: 'combination', label: 'Combination Analysis' },
  { id: 'kua', label: 'Kua Number' },
  { id: 'planes', label: 'Planes / Yogas' },
  { id: 'arrows', label: 'Arrows & Pairs' },
  { id: 'missingNumbers', label: 'Missing Numbers' },
  { id: 'repeatedNumbers', label: 'Repeated Numbers' },
  { id: 'firstLetter', label: 'First Letter' },
  { id: 'personalCycles', label: 'Personal Cycles' },
  { id: 'luckFactor', label: 'Luck Factor Table' },
  { id: 'luckyElements', label: 'Lucky Elements' },
  { id: 'gemstones', label: 'Gemstone Guide' },
  { id: 'remedies', label: 'Remedies' },
  { id: 'signoff', label: 'Sign-off' },
];

/**
 * Desktop sticky editor panel (right sidebar).
 * Props:
 *   onResetAll  — callback to reset entire draft
 *   onDuplicate — callback to duplicate current draft
 *   onDelete    — callback to delete current draft and go back
 *   onBack      — callback to exit edit mode
 *   clientInputs — { name, dob, gender, language } for display
 *   onClientChange — callback(field, value) for client field edits
 */
export default function EditorPanel({ onResetAll, onDuplicate, onDelete, onBack, clientInputs, onClientChange }) {
  const { draft, saveStatus, isSectionHidden, toggleSection, getNotesForSection } = useEdit();
  const [expandedSection, setExpandedSection] = useState(null);

  const scrollToSection = (sectionId) => {
    const el = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getSectionStatus = (sectionId) => {
    const statuses = [];
    if (isSectionHidden(sectionId)) statuses.push('hidden');
    if (getNotesForSection(sectionId).length > 0) statuses.push('notes');
    // Check if any overrides exist for this section
    if (draft?.overrides) {
      const hasOverrides = Object.keys(draft.overrides).some(k => k.startsWith(sectionId + '.') || k === sectionId);
      if (hasOverrides) statuses.push('edited');
    }
    if (draft?.images) {
      const hasImages = Object.keys(draft.images).some(k => k.startsWith(sectionId + '.'));
      if (hasImages) statuses.push('image');
    }
    return statuses;
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="editor-panel hide-on-print">
      {/* Header */}
      <div className="editor-panel-header">
        <div className="editor-draft-info">
          <h3 className="editor-draft-name">{clientInputs?.name || 'Untitled'}</h3>
          <span className="editor-draft-time">Last saved: {formatDate(draft?.updatedAt)}</span>
        </div>
        <div className={`editor-save-status status-${saveStatus}`}>
          {saveStatus === 'saving' ? '⏳ Saving…' : saveStatus === 'saved' ? '✓ Saved' : ''}
        </div>
      </div>

      {/* Client Fields */}
      <div className="editor-section-group">
        <h4 className="editor-group-title">Client Details</h4>
        <div className="editor-field-group">
          <label>Name</label>
          <input
            type="text"
            value={clientInputs?.name || ''}
            onChange={(e) => onClientChange('name', e.target.value)}
            className="editor-field-input"
          />
        </div>
        <div className="editor-field-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={clientInputs?.dob || ''}
            onChange={(e) => onClientChange('dob', e.target.value)}
            className="editor-field-input"
          />
        </div>
        <div className="editor-field-row">
          <div className="editor-field-group">
            <label>Gender</label>
            <select
              value={clientInputs?.gender || 'Male'}
              onChange={(e) => onClientChange('gender', e.target.value)}
              className="editor-field-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="editor-field-group">
            <label>Language</label>
            <select
              value={clientInputs?.language || 'English'}
              onChange={(e) => onClientChange('language', e.target.value)}
              className="editor-field-input"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Gujarati">Gujarati</option>
            </select>
          </div>
        </div>
        <div className="editor-field-group" style={{ marginTop: '1rem' }}>
          <label>Brand / Logo</label>
          <select
            value={clientInputs?.brand || 'mentor'}
            onChange={(e) => onClientChange('brand', e.target.value)}
            className="editor-field-input"
          >
            <option value="mentor">Mentor Universe</option>
            <option value="numero">Numero Divine</option>
          </select>
        </div>
      </div>

      {/* Section Navigator */}
      <div className="editor-section-group">
        <h4 className="editor-group-title">Sections</h4>
        <div className="editor-section-nav">
          {SECTION_LIST.map(sec => {
            const statuses = getSectionStatus(sec.id);
            const isHidden = isSectionHidden(sec.id);
            return (
              <div key={sec.id} className={`editor-nav-item ${isHidden ? 'is-hidden' : ''}`}>
                <button
                  className="editor-nav-name"
                  onClick={() => scrollToSection(sec.id)}
                  title={`Scroll to ${sec.label}`}
                >
                  <Navigation size={12} />
                  <span>{sec.label}</span>
                </button>
                <div className="editor-nav-actions">
                  {statuses.includes('edited') && <span className="status-pill pill-edited">edited</span>}
                  {statuses.includes('notes') && <span className="status-pill pill-notes">notes</span>}
                  {statuses.includes('image') && <span className="status-pill pill-image">img</span>}
                  <button
                    className="editor-nav-toggle"
                    onClick={() => toggleSection(sec.id)}
                    title={isHidden ? 'Show section' : 'Hide section'}
                  >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="editor-actions">
        <button className="editor-action-btn btn-reset-all" onClick={onResetAll}>
          <RotateCcw size={14} />
          <span>Reset All to Generated</span>
        </button>
        <button className="editor-action-btn btn-duplicate" onClick={onDuplicate}>
          <Plus size={14} />
          <span>Duplicate Draft</span>
        </button>
        <button className="editor-action-btn btn-delete-draft" onClick={onDelete}>
          <span>🗑 Delete Draft</span>
        </button>
        <button className="editor-action-btn btn-back-draft" onClick={onBack}>
          <span>← Exit Edit Mode</span>
        </button>
      </div>
    </div>
  );
}

export { SECTION_LIST };
