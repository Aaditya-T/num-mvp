/**
 * Reduces a number to a single digit (1-9) recursively.
 * If the result is 0, it returns 0.
 */
export function reduceToSingleDigit(num) {
  let val = Math.abs(parseInt(num, 10));
  if (isNaN(val)) return 0;
  if (val === 0) return 0;
  while (val > 9) {
    val = String(val)
      .split('')
      .reduce((sum, char) => sum + parseInt(char, 10), 0);
  }
  return val;
}

/**
 * Calculates Moolank (Birth Number) by reducing the day of birth to a single digit.
 * Example: 30th -> 3 + 0 = 3.
 */
export function calculateMoolank(dobString) {
  if (!dobString) return 0;
  const parts = dobString.split('-'); // YYYY-MM-DD
  if (parts.length < 3) return 0;
  const day = parseInt(parts[2], 10);
  return reduceToSingleDigit(day);
}

/**
 * Calculates Bhagyank (Destiny Number) by summing all digits of the DOB and reducing.
 * Example: 1971-03-30 -> 1+9+7+1+0+3+3+0 = 24 -> 2+4 = 6.
 */
export function calculateBhagyank(dobString) {
  if (!dobString) return 0;
  const digits = dobString.replace(/[^0-9]/g, '');
  const sum = digits.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Lo Shu Grid number counts.
 * Populates frequency of digits 1-9 in the DOB. Ignores 0.
 * Optionally includes Moolank and Bhagyank in the counts.
 */
export function calculateLoShuGrid(dobString, includeMoolankBhagyank, moolank, bhagyank) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  if (!dobString) return counts;

  // Extract all digits 1-9 from DOB
  const digits = dobString.replace(/[^1-9]/g, '');
  for (const digit of digits) {
    counts[digit]++;
  }

  // Include calculated Moolank and Bhagyank if option toggled
  if (includeMoolankBhagyank) {
    if (moolank >= 1 && moolank <= 9) {
      counts[moolank]++;
    }
    if (bhagyank >= 1 && bhagyank <= 9) {
      counts[bhagyank]++;
    }
  }

  return counts;
}

/**
 * Calculates completion percentages and details for the 8 Lo Shu Planes.
 * Identifies the strongest plane(s).
 */
export function calculatePlanes(gridCounts) {
  const planes = {
    thoughtPlane: [4, 3, 8],
    actionPlane: [2, 7, 6],
    willPlane: [9, 5, 1],
    mentalPlane: [4, 9, 2],
    emotionalPlane: [3, 5, 7],
    practicalPlane: [8, 1, 6],
    successPlane1: [2, 5, 8],
    successPlane2: [4, 5, 6]
  };

  const planeResults = {};
  let maxPercent = -1;
  let strongestPlanes = [];

  for (const [key, numbers] of Object.entries(planes)) {
    const presentCount = numbers.filter(n => gridCounts[n] > 0).length;
    const percentage = Math.round((presentCount / 3) * 100); // 0%, 33%, 66%, 100%
    planeResults[key] = {
      percentage,
      presentCount,
      numbers
    };

    if (percentage > maxPercent) {
      maxPercent = percentage;
    }
  }

  // Identify all planes that tie for the highest completion percentage
  for (const [key, result] of Object.entries(planeResults)) {
    if (result.percentage === maxPercent && maxPercent > 0) {
      strongestPlanes.push(key);
    }
  }

  return {
    planes: planeResults,
    strongestPlanes,
    maxPercent
  };
}

/**
 * Calculates the Kua number using birth year and gender.
 * Male Kua = 10 - reduced last 2 digits of year. If 10, use 1.
 * Female Kua = 5 + reduced last 2 digits of year, reduced to single digit.
 * Other Kua = returns message.
 */
export function calculateKua(dobString, gender) {
  if (!dobString) return null;
  const parts = dobString.split('-'); // YYYY-MM-DD
  if (parts.length < 3) return null;
  const yearStr = parts[0];
  if (yearStr.length < 4) return null;
  const lastTwoDigits = parseInt(yearStr.substring(2, 4), 10);

  const reducedYearSum = reduceToSingleDigit(lastTwoDigits);

  if (gender === 'Male') {
    let kua = 10 - reducedYearSum;
    if (kua === 10) kua = 1;
    return { kua, gender };
  } else if (gender === 'Female') {
    const kua = reduceToSingleDigit(5 + reducedYearSum);
    return { kua, gender };
  } else {
    return {
      kua: null,
      gender,
      message: "Kua number can vary by method; choose Male/Female for traditional calculation."
    };
  }
}
