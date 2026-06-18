/**
 * Converts a numeric amount into Indian Rupees wording format.
 * E.g., 2039.00 -> "Two Thousand and Thirty Nine Rupees only"
 * E.g., 5500.50 -> "Five Thousand Five Hundred Rupees and Fifty Paise only"
 * 
 * @param {number} amount - The currency amount to convert
 * @returns {string} - The amount formatted in words
 */
export function numberToWords(amount) {
  if (amount === 0 || isNaN(amount)) return 'Zero Rupees only';
  
  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const doubleDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanOneThousand = (num) => {
    let word = '';
    if (num >= 100) {
      word += singleDigits[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 10 && num < 20) {
      word += doubleDigits[num - 10] + ' ';
    } else if (num >= 20) {
      word += tensMultiple[Math.floor(num / 10)] + ' ' + singleDigits[num % 10] + ' ';
    } else if (num > 0) {
      word += singleDigits[num] + ' ';
    }
    return word;
  };
  
  // Round to two decimal places
  const roundedAmount = Math.round(amount * 100) / 100;
  const rupees = Math.floor(roundedAmount);
  const paise = Math.round((roundedAmount - rupees) * 100);
  
  let rupeesWord = '';
  let tempRupees = rupees;
  
  if (tempRupees >= 10000000) { // Crore
    rupeesWord += convertLessThanOneThousand(Math.floor(tempRupees / 10000000)) + 'Crore ';
    tempRupees %= 10000000;
  }
  if (tempRupees >= 100000) { // Lakh
    rupeesWord += convertLessThanOneThousand(Math.floor(tempRupees / 100000)) + 'Lakh ';
    tempRupees %= 100000;
  }
  if (tempRupees >= 1000) { // Thousand
    rupeesWord += convertLessThanOneThousand(Math.floor(tempRupees / 1000)) + 'Thousand ';
    tempRupees %= 1000;
  }
  if (tempRupees > 0) {
    rupeesWord += convertLessThanOneThousand(tempRupees);
  }
  
  rupeesWord = rupeesWord.trim();
  if (rupeesWord) {
    rupeesWord += ' Rupees';
  }
  
  let paiseWord = '';
  if (paise > 0) {
    const paiseText = convertLessThanOneThousand(paise).trim();
    if (rupeesWord) {
      paiseWord = ' and ' + paiseText + ' Paise';
    } else {
      paiseWord = paiseText + ' Paise';
    }
  }
  
  const finalWord = (rupeesWord + paiseWord).trim();
  return finalWord ? finalWord + ' only' : 'Zero Rupees only';
}
