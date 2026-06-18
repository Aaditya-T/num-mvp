import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { saveDraft } from '../../utils/draftStore';

/**
 * @typedef {Object} DraftState
 * @property {string}                  id              — unique draft identifier
 * @property {Record<string, string>}  overrides       — editableId → overridden value
 * @property {string[]}                hiddenSections  — section IDs the user has hidden
 * @property {Record<string, string[]>} notesBySection — sectionId → array of note strings
 * @property {Record<string, string>}  images          — slotId → data-URL string
 */

/**
 * @typedef {'idle' | 'saving' | 'saved'} SaveStatus
 */

/**
 * Context that exposes the full edit-mode API to descendant components.
 * @type {import('react').Context<EditContextValue | null>}
 */
export const EditContext = createContext(null);

/**
 * Convenience hook — returns the current EditContext value.
 * Returns safe no-op defaults when used outside of an EditProvider.
 * @returns {EditContextValue}
 */
const NO_OP = () => {};
const EMPTY_ARR = [];
const DEFAULT_EDIT_VALUE = {
  isEditMode: false,
  draft: null,
  saveStatus: 'idle',
  brand: 'mentor',
  getOverride: () => null,
  setOverride: NO_OP,
  resetOverride: NO_OP,
  isSectionHidden: () => false,
  toggleSection: NO_OP,
  getNotesForSection: () => EMPTY_ARR,
  addNote: NO_OP,
  removeNote: NO_OP,
  updateNote: NO_OP,
  getImage: () => null,
  setImage: NO_OP,
  resetImage: NO_OP,
  resetSection: NO_OP,
  resetAll: NO_OP,
};

export function useEdit() {
  const ctx = useContext(EditContext);
  return ctx ?? DEFAULT_EDIT_VALUE;
}

/* ------------------------------------------------------------------ */
/*  Helper: build a guaranteed-shape draft from an incoming prop       */
/* ------------------------------------------------------------------ */

