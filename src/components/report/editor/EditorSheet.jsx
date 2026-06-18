import { useState, useRef, useEffect } from 'react';
import { useEdit } from '../EditContext';
import { GripHorizontal, ChevronUp, Eye, EyeOff, Navigation } from 'lucide-react';

const SECTION_LIST = [
  { id: 'cover', label: 'Cover' },
  { id: 'summary', label: 'Summary' },
  { id: 'loshu', label: 'Lo Shu Grid' },
  { id: 'mindNumber', label: 'Moolank' },
  { id: 'bodyNumber', label: 'Bhagyank' },
  { id: 'combination', label: 'Combination' },
  { id: 'kua', label: 'Kua' },
  { id: 'planes', label: 'Planes' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'missingNumbers', label: 'Missing' },
  { id: 'repeatedNumbers', label: 'Repeated' },
  { id: 'firstLetter', label: 'First Letter' },
  { id: 'personalCycles', label: 'Cycles' },
  { id: 'luckFactor', label: 'Luck' },
  { id: 'luckyElements', label: 'Lucky' },
  { id: 'gemstones', label: 'Gems' },
  { id: 'remedies', label: 'Remedies' },
  { id: 'signoff', label: 'Sign-off' },
];

/**
 * Mobile bottom sheet editor.
 * Snaps to three heights: collapsed (60px), half (40vh), full (85vh).
 */
export default function EditorSheet({ clientInputs, onClientChange, onResetAll, onDuplicate, onDelete, onBack }) {
  const { draft, saveStatus, isSectionHidden, toggleSection } = useEdit();
  const [sheetState, setSheetState] = useState('collapsed'); // collapsed | half | full
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const cycleState = () => {
    if (sheetState === 'collapsed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('collapsed');
  };

  const scrollToSection = (sectionId) => {
    const el = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSheetState('collapsed');
    }
  };

  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    const rect = sheetRef.current?.getBoundingClientRect();
    if (rect) startHeightRef.current = window.innerHeight - rect.top;
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startYRef.current - endY;
    // Swipe up → expand, swipe down → collapse
    if (diff > 50) {
      if (sheetState === 'collapsed') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    } else if (diff < -50) {
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('collapsed');
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`editor-sheet hide-on-print state-${sheetState}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Handle bar */}
      <div className="editor-sheet-handle" onClick={cycleState}>
        <div className="sheet-handle-bar" />
        <div className="sheet-handle-info">
          <span className="sheet-mode-label">✏️ Edit Mode</span>
          <span className={`editor-save-status status-${saveStatus}`}>
            {saveStatus === 'saving' ? '⏳ Saving…' : saveStatus === 'saved' ? '✓ Saved' : ''}
          </span>
        </div>
        <ChevronUp size={18} className={`sheet-chevron ${sheetState !== 'collapsed' ? 'rotated' : ''}`} />
      </div>

      {/* Content — only visible when not collapsed */}
      {sheetState !== 'collapsed' && (
        <div className="editor-sheet-content">
          {/* Quick section jump list */}
          <div className="sheet-section-grid">
            {SECTION_LIST.map(sec => {
              const isHidden = isSectionHidden(sec.id);
              return (
                <button
                  key={sec.id}
                  className={`sheet-section-chip ${isHidden ? 'is-hidden' : ''}`}
                  onClick={() => scrollToSection(sec.id)}
                >
                  <span>{sec.label}</span>
                  {isHidden && <EyeOff size={10} />}
                </button>
              );
            })}
          </div>

          {/* Full controls — only in full state */}
          {sheetState === 'full' && (
            <div className="sheet-full-controls">
              <div className="editor-field-group">
                <label>Client Name</label>
                <input
                  type="text"
                  value={clientInputs?.name || ''}
                  onChange={(e) => onClientChange('name', e.target.value)}
                  className="editor-field-input"
                />
              </div>
              <div className="editor-field-group">
                <label>DOB</label>
                <input
                  type="date"
                  value={clientInputs?.dob || ''}
                  onChange={(e) => onClientChange('dob', e.target.value)}
                  className="editor-field-input"
                />
              </div>
              <div className="editor-field-group">
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

              <div className="editor-actions sheet-actions">
                <button className="editor-action-btn btn-reset-all" onClick={onResetAll}>Reset All</button>
                <button className="editor-action-btn btn-duplicate" onClick={onDuplicate}>Duplicate</button>
                <button className="editor-action-btn btn-delete-draft" onClick={onDelete}>Delete</button>
                <button className="editor-action-btn btn-back-draft" onClick={onBack}>Exit Edit</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
