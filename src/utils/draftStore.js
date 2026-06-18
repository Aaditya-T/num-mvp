/**
 * draftStore.js — IndexedDB wrapper for numerology report drafts.
 * Uses the native indexedDB API. No external libraries.
 *
 * DB: "numerology-drafts" v1
 * Store: "drafts" (keyPath: "id")
 */

const DB_NAME = 'numerology-drafts';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

/** @type {IDBDatabase | null} */
let cachedDB = null;

/**
 * Open (or reuse) the IndexedDB database.
 * Creates the "drafts" object store on first run.
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  if (cachedDB) return Promise.resolve(cachedDB);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      cachedDB = event.target.result;
      // Clear cache if db closes unexpectedly
      cachedDB.onclose = () => { cachedDB = null; };
      resolve(cachedDB);
    };

    request.onerror = (event) => {
      console.error('[draftStore] Failed to open DB:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Save (create or update) a draft.
 * Automatically sets `updatedAt`. If `id` is missing, generates one.
 * @param {Object} draft — the draft object
 * @returns {Promise<Object>} — the saved draft
 */
export async function saveDraft(draft) {
  try {
    const db = await openDB();
    const now = Date.now();

    if (!draft.id) {
      draft.id = crypto.randomUUID();
      draft.createdAt = now;
    }
    draft.updatedAt = now;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(draft);

      request.onsuccess = () => resolve(draft);
      request.onerror = (e) => {
        console.error('[draftStore] saveDraft error:', e.target.error);
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error('[draftStore] saveDraft failed:', err);
    throw err;
  }
}

/**
 * Get a single draft by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getDraft(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => {
        console.error('[draftStore] getDraft error:', e.target.error);
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error('[draftStore] getDraft failed:', err);
    return null;
  }
}

/**
 * Get all drafts, sorted by updatedAt descending.
 * @returns {Promise<Object[]>}
 */
export async function getAllDrafts() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const drafts = request.result || [];
        drafts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(drafts);
      };
      request.onerror = (e) => {
        console.error('[draftStore] getAllDrafts error:', e.target.error);
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error('[draftStore] getAllDrafts failed:', err);
    return [];
  }
}

/**
 * Delete a draft by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteDraft(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (e) => {
        console.error('[draftStore] deleteDraft error:', e.target.error);
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error('[draftStore] deleteDraft failed:', err);
  }
}

/**
 * Duplicate a draft: clone it with a new ID and timestamps.
 * @param {string} id — ID of the draft to duplicate
 * @returns {Promise<Object>} — the new duplicated draft
 */
export async function duplicateDraft(id) {
  const original = await getDraft(id);
  if (!original) throw new Error(`Draft ${id} not found`);

  const now = Date.now();
  const clone = {
    ...JSON.parse(JSON.stringify(original)), // deep clone
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  // Append "(copy)" to the name
  if (clone.baseInputs?.name) {
    clone.baseInputs.name += ' (copy)';
  }

  return saveDraft(clone);
}

/**
 * Create a new empty draft with the given base inputs.
 * @param {{ name: string, dob: string, gender: string, language: string }} baseInputs
 * @returns {Promise<Object>} — the newly created draft
 */
export async function createEmptyDraft(baseInputs) {
  const now = Date.now();
  const draft = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    baseInputs: { ...baseInputs },
    overrides: {},
    hiddenSections: [],
    notesBySection: {},
    images: {},
  };

  return saveDraft(draft);
}
