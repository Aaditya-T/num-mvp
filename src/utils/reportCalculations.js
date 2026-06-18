import { reduceToSingleDigit } from './numerology';

/**
 * Calculates Personal Year for a given calendar year.
 * Formula: reduce(day + month + year digits)
 */
export function calculatePersonalYear(dobString, targetYear) {
  if (!dobString) return 0;
  const parts = dobString.split('-');
  if (parts.length < 3) return 0;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const yearDigits = String(targetYear).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  const total = reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(yearDigits);
  return reduceToSingleDigit(total);
}

/**
 * Calculates Personal Month for a given date.
 * Formula: reduce(personalYear + calendarMonth)
 */
export function calculatePersonalMonth(dobString, targetDate) {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const py = calculatePersonalYear(dobString, year);
  return reduceToSingleDigit(py + month);
}

/**
 * Calculates Personal Day for a given date.
 * Formula: reduce(personalMonth + calendarDay)
 */
export function calculatePersonalDay(dobString, targetDate) {
  const day = targetDate.getDate();
  const pm = calculatePersonalMonth(dobString, targetDate);
  return reduceToSingleDigit(pm + day);
}

/**
 * Generates a 10-year luck factor table starting from startYear.
 * Luck is derived from the personal year number mapped to a % value.
 * Two columns: by DOB date and by Jan 1.
 */
const LUCK_MAP = {
  1: 70, 2: 40, 3: 70, 4: 40, 5: 60, 6: 60, 7: 40, 8: 60, 9: 50
};

export function calculateLuckFactor(dobString, startYear, count = 10) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    const pyDob = calculatePersonalYear(dobString, year);
    // For Jan 1 column: use Jan 1 of that year as start reference
    const jan1Dob = dobString.replace(/^\d{4}/, String(year)).replace(/-\d{2}-\d{2}$/, '-01-01');
    const pyJan = calculatePersonalYear(jan1Dob, year);
    rows.push({
      serial: i + 1,
      year,
      luckDob: LUCK_MAP[pyDob] ?? 50,
      luckJan: LUCK_MAP[pyJan] ?? 50,
      pyDob,
      pyJan
    });
  }
  return rows;
}

/**
 * Returns which Lo Shu arrows are present in the grid.
 * An arrow is a full row, column, or diagonal all present.
 * Returns array of { name, numbers, type } objects.
 */
const LO_SHU_ARROWS = [
  // Rows (horizontal)
  { name: 'Thought Plane', numbers: [4, 9, 2], type: 'row', key: 'thought' },
  { name: 'Will Plane', numbers: [3, 5, 7], type: 'row', key: 'will' },
  { name: 'Practical Plane', numbers: [8, 1, 6], type: 'row', key: 'practical' },
  // Columns (vertical)
  { name: 'Action Plane', numbers: [4, 3, 8], type: 'col', key: 'action' },
  { name: 'Emotional Plane', numbers: [9, 5, 1], type: 'col', key: 'emotion' },
  { name: 'Success Plane', numbers: [2, 7, 6], type: 'col', key: 'success' },
  // Diagonals
  { name: 'Goal / Determination Arrow', numbers: [4, 5, 6], type: 'diag', key: 'goal' },
  { name: 'Spiritual / Compassion Arrow', numbers: [2, 5, 8], type: 'diag', key: 'spiritual' },
];

export function getPresentArrows(gridCounts) {
  return LO_SHU_ARROWS.filter(arrow =>
    arrow.numbers.every(n => gridCounts[n] > 0)
  );
}

/**
 * Returns present number pairs that form notable combinations.
 * Based on the PDF's "Arrow" section showing pair meanings.
 */
const NUMBER_PAIRS = [
  { pair: [1, 2], key: '1-2' }, { pair: [1, 3], key: '1-3' }, { pair: [1, 4], key: '1-4' },
  { pair: [1, 5], key: '1-5' }, { pair: [1, 6], key: '1-6' }, { pair: [1, 7], key: '1-7' },
  { pair: [1, 8], key: '1-8' }, { pair: [1, 9], key: '1-9' },
  { pair: [2, 3], key: '2-3' }, { pair: [2, 4], key: '2-4' }, { pair: [2, 5], key: '2-5' },
  { pair: [2, 6], key: '2-6' }, { pair: [2, 7], key: '2-7' }, { pair: [2, 8], key: '2-8' },
  { pair: [2, 9], key: '2-9' },
  { pair: [3, 4], key: '3-4' }, { pair: [3, 5], key: '3-5' }, { pair: [3, 6], key: '3-6' },
  { pair: [3, 7], key: '3-7' }, { pair: [3, 8], key: '3-8' }, { pair: [3, 9], key: '3-9' },
  { pair: [4, 5], key: '4-5' }, { pair: [4, 6], key: '4-6' }, { pair: [4, 7], key: '4-7' },
  { pair: [4, 8], key: '4-8' }, { pair: [4, 9], key: '4-9' },
  { pair: [5, 6], key: '5-6' }, { pair: [5, 7], key: '5-7' }, { pair: [5, 8], key: '5-8' },
  { pair: [5, 9], key: '5-9' },
  { pair: [6, 7], key: '6-7' }, { pair: [6, 8], key: '6-8' }, { pair: [6, 9], key: '6-9' },
  { pair: [7, 8], key: '7-8' }, { pair: [7, 9], key: '7-9' },
  { pair: [8, 9], key: '8-9' },
];

export function getPresentPairs(gridCounts) {
  return NUMBER_PAIRS.filter(({ pair }) => pair.every(n => gridCounts[n] > 0));
}

/**
 * Returns the person's current age in years.
 */
export function calculateAge(dobString) {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

/**
 * Formats a DOB string into human-readable form.
 * '1971-03-30' → 'March 30, 1971'
 */
export function formatDOB(dobString) {
  if (!dobString) return '';
  const d = new Date(dobString + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}