/** @param {DraftState | null} raw */
function normaliseDraft(raw) {
  return {
    id: raw?.id ?? null,
    overrides: { ...(raw?.overrides ?? {}) },
    hiddenSections: [...(raw?.hiddenSections ?? [])],
    notesBySection: Object.fromEntries(
      Object.entries(raw?.notesBySection ?? {}).map(([k, v]) => [k, [...v]]),
    ),
    images: { ...(raw?.images ?? {}) },
  };
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

/**
 * Provider component that manages local draft state and auto-saves
 * changes via a debounced timer.
 *
 * @param {Object}          props
 * @param {DraftState|null} props.draft         — initial / current draft object
 * @param {boolean}         props.isEditMode    — whether edit mode is active
 * @param {Function}        props.onDraftChange — called with the updated draft after save
 * @param {import('react').ReactNode} props.children
 */
export function EditProvider({ draft, isEditMode, onDraftChange, brand, children }) {
  /* ---------- local draft state ---------- */
  const [draftState, setDraftState] = useState(() => normaliseDraft(draft));

  /** @type {import('react').MutableRefObject<SaveStatus>} */
  const [saveStatus, setSaveStatus] = useState(/** @type {SaveStatus} */ ('idle'));

  /** Debounce timer ref */
  const debounceRef = useRef(null);
  /** "Saved" badge timer ref */
  const savedBadgeRef = useRef(null);

  /* Reset local state when the parent hands us a draft with a different ID */
  useEffect(() => {
    if (draft?.id !== draftState.id) {
      setDraftState(normaliseDraft(draft));
      setSaveStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.id]);

  /* Clean up timers on unmount */
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(savedBadgeRef.current);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Auto-save (debounced 500 ms)                                    */
  /* ---------------------------------------------------------------- */

  /**
   * Schedule an auto-save for the given next-state snapshot.
   * @param {DraftState} next
   */
  const scheduleSave = useCallback(
    (next) => {
      setSaveStatus('saving');

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        await saveDraft(next);
        onDraftChange?.(next);
        setSaveStatus('saved');

        clearTimeout(savedBadgeRef.current);
        savedBadgeRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    },
    [onDraftChange],
  );

  /**
   * Apply a mutation to the draft, update local state, and trigger auto-save.
   * @param {(prev: DraftState) => DraftState} updater
   */
  const mutate = useCallback(
    (updater) => {
      setDraftState((prev) => {
        const next = updater(prev);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  /* ---------------------------------------------------------------- */
  /*  Overrides                                                        */
  /* ---------------------------------------------------------------- */

  /**
   * Return the override value for a given editable slot, or `null`.
   * @param {string} editableId
   * @returns {string | null}
   */
  const getOverride = useCallback(
    (editableId) => draftState.overrides[editableId] ?? null,
    [draftState.overrides],
  );

  /**
   * Set (or replace) an override value.
   * @param {string} editableId
   * @param {string} value
   */
  const setOverride = useCallback(
    (editableId, value) => {
      mutate((prev) => ({
        ...prev,
        overrides: { ...prev.overrides, [editableId]: value },
      }));
    },
    [mutate],
  );

  /**
   * Remove a single override.
   * @param {string} editableId
   */
  const resetOverride = useCallback(
    (editableId) => {
      mutate((prev) => {
        const { [editableId]: _, ...rest } = prev.overrides;
        return { ...prev, overrides: rest };
      });
    },
    [mutate],
  );

  /* ---------------------------------------------------------------- */
  /*  Section visibility                                               */
  /* ---------------------------------------------------------------- */

  /**
   * Check whether a section is currently hidden.
   * @param {string} sectionId
   * @returns {boolean}
   */
  const isSectionHidden = useCallback(
    (sectionId) => draftState.hiddenSections.includes(sectionId),
    [draftState.hiddenSections],
  );

  /**
   * Toggle a section's visibility.
   * @param {string} sectionId
   */
  const toggleSection = useCallback(
    (sectionId) => {
      mutate((prev) => {
        const hidden = prev.hiddenSections.includes(sectionId)
          ? prev.hiddenSections.filter((id) => id !== sectionId)
          : [...prev.hiddenSections, sectionId];
        return { ...prev, hiddenSections: hidden };
      });
    },
    [mutate],
  );

  /* ---------------------------------------------------------------- */
  /*  Notes                                                            */
  /* ---------------------------------------------------------------- */

  /**
   * Return the array of notes for a section (empty array if none).
   * @param {string} sectionId
   * @returns {string[]}
   */
  const getNotesForSection = useCallback(
    (sectionId) => draftState.notesBySection[sectionId] ?? [],
    [draftState.notesBySection],
  );

  /**
   * Append a note to a section.
   * @param {string} sectionId
   * @param {string} text
   */
  const addNote = useCallback(
    (sectionId, text) => {
      const noteText = typeof text === 'string' ? text : '';
      mutate((prev) => ({
        ...prev,
        notesBySection: {
          ...prev.notesBySection,
          [sectionId]: [...(prev.notesBySection[sectionId] ?? []), noteText],
        },
      }));
    },
    [mutate],
  );

  /**
   * Remove a note by index.
   * @param {string} sectionId
   * @param {number} index
   */
  const removeNote = useCallback(
    (sectionId, index) => {
      mutate((prev) => {
        const list = [...(prev.notesBySection[sectionId] ?? [])];
        list.splice(index, 1);
        return {
          ...prev,
          notesBySection: { ...prev.notesBySection, [sectionId]: list },
        };
      });
    },
    [mutate],
  );

  /**
   * Update a note's text at a specific index.
   * @param {string} sectionId
   * @param {number} index
   * @param {string} newText
   */
  const updateNote = useCallback(
    (sectionId, index, newText) => {
      mutate((prev) => {
        const list = [...(prev.notesBySection[sectionId] ?? [])];
        list[index] = newText;
        return {
          ...prev,
          notesBySection: { ...prev.notesBySection, [sectionId]: list },
        };
      });
    },
    [mutate],
  );

  /* ---------------------------------------------------------------- */
  /*  Images                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Return the data-URL for an image slot, or `null`.
   * @param {string} slotId
   * @returns {string | null}
   */
  const getImage = useCallback(
    (slotId) => draftState.images[slotId] ?? null,
    [draftState.images],
  );

  /**
   * Set (or replace) an image for a slot.
   * @param {string} slotId
   * @param {string} dataURL
   */
  const setImage = useCallback(
    (slotId, dataURL) => {
      mutate((prev) => ({
        ...prev,
        images: { ...prev.images, [slotId]: dataURL },
      }));
    },
    [mutate],
  );

  /**
   * Remove a single image slot.
   * @param {string} slotId
   */
  const resetImage = useCallback(
    (slotId) => {
      mutate((prev) => {
        const { [slotId]: _, ...rest } = prev.images;
        return { ...prev, images: rest };
      });
    },
    [mutate],
  );

  /* ---------------------------------------------------------------- */
  /*  Reset helpers                                                    */
  /* ---------------------------------------------------------------- */

  /**
   * Predicate: does `key` belong to the given section?
   * Matches keys that equal `sectionId` or start with `sectionId.`.
   * @param {string} key
   * @param {string} sectionId
   * @returns {boolean}
   */
  const belongsToSection = (key, sectionId) =>
    key === sectionId || key.startsWith(sectionId + '.');

  /**
   * Clear all overrides, notes, and images whose keys belong to a section,
   * and un-hide the section if it was hidden.
   * @param {string} sectionId
   */
  const resetSection = useCallback(
    (sectionId) => {
      mutate((prev) => {
        const overrides = Object.fromEntries(
          Object.entries(prev.overrides).filter(
            ([k]) => !belongsToSection(k, sectionId),
          ),
        );
        const images = Object.fromEntries(
          Object.entries(prev.images).filter(
            ([k]) => !belongsToSection(k, sectionId),
          ),
        );
        const notesBySection = Object.fromEntries(
          Object.entries(prev.notesBySection).filter(
            ([k]) => !belongsToSection(k, sectionId),
          ),
        );
        const hiddenSections = prev.hiddenSections.filter(
          (id) => id !== sectionId,
        );

        return { ...prev, overrides, images, notesBySection, hiddenSections };
      });
    },
    [mutate],
  );

  /**
   * Reset every editable field back to defaults (empty collections).
   */
  const resetAll = useCallback(() => {
    mutate((prev) => ({
      ...prev,
      overrides: {},
      hiddenSections: [],
      notesBySection: {},
      images: {},
    }));
  }, [mutate]);

  /* ---------------------------------------------------------------- */
  /*  Context value                                                    */
  /* ---------------------------------------------------------------- */

  /** @type {EditContextValue} */
  const value = {
    isEditMode,
    draft: draftState,
    saveStatus,
    brand: draftState?.baseInputs?.brand || brand || 'mentor',

    // Overrides
    getOverride,
    setOverride,
    resetOverride,

    // Section visibility
    isSectionHidden,
    toggleSection,

    // Notes
    getNotesForSection,
    addNote,
    removeNote,
    updateNote,

    // Images
    getImage,
    setImage,
    resetImage,

    // Reset
    resetSection,
    resetAll,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}
