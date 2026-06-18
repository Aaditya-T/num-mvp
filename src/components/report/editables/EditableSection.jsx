import { useEdit } from '../EditContext';

/**
 * EditableSection — a utility wrapper that adds edit controls (hide/show,
 * add notes) to a report section. Does NOT replace ReportSection.
 *
 * Props:
 *   sectionId — e.g. 'mindNumber', 'loshuGrid'
 *   children  — the section content to render
 */
export default function EditableSection({ sectionId, children }) {
  const {
    isEditMode,
    isSectionHidden,
    toggleSection,
    getNotesForSection,
    addNote,
    updateNote,
    removeNote,
  } = useEdit();

  /* ── Read-only mode: transparent pass-through ── */
  if (!isEditMode) {
    return <>{children}</>;
  }

  const visible = !isSectionHidden(sectionId);
  const notes = getNotesForSection(sectionId);

  /* ── Edit mode: section is hidden → show collapsed bar ── */
  if (!visible) {
    return (
      <div className="editable-section-hidden-bar hide-on-print">
        <span>Section: {sectionId} (hidden)</span>
        <button onClick={() => toggleSection(sectionId)}>Show</button>
      </div>
    );
  }

  /* ── Edit mode: section is visible → children + controls + notes ── */
  return (
    <div className="editable-section-wrapper">
      {/* Floating control strip */}
      <div className="editable-section-controls hide-on-print">
        {/* Toggle visibility */}
        <button
          onClick={() => toggleSection(sectionId)}
          title="Hide section"
          aria-label="Hide section"
        >
          🚫
        </button>
        {/* Add a new note */}
        <button
          onClick={() => addNote(sectionId)}
          title="Add note"
          aria-label="Add note to section"
        >
          ➕
        </button>
      </div>

      {/* Section content */}
      {children}

      {/* Custom notes appended at the bottom */}
      {notes.length > 0 && (
        <div className="editable-section-notes">
          {notes.map((noteText, index) => (
            <div key={index} className="report-custom-note">
              <textarea
                className="report-custom-note-textarea"
                value={noteText}
                onChange={(e) => updateNote(sectionId, index, e.target.value)}
                placeholder="Type your note here…"
                rows={2}
              />
              <button
                className="report-custom-note-delete hide-on-print"
                onClick={() => removeNote(sectionId, index)}
                title="Delete note"
                aria-label="Delete note"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
