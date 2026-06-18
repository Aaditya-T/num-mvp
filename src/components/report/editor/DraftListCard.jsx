/**
 * DraftListCard — displays a saved draft in the draft list.
 * Shows client name, DOB, language badge, and last edited time.
 */
export default function DraftListCard({ draft, onOpen, onDelete, onDuplicate }) {
  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const langBadge = {
    English: { label: 'EN', color: '#4a90d9' },
    Hindi: { label: 'हि', color: '#e67e22' },
    Gujarati: { label: 'ગુ', color: '#2ecc71' },
  };

  const lang = draft.baseInputs?.language || 'English';
  const badge = langBadge[lang] || langBadge.English;
  const overrideCount = Object.keys(draft.overrides || {}).length;
  const hiddenCount = (draft.hiddenSections || []).length;

  return (
    <div className="draft-list-card">
      <div className="draft-card-main" onClick={() => onOpen(draft.id)}>
        <div className="draft-card-top">
          <h4 className="draft-card-name">{draft.baseInputs?.name || 'Untitled Draft'}</h4>
          <span className="draft-lang-badge" style={{ backgroundColor: badge.color }}>
            {badge.label}
          </span>
        </div>
        <div className="draft-card-meta">
          <span>DOB: {draft.baseInputs?.dob || '—'}</span>
          <span>•</span>
          <span>{draft.baseInputs?.gender || '—'}</span>
        </div>
        <div className="draft-card-bottom">
          <span className="draft-card-time">Last edited: {formatDate(draft.updatedAt)}</span>
          {overrideCount > 0 && <span className="draft-stat-pill">{overrideCount} edits</span>}
          {hiddenCount > 0 && <span className="draft-stat-pill pill-hidden">{hiddenCount} hidden</span>}
        </div>
      </div>
      <div className="draft-card-actions">
        <button className="draft-action-btn" onClick={(e) => { e.stopPropagation(); onDuplicate(draft.id); }} title="Duplicate">
          📋
        </button>
        <button className="draft-action-btn draft-action-delete" onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }} title="Delete">
          🗑
        </button>
      </div>
    </div>
  );
}
