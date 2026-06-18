import { useState, useRef, useEffect } from 'react';
import { useEdit } from '../EditContext';

/**
 * EditableText — wraps text content to make it inline-editable in edit mode.
 *
 * Props:
 *   editId       — stable ID like 'mindNumber.deepText'
 *   defaultValue — the generated/computed value
 *   tag          — HTML element to render ('p','h3','h4','span','td','strong')
 *   multiline    — use textarea vs input
 *   className    — pass-through CSS class
 *   children     — if provided, render children instead of defaultValue when no override
 */
export default function EditableText({
  editId,
  defaultValue,
  tag = 'p',
  multiline = false,
  className = '',
  children,
}) {
  const { isEditMode, getOverride, setOverride, resetOverride } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const override = getOverride(editId);
  const currentValue = override ?? defaultValue;
  const hasOverride = override !== undefined && override !== null;
  const Tag = tag;

  // Auto-focus the input/textarea when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Place cursor at end of text
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  /* ── Read-only mode ── */
  if (!isEditMode) {
    return (
      <Tag className={className}>
        {hasOverride ? override : (children ?? defaultValue)}
      </Tag>
    );
  }

  /* ── Commit / cancel helpers ── */
  const commitEdit = (newValue) => {
    if (newValue === defaultValue) {
      resetOverride(editId);
    } else {
      setOverride(editId, newValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelEdit();
      return;
    }
    // For single-line input, Enter commits
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      commitEdit(e.target.value);
    }
  };

  const handleBlur = (e) => {
    commitEdit(e.target.value);
  };

  /* ── Editing state: show input/textarea ── */
  if (isEditing) {
    const InputTag = multiline ? 'textarea' : 'input';

    return (
      <Tag className={`${className} editable-text is-editing`}>
        <InputTag
          ref={inputRef}
          className="editable-text-input hide-on-print"
          defaultValue={currentValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          {...(multiline ? { rows: 4 } : { type: 'text' })}
        />
      </Tag>
    );
  }

  /* ── Edit mode (not currently editing): show text with pencil ── */
  return (
    <Tag
      className={`${className} editable-text${hasOverride ? ' is-overridden' : ''}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      {hasOverride ? override : (children ?? defaultValue)}

      {/* Pencil icon — click to start editing */}
      <button
        className="editable-text-pencil hide-on-print"
        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        title="Edit text"
        aria-label="Edit text"
      >
        ✏️
      </button>

      {/* Reset button — only visible when overridden */}
      {hasOverride && (
        <button
          className="editable-text-reset hide-on-print"
          onClick={(e) => { e.stopPropagation(); resetOverride(editId); }}
          title="Reset to default"
          aria-label="Reset to default"
        >
          ↺
        </button>
      )}
    </Tag>
  );
}
